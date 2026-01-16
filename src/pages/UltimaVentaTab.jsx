import { useState, useMemo } from 'react';
import StatCard from '../components/StatCard';
import { formatCurrency, formatPercentage, formatNumber, aggregateSales } from '../utils/calculations';

export default function VentaTab({ dailyTotal, todaysSales }) {
    const [selectedEmployee, setSelectedEmployee] = useState('ALL'); // 'ALL', 'Ingrid', or 'Marta'

    // Find individual sales
    const ingridSale = useMemo(() => todaysSales?.find(s => s.empleada === 'Ingrid'), [todaysSales]);
    const martaSale = useMemo(() => todaysSales?.find(s => s.empleada === 'Marta'), [todaysSales]);

    // Calculate data to display based on selection
    const displayData = useMemo(() => {
        if (selectedEmployee === 'Ingrid') return ingridSale;
        if (selectedEmployee === 'Marta') return martaSale;
        return dailyTotal;
    }, [selectedEmployee, ingridSale, martaSale, dailyTotal]);

    // Handle empty state (no sales at all today)
    if (!dailyTotal && (!todaysSales || todaysSales.length === 0)) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3 className="empty-state-title">Sin ventas hoy</h3>
                <p className="empty-state-text">
                    Pulsa el botón + para añadir la venta de Ingrid o Marta
                </p>
            </div>
        );
    }

    const formatDate = () => {
        return new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isSelected = (emp) => selectedEmployee === emp;

    return (
        <div className="venta-confirmada">
            <div className="date-header text-center mb-md">
                <span className="venta-date">{formatDate()}</span>
            </div>

            {/* Split Header for Two Employees */}
            <div className="split-header">
                {/* Ingrid's Side */}
                <div
                    className={`employee-card ${isSelected('Ingrid') ? 'active' : ''}`}
                    onClick={() => setSelectedEmployee(isSelected('Ingrid') ? 'ALL' : 'Ingrid')}
                >
                    <div className="employee-name">Ingrid</div>
                    <div className="employee-total">
                        {ingridSale ? formatCurrency(ingridSale.venta) : 'Pending'}
                    </div>
                    {ingridSale && <div className="employee-status">✓ Registrado</div>}
                </div>

                {/* Marta's Side */}
                <div
                    className={`employee-card ${isSelected('Marta') ? 'active' : ''}`}
                    onClick={() => setSelectedEmployee(isSelected('Marta') ? 'ALL' : 'Marta')}
                >
                    <div className="employee-name">Marta</div>
                    <div className="employee-total">
                        {martaSale ? formatCurrency(martaSale.venta) : 'Pending'}
                    </div>
                    {martaSale && <div className="employee-status">✓ Registrado</div>}
                </div>
            </div>

            {/* Combined Total Display (Only visible when ALL is selected) */}
            {selectedEmployee === 'ALL' && (
                <div className="venta-total-highlight text-center mb-lg">
                    <span className="venta-total-label">Total Día</span>
                    <span className="venta-total-value">{formatCurrency(dailyTotal?.venta || 0)}</span>
                </div>
            )}

            {/* Detail Report Section */}
            {!displayData ? (
                <div className="empty-selection-state">
                    <p>No hay datos registrados para {selectedEmployee}</p>
                </div>
            ) : (
                <>
                    <div className="report-section">
                        <h3 className="section-title">
                            📋 Datos para Reporte ({selectedEmployee === 'ALL' ? 'Total' : selectedEmployee})
                        </h3>

                        <div className="report-grid">
                            {/* Left Column - Input Data */}
                            <div className="report-column">
                                <h4 className="report-column-title">Datos de Entrada</h4>
                                <div className="report-item">
                                    <span className="report-label">Clientes (visitantes)</span>
                                    <span className="report-value">{displayData.clientes}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Operaciones (tickets)</span>
                                    <span className="report-value">{displayData.operaciones}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Unidades vendidas</span>
                                    <span className="report-value">{displayData.unidades}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Venta total</span>
                                    <span className="report-value highlight">{formatCurrency(displayData.venta)}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Horas trabajadas</span>
                                    <span className="report-value">{formatNumber(displayData.horasTrabajadas, 1)} h</span>
                                </div>
                            </div>

                            {/* Right Column - Calculated Ratios */}
                            <div className="report-column">
                                <h4 className="report-column-title">Ratios Calculados</h4>
                                <div className="report-item">
                                    <span className="report-label">Conversión</span>
                                    <span className={`report-value ${displayData.conversion >= 15 ? 'success' : displayData.conversion >= 10 ? 'warning' : 'danger'}`}>
                                        {formatPercentage(displayData.conversion)}
                                    </span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">APO (arts/operación)</span>
                                    <span className="report-value">{formatNumber(displayData.apo)}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">PMV (precio medio)</span>
                                    <span className="report-value">{formatCurrency(displayData.pmv)}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Ticket Medio</span>
                                    <span className="report-value highlight">{formatCurrency(displayData.ticketMedio)}</span>
                                </div>
                                <div className="report-item">
                                    <span className="report-label">Productividad (€/hora)</span>
                                    <span className="report-value">{formatCurrency(displayData.productividad)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Cards Summary */}
                    <h3 className="section-title mt-lg">📊 KPIs Principales</h3>
                    <div className="stats-grid">
                        <StatCard
                            label="Conversión"
                            value={formatPercentage(displayData.conversion)}
                            variant={displayData.conversion >= 15 ? 'success' : displayData.conversion >= 10 ? 'warning' : 'danger'}
                        />
                        <StatCard
                            label="Ticket Medio"
                            value={formatCurrency(displayData.ticketMedio)}
                        />
                        <StatCard
                            label="PMV"
                            value={formatCurrency(displayData.pmv)}
                        />
                        <StatCard
                            label="Productividad"
                            value={formatCurrency(displayData.productividad)}
                            unit="/hora"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
