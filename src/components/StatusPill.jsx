const COLORS = {
    cancellata: { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', label: 'Cancellata' },
    confermata: { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', label: 'Confermata' },
    default: { color: 'var(--accent)', bg: 'var(--accent-dim)', border: 'rgba(212,168,83,0.2)', label: 'In attesa' },
};

export default function StatusPill({ status }) {
    const c = COLORS[status] || COLORS.default;
    return (
        <span style={{
            fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '3px 10px', borderRadius: '4px',
            color: c.color, background: c.bg, border: `1px solid ${c.border}`,
        }}>
            {c.label}
        </span>
    );
}
