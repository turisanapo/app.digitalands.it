-- ============================================
-- Digitalands v2 — Initial schema (from scratch)
-- Applied by `supabase db reset` / `supabase db push`
-- ============================================

-- ─── PROFILES ─────────────────────────────────────────────────────

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT,
    role TEXT DEFAULT 'guest',

    -- registration extras
    employment_type TEXT,
    profession TEXT,
    vat_number TEXT,
    company_name TEXT,
    company_role TEXT,
    stats_metadata JSONB DEFAULT '{}',

    -- flags
    onboarded BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,

    -- Stripe Connect
    stripe_account_id TEXT,
    stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
    stripe_charges_enabled BOOLEAN DEFAULT FALSE,

    -- shared profile fields
    bio TEXT,
    avatar_url TEXT,
    phone TEXT,
    website_url TEXT,
    city TEXT,
    country TEXT DEFAULT 'IT',
    languages TEXT[] DEFAULT ARRAY['it'],
    instagram_url TEXT,

    -- digital nomad (guest) fields
    work_type TEXT,
    skills TEXT[],
    linkedin_url TEXT,
    portfolio_url TEXT,
    remote_since_year INTEGER,
    preferred_stay_duration TEXT,
    has_vehicle BOOLEAN DEFAULT FALSE,
    dietary_restrictions TEXT[],

    -- manager shared fields
    verification_status TEXT DEFAULT 'pending',
    manager_bio TEXT,
    manager_city TEXT,

    -- activity manager fields
    certifications TEXT[],
    years_experience INTEGER,
    team_size TEXT,
    languages_spoken TEXT[],

    role_metadata JSONB DEFAULT '{}'
);

-- Auto-create a profile from auth signup metadata (register() passes
-- name/role/etc. via options.data)
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, name, role, employment_type, profession, vat_number, company_name, company_role)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'name',
        COALESCE(NEW.raw_user_meta_data->>'role', 'guest'),
        NEW.raw_user_meta_data->>'employment_type',
        NEW.raw_user_meta_data->>'profession',
        NEW.raw_user_meta_data->>'vat_number',
        NEW.raw_user_meta_data->>'company_name',
        NEW.raw_user_meta_data->>'company_role'
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Public read for verified managers (shown on listings)
CREATE POLICY "Public read verified manager profiles"
    ON profiles FOR SELECT
    USING (
        role IN ('property_manager', 'activity_manager')
        AND verification_status = 'verified'
    );

-- ─── PROPERTIES ───────────────────────────────────────────────────
-- TEXT ids: seed data uses slugs ('p1'), manager-created rows use UUIDs-as-text

CREATE TABLE properties (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    location TEXT,
    comune TEXT,
    price_per_night INTEGER NOT NULL,
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    description TEXT,
    long_description TEXT,
    specs TEXT[],
    amenities TEXT[],
    highlights TEXT[],
    arch_color TEXT,
    map_url TEXT,
    published BOOLEAN DEFAULT TRUE
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published properties"
    ON properties FOR SELECT
    USING (published = true);

CREATE POLICY "Managers read own properties"
    ON properties FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Managers insert own properties"
    ON properties FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Managers update own properties"
    ON properties FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Managers delete own properties"
    ON properties FOR DELETE
    USING (auth.uid() = owner_id);

-- ─── ACTIVITIES ───────────────────────────────────────────────────

CREATE TABLE activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title TEXT,
    name TEXT,
    category TEXT,
    price INTEGER,
    description TEXT,
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    duration TEXT,
    emoji TEXT,
    location TEXT,
    meeting_point TEXT,
    meeting_point_url TEXT,
    slots JSONB DEFAULT '[]',
    published BOOLEAN DEFAULT FALSE
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published activities"
    ON activities FOR SELECT
    USING (published = true);

CREATE POLICY "Managers read own activities"
    ON activities FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Managers insert own activities"
    ON activities FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Managers update own activities"
    ON activities FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Managers delete own activities"
    ON activities FOR DELETE
    USING (auth.uid() = owner_id);

-- ─── BOOKINGS ─────────────────────────────────────────────────────
-- Written only by the API (service role bypasses RLS)

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    property_id TEXT REFERENCES properties(id) ON DELETE SET NULL,
    activity_id TEXT REFERENCES activities(id) ON DELETE SET NULL,
    property_name TEXT,
    activity_name TEXT,
    check_in DATE,
    check_out DATE,
    guests INTEGER,
    months INTEGER,
    time_slot TEXT,
    category TEXT,
    emoji TEXT,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'in-attesa',
    payment_status TEXT DEFAULT 'pending',
    platform_fee INTEGER,
    manager_payout INTEGER,
    stripe_checkout_session_id TEXT,
    stripe_payment_intent_id TEXT
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own bookings"
    ON bookings FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Managers read activity bookings"
    ON bookings FOR SELECT
    USING (
        activity_id IN (
            SELECT id FROM activities WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Managers read property bookings"
    ON bookings FOR SELECT
    USING (
        property_id IN (
            SELECT id FROM properties WHERE owner_id = auth.uid()
        )
    );

-- ─── PAYMENTS (audit) ─────────────────────────────────────────────

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    stripe_payment_intent_id TEXT,
    amount INTEGER NOT NULL,
    platform_fee INTEGER NOT NULL,
    manager_payout INTEGER NOT NULL,
    currency TEXT DEFAULT 'eur',
    status TEXT DEFAULT 'pending',
    manager_stripe_account_id TEXT,
    guest_user_id UUID,
    manager_user_id UUID
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers read own payments"
    ON payments FOR SELECT
    USING (manager_user_id = auth.uid());

CREATE POLICY "Guests read own payments"
    ON payments FOR SELECT
    USING (guest_user_id = auth.uid());

-- ─── REVIEWS ──────────────────────────────────────────────────────
-- Polymorphic: entity_type + entity_id

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('activity', 'property')),
    entity_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    profiles_id UUID REFERENCES profiles(id) ON DELETE SET NULL
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read reviews"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Users insert own reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users delete own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = user_id);

-- ─── WAITLIST ─────────────────────────────────────────────────────
-- WaitlistCTA relies on the unique violation (23505) to treat repeats as success

CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    email TEXT NOT NULL UNIQUE
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
    ON waitlist FOR INSERT
    WITH CHECK (true);

-- ─── STORAGE (image buckets) ──────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('properties', 'properties', true), ('activities', 'activities', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access Properties Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'properties');

CREATE POLICY "Public Access Activities Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'activities');

CREATE POLICY "Authenticated owners can upload property images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'properties' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated owners can upload activity images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'activities' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated owners can delete their property images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'properties' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated owners can delete their activity images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'activities' AND auth.role() = 'authenticated');

-- ─── INDEXES ──────────────────────────────────────────────────────

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_verification ON profiles(verification_status);
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_published ON properties(published);
CREATE INDEX idx_activities_owner ON activities(owner_id);
CREATE INDEX idx_activities_published ON activities(published);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_activity ON bookings(activity_id);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_checkout ON bookings(stripe_checkout_session_id);
CREATE INDEX idx_bookings_payment_intent ON bookings(stripe_payment_intent_id);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_guest ON payments(guest_user_id);
CREATE INDEX idx_payments_manager ON payments(manager_user_id);
CREATE INDEX idx_reviews_entity ON reviews(entity_type, entity_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
