import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import CartDrawer from './components/CartDrawer';
import { I18nProvider } from './context/I18nContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhySicily from './components/WhySicily';
import HowItWorks from './components/HowItWorks';
import Properties from './components/Properties';
import FoundingMember from './components/FoundingMember';
import Testimonials from './components/Testimonials';
import WaitlistCTA from './components/WaitlistCTA';
import ScrollPlayer from './components/ScrollPlayer';
import { SicilyShowcase } from './remotion/SicilyShowcase';
import { StatsCounter } from './remotion/StatsCounter';
import Footer from './components/Footer';
import OnboardingOverlay from './components/OnboardingOverlay';

import { injectJSONLD } from './utils/seo';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MapPage = lazy(() => import('./pages/MapPage'));
const ActivityManagerDashboard = lazy(() => import('./pages/ActivityManagerDashboard'));
const PropertyManagerDashboard = lazy(() => import('./pages/PropertyManagerDashboard'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ActivityDetail = lazy(() => import('./pages/ActivityDetail'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const StripeOnboarding = lazy(() => import('./pages/StripeOnboarding'));

function LandingPage() {
    useEffect(() => {
        injectJSONLD();
        const els = document.querySelectorAll('[data-reveal]');
        if (!els.length) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        els.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Hero />
            <WhySicily />
            <ScrollPlayer id="sicily-showcase" label="Un giorno a Marina di Ragusa" component={SicilyShowcase} durationInFrames={180} />
            <HowItWorks />
            <ScrollPlayer id="stats" component={StatsCounter} durationInFrames={150} />
            <Properties />
            <FoundingMember />
            <Testimonials />
            <WaitlistCTA />
            <Footer />
        </>
    );
}

function NotFound() {
    return (
        <div style={{
            minHeight: '70vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '16px',
            color: 'var(--text-primary)', textAlign: 'center', padding: '24px',
        }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent)' }}>404</div>
            <h1 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '1.4rem', fontWeight: 700 }}>
                Pagina non trovata
            </h1>
            <Link to="/" className="btn-gold" style={{ padding: '10px 28px' }}>Torna alla home</Link>
        </div>
    );
}

// Basic Error Boundary to catch runtime crashes
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            const isLoadError = this.state.error?.name === 'ChunkLoadError' ||
                (this.state.error?.message && this.state.error.message.includes('dynamically imported module'));

            return (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    background: 'var(--bg)',
                    color: 'var(--text-primary)',
                    minHeight: '100vh',
                    fontFamily: 'monospace',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h1 style={{ color: 'var(--accent)', marginBottom: '16px' }}>
                        {isLoadError ? 'Aggiornamento disponibile' : 'Ops! Qualcosa è andato storto'}
                    </h1>
                    <p style={{ maxWidth: '600px', marginBottom: '24px', opacity: 0.8 }}>
                        {isLoadError
                            ? 'È stata pubblicata una nuova versione del sito. Ricarica la pagina per continuare.'
                            : this.state.error?.toString()}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-gold"
                        style={{ padding: '12px 32px' }}
                    >
                        {isLoadError ? 'Aggiorna ora' : 'Riprova'}
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <ThemeProvider>
                    <I18nProvider>
                        <AuthProvider>
                            <BookingProvider>
                                <CartDrawer />
                                <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
                                    <Navbar />
                                    <OnboardingOverlay />
                                    <Suspense fallback={
                                        <div className="min-h-[60vh] flex items-center justify-center">
                                            <svg className="animate-spin" viewBox="0 0 24 24" fill="none" width="32" height="32" aria-hidden="true">
                                                    <circle cx="12" cy="12" r="10" stroke="var(--border-light)" strokeWidth="2" />
                                                    <path d="M12 2a10 10 0 0110 10" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                        </div>
                                    }>
                                        <Routes>
                                            <Route path="/" element={<LandingPage />} />
                                            <Route path="/auth" element={<AuthPage />} />
                                            <Route path="/property/:id" element={<PropertyDetail />} />
                                            <Route path="/dashboard" element={<Dashboard />} />
                                            <Route path="/activities" element={<ActivitiesPage />} />
                                            <Route path="/activity/:id" element={<ActivityDetail />} />
                                            <Route path="/mappa" element={<MapPage />} />
                                            <Route path="/manager/activities" element={<ActivityManagerDashboard />} />
                                            <Route path="/manager/properties" element={<PropertyManagerDashboard />} />
                                            <Route path="/strutture" element={<PropertiesPage />} />
                                            <Route path="/properties" element={<PropertiesPage />} />
                                            <Route path="/blog" element={<BlogPage />} />
                                            <Route path="/blog/:slug" element={<BlogPostDetail />} />
                                            <Route path="/manager/stripe-onboarding" element={<StripeOnboarding />} />
                                            <Route path="*" element={<NotFound />} />
                                        </Routes>
                                    </Suspense>
                                </div>
                            </BookingProvider>
                        </AuthProvider>
                    </I18nProvider>
                </ThemeProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}
