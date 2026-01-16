import StatCard from '../components/StatCard';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/calculations';

export default function VentaConfirmadaTab({ lastSale }) {
    if (!lastSale) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3 className="empty-state-title">Sin ventas registradas</h3>
                <p className="empty-state-text">
                    Pulsa el botón + para añadir tu primera venta del día
                </p>
            </div>
        );
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="venta-confirmada">
            {/* Header with date and employee */}
            <div className="venta-header">
                <div className="venta-header-info">
                    <span className="venta-date">{formatDate(lastSale.fecha)}</span>
                    <span className="venta-empleada">👤 {lastSale.empleada}</span>
                </div>
                <div className="venta-total-highlight">
                    <span className="venta-total-label">Total Venta</span>
                    <span className="venta-total-value">{formatCurrency(lastSale.venta)}</span>
                </div>
            </div>

            {/* All parameters for reporting - 2 column layout */}
            <div className="report-section">
                <h3 className="section-title">📋 Datos para Reporte</h3>

                <div className="report-grid">
                    {/* Left Column - Input Data */}
                    <div className="report-column">
                        <h4 className="report-column-title">Datos de Entrada</h4>
                        <div className="report-item">
                            <span className="report-label">Clientes (visitantes)</span>
                            <span className="report-value">{lastSale.clientes}</span>
                        </div>
                        <div className="report-item">
                            <span className="report-label">Operaciones (tickets)</span>
                            <span className="report-value">{lastSale.operaciones}</span>
                        </div>
                        <div className="report-item">
                            <span className="report-label">Unidades vendidas</span>
                            <span className="report-value">{lastSale.unidades}</span>
                        </div>
                        <div className="report-item">
                            <span className="report-label">Venta total</span>
                            <span className="report-value highlight">{formatCurrency(lastSale.venta)}</span>
                        </div>
                        <div className="report-item">
                            <span className="report-label">Horas trabajadas</span>
                            <span className="report-value">{formatNumber(lastSale.horasTrabajadas, 1)} h</span>
                        </div>
                    </div>

                    {/* Right Column - Calculated Ratios */}
                    <div className="report-column">
                        <h4 className="report-column-title">Ratios Calculados</h4>
                        <div className="report-item">
                            <span className="report-label">Conversión</span>
                            <span className={`report-value ${lastSale.conversion >= 15 ? 'success' : lastSale.conversion >= 10 ? 'warning' : 'danger'}`}>
                                {formatPercentage(lastSale.conversion)}
                            </span>
                        </div>
                        <div className="report-item">
                            <span className="report-label">APO (arts/operación)</span>
                            <span className="report-value">{formatNumber(lastSale.apo)}</span>
                        </div>
                        <div className="report-item">
                            <span className="report-label">PMV (precio medio)</span>
                            <span className="report-value">{formatCurrency(lastSale.pmv)}</span>
                        </div>
                        <div className="report-item">
                            <span className="report-label">Ticket Medio</span>
                            <span className="report-value highlight">{formatCurrency(lastSale.ticketMedio)}</span>
                        </div>
                        <div className="report-item">
                            <span className="report-label">Productividad (€/hora)</span>
                            <span className="report-value">{formatCurrency(lastSale.productividad)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Cards Summary */}
            <h3 className="section-title mt-lg">📊 KPIs Principales</h3>
            <div className="stats-grid">
                <StatCard
                    label="Conversión"
                    value={formatPercentage(lastSale.conversion)}
                    variant={lastSale.conversion >= 15 ? 'success' : lastSale.conversion >= 10 ? 'warning' : 'danger'}
                />
                <StatCard
                    label="Ticket Medio"
                    value={formatCurrency(lastSale.ticketMedio)}
                />
                <StatCard
                    label="PMV"
                    value={formatCurrency(lastSale.pmv)}
                />
                <StatCard
                    label="Productividad"
                    value={formatCurrency(lastSale.productividad)}
                    unit="/hora"
                />
            </div>
        </div>
    );
}
