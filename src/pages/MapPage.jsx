import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { supabase } from '../lib/supabase';
import { SEED_PROPERTIES } from '../data/seedProperties';
import { COMUNE_COORDS } from '../data/comuni';

// Fix leaflet default icon paths (Vite/webpack asset issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom golden marker for activities
const activityIcon = L.divIcon({
    className: '',
    html: `<div style="width:32px;height:32px;background:#D4A853;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #0A0A0A;box-shadow:0 2px 8px rgba(0,0,0,0.5)">
             <span style="display:block;transform:rotate(45deg);font-size:14px;text-align:center;line-height:28px;">🏄</span>
           </div>`,
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
});

// Custom blue marker for properties
const propertyIcon = L.divIcon({
    className: '',
    html: `<div style="width:32px;height:32px;background:#60a5fa;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #0A0A0A;box-shadow:0 2px 8px rgba(0,0,0,0.5)">
             <span style="display:block;transform:rotate(45deg);font-size:14px;text-align:center;line-height:28px;">🏡</span>
           </div>`,
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
});

// ─── Seed data with coordinates (Ragusa province) ───
const SEED_ACTIVITIES = [
    { id: 'surf-marina', name: 'Surf — Marina di Ragusa', category: 'Surf', price: 65, duration: '2h', lat: 36.7833, lng: 14.5333 },
    { id: 'kite-surf', name: 'Kite Surf — Santa Croce Camerina', category: 'Kite Surf', price: 90, duration: '3h', lat: 36.8272, lng: 14.5233 },
    { id: 'yoga-cliff', name: 'Sunrise Yoga — Scicli', category: 'Yoga', price: 35, duration: '1h 30min', lat: 36.7919, lng: 14.7025 },
    { id: 'etna-trekking', name: 'Trekking — Chiaramonte Gulfi', category: 'Escursioni', price: 55, duration: '6h', lat: 37.0286, lng: 14.7019 },
    { id: 'snorkeling-zingaro', name: 'Snorkeling — Pozzallo', category: 'Snorkeling', price: 45, duration: '3h', lat: 36.7304, lng: 14.8486 },
    { id: 'street-food-modica', name: 'Street Food — Modica', category: 'Food & Wine', price: 40, duration: '2h 30min', lat: 36.8631, lng: 14.7746 },
    { id: 'wine-ragusa', name: 'Degustazione Vini — Ragusa', category: 'Food & Wine', price: 50, duration: '2h', lat: 36.9272, lng: 14.7186 },
    { id: 'kayak-ispica', name: 'Sea Kayak — Ispica', category: 'Escursioni', price: 55, duration: '4h', lat: 36.7878, lng: 14.9055 },
    { id: 'yoga-tramonto', name: 'Yoga al Tramonto — Vittoria', category: 'Yoga', price: 30, duration: '1h 30min', lat: 36.9551, lng: 14.5326 },
    { id: 'windsurf-comiso', name: 'Wind Surf — Comiso', category: 'Surf', price: 80, duration: '3h', lat: 36.9447, lng: 14.6069 },
];

const SEED_PROPERTY_PINS = SEED_PROPERTIES.map((p, i) => {
    const base = COMUNE_COORDS[p.comune] || [36.93, 14.72];
    return { ...p, lat: base[0] + (i * 0.002), lng: base[1] + (i * 0.002) };
});

export default function MapPage() {
    const { t } = useI18n();
    const [filter, setFilter] = useState('all');
    const [customActs, setCustomActs] = useState([]);
    const [customProps, setCustomProps] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const [actsRes, propsRes] = await Promise.all([
                supabase.from('activities').select('*').eq('published', true),
                supabase.from('properties').select('*').eq('published', true)
            ]);

            if (!actsRes.error && actsRes.data) {
                const mapped = actsRes.data.map((a, i) => {
                    const base = COMUNE_COORDS[a.location] || [36.93, 14.72];
                    return { ...a, name: a.title, lat: base[0] + (i * 0.003), lng: base[1] + (i * 0.003) };
                });
                setCustomActs(mapped);
            }

            if (!propsRes.error && propsRes.data) {
                const mapped = propsRes.data.map((p, i) => {
                    const base = COMUNE_COORDS[p.comune || p.location] || [36.93, 14.72];
                    return {
                        ...p,
                        pricePerNight: p.price_per_night,
                        location: p.comune || p.location,
                        lat: base[0] - (i * 0.003),
                        lng: base[1] - (i * 0.003)
                    };
                });
                setCustomProps(mapped);
            }
        }
        fetchData();
    }, []);

    const allActivities = [...SEED_ACTIVITIES, ...customActs];
    const allProperties = [...SEED_PROPERTY_PINS, ...customProps];

    const showActivities = filter === 'all' || filter === 'activities';
    const showProperties = filter === 'all' || filter === 'houses';

    const filterLabels = [
        { id: 'all', label: t('map_filter_all') },
        { id: 'houses', label: t('map_filter_houses') },
        { id: 'activities', label: t('map_filter_activities') },
    ];

    return (
        <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
            {/* Header */}
            <div style={{
                padding: '36px 24px 28px', textAlign: 'center',
                background: 'linear-gradient(160deg, var(--surface) 0%, var(--bg) 100%)',
                borderBottom: '1px solid var(--border)',
            }}>
                <div className="section-chip" style={{ margin: '0 auto 14px' }}>📍 {t('map_subtitle')}</div>
                <h1 style={{
                    fontFamily: "'Unbounded', sans-serif",
                    fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                    fontWeight: 700, color: 'var(--text-primary)',
                    marginBottom: '20px', lineHeight: 1.15,
                }}>
                    {t('map_title')}
                </h1>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {filterLabels.map(f => (
                        <button key={f.id} onClick={() => setFilter(f.id)}
                            style={{
                                padding: '7px 20px', borderRadius: '100px', fontSize: '0.82rem',
                                fontFamily: 'monospace', cursor: 'pointer',
                                border: filter === f.id ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                                background: filter === f.id ? 'var(--accent-dim)' : 'transparent',
                                color: filter === f.id ? 'var(--accent)' : 'var(--text-muted)',
                                transition: 'all 0.18s ease',
                            }}>
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#60a5fa', display: 'inline-block' }} />
                        {t('map_filter_houses')} ({allProperties.length})
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#D4A853', display: 'inline-block' }} />
                        {t('map_filter_activities')} ({allActivities.length})
                    </div>
                </div>
            </div>

            {/* Map */}
            <div style={{ height: 'calc(100vh - 280px)', minHeight: '500px', position: 'relative' }}>
                <style>{`
                    .leaflet-popup-content-wrapper {
                        background: #111 !important;
                        border: 1px solid #2E2E2E !important;
                        border-radius: 8px !important;
                        box-shadow: 0 4px 24px rgba(0,0,0,0.6) !important;
                        color: #F0F0F0 !important;
                    }
                    .leaflet-popup-tip { background: #111 !important; }
                    .leaflet-popup-content { margin: 14px 16px !important; }
                    .leaflet-container { background: #0A0A0A; }
                `}</style>
                <MapContainer
                    center={[36.88, 14.72]}
                    zoom={10}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {/* Activity pins */}
                    {showActivities && allActivities.map(a => (
                        <Marker key={a.id} position={[a.lat, a.lng]} icon={activityIcon}>
                            <Popup>
                                <div style={{ minWidth: '160px' }}>
                                    <div style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#D4A853', marginBottom: '4px' }}>
                                        {a.category}
                                    </div>
                                    <div style={{ fontWeight: 600, marginBottom: '4px', color: '#F0F0F0' }}>{a.name}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>⏱ {a.duration} · <span style={{ color: '#D4A853' }}>€{a.price}</span></div>
                                    <Link to="/activities" style={{ display: 'block', marginTop: '10px', fontSize: '11px', fontFamily: 'monospace', color: '#D4A853', textDecoration: 'none' }}>
                                        Prenota →
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Property pins */}
                    {showProperties && allProperties.map(p => (
                        <Marker key={p.id} position={[p.lat, p.lng]} icon={propertyIcon}>
                            <Popup>
                                <div style={{ minWidth: '160px' }}>
                                    <div style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#60a5fa', marginBottom: '4px' }}>
                                        📍 {p.location}
                                    </div>
                                    <div style={{ fontWeight: 600, marginBottom: '4px', color: '#F0F0F0' }}>{p.name}</div>
                                    <div style={{ fontSize: '12px', color: '#D4A853', fontWeight: 700 }}>€{p.pricePerNight} / notte</div>
                                    <Link to={`/property/${p.id}`} style={{ display: 'block', marginTop: '10px', fontSize: '11px', fontFamily: 'monospace', color: '#60a5fa', textDecoration: 'none' }}>
                                        Dettagli →
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
