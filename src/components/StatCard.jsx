export default function StatCard({ label, value, unit, trend, variant }) {
    const getVariantClass = () => {
        switch (variant) {
            case 'success': return 'text-success';
            case 'warning': return 'text-warning';
            case 'danger': return 'text-danger';
            default: return '';
        }
    };

    return (
        <div className="card stat-card">
            <span className="stat-card-label">{label}</span>
            <div className="stat-card-value">
                <span className={getVariantClass()}>{value}</span>
                {unit && <span className="stat-card-unit"> {unit}</span>}
            </div>
            {trend && (
                <span className={`stat-card-trend ${trend.direction}`}>
                    {trend.direction === 'positive' ? '↑' : trend.direction === 'negative' ? '↓' : ''}
                    {trend.percentage}%
                </span>
            )}
        </div>
    );
}
