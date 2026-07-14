-- Demo seed data. Auto-applied by `supabase db reset` (see config.toml [db.seed]).
-- Safe to re-run: upserts on id.

-- ─── Properties ───────────────────────────────────────────────────

INSERT INTO public.properties (id, name, location, comune, price_per_night, image_url, arch_color, specs, description, highlights, amenities, long_description, map_url)
VALUES
('p1', 'Villa Barocca Heritage', 'Ragusa Ibla', 'Ragusa', 180, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'rgba(212,168,83,0.18)', ARRAY['100 Mbps', 'Workstation', 'A/C centralizzata'], 'Una dimora storica nel cuore di Ragusa Ibla...', ARRAY['Connessione testata 100Mbps', 'Tavolo da lavoro ergonomico'], ARRAY['WiFi Fibra', 'Cucina completa'], 'Soggiorna in un pezzo di storia siciliana...', 'https://goo.gl/maps/ragusa1'),
('p2', 'Masseria Modica Hills', 'Modica Alta', 'Modica', 140, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', 'rgba(180,130,60,0.18)', ARRAY['150 Mbps', 'Home office privativo'], 'Immersa nelle campagne modicane...', ARRAY['Ufficio privato silenzioso', 'Piscina a sfioro'], ARRAY['WiFi Starlink', 'Piscina'], 'La quiete della campagna modicana...', 'https://goo.gl/maps/modica1'),
('p3', 'Casa sul Mare Pozzallo', 'Pozzallo Lungomare', 'Pozzallo', 120, 'https://images.unsplash.com/photo-1548013146-72479768bada', 'rgba(53,140,220,0.2)', ARRAY['200 Mbps', 'Vista mare 180°'], 'Addormentati col rumore delle onde...', ARRAY['Fronte spiaggia', 'Terrazza coperta attrezzata'], ARRAY['WiFi 200Mbps', 'Climatizzazione'], 'Questo appartamento è stato progettato...', 'https://goo.gl/maps/pozzallo1')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    location = EXCLUDED.location,
    comune = EXCLUDED.comune,
    price_per_night = EXCLUDED.price_per_night,
    image_url = EXCLUDED.image_url,
    map_url = EXCLUDED.map_url;

-- ─── Activities ───────────────────────────────────────────────────
-- The app reads `title` for DB activities and only lists published ones

INSERT INTO public.activities (id, title, name, category, description, price, duration, emoji, image_url, location, meeting_point, slots, published)
VALUES
('surf-marina', 'Surf — Marina di Ragusa', 'Surf — Marina di Ragusa', 'Surf', 'Lezione di surf per principianti e intermedi...', 65, '2h', '🏄', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f', 'Marina di Ragusa', 'Lungomare Andrea Doria', '["09:00", "11:00", "16:00"]', true),
('etna-trekking', 'Trekking — Chiaramonte Gulfi', 'Trekking — Chiaramonte Gulfi', 'Escursioni', 'Escursione guidata tra i boschi iblei...', 55, '6h', '🌋', 'https://images.unsplash.com/photo-1516912481808-3406841bd33c', 'Chiaramonte Gulfi', 'Piazza Duomo, Chiaramonte Gulfi', '["09:00"]', true),
('street-food-modica', 'Street Food — Modica', 'Street Food — Modica', 'Food & Wine', 'Tour gastronomico nel centro storico di Modica...', 40, '2h 30min', '🍋', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5', 'Modica', 'Corso Umberto I, Modica', '["11:00", "18:00"]', true)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    emoji = EXCLUDED.emoji,
    meeting_point = EXCLUDED.meeting_point,
    published = EXCLUDED.published;

-- ─── Sample reviews (only if a user exists) ───────────────────────

DO $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM auth.users LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.reviews (user_id, entity_type, entity_id, rating, comment)
        VALUES
        (v_user_id, 'property', 'p1', 5, 'Posto incredibile! La connessione è velocissima e il borgo è un sogno.'),
        (v_user_id, 'property', 'p2', 4, 'Masseria bellissima, pace assoluta. Perfetto per concentrarsi.'),
        (v_user_id, 'activity', 'surf-marina', 5, 'Prima volta sul surf, esperienza fantastica!'),
        (v_user_id, 'activity', 'etna-trekking', 5, 'Vista mozzafiato, la guida era molto preparata.')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
