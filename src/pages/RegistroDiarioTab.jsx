import { useState, useMemo } from 'react';
import { formatCurrency, aggregateSales, unifyDailySales } from '../utils/calculations';
import DailyDetailModal from '../components/DailyDetailModal';

export default function RegistroDiarioTab({ sales, deleteSale, deleteMultipleSales }) {
    const [selectedDay, setSelectedDay] = useState(null);

    // Group sales by day
    const dailyRecords = useMemo(() => {
        if (!sales || sales.length === 0) return [];

        const grouped = {};

        sales.forEach(sale => {
            const dateStr = new Date(sale.fecha).toDateString();
            if (!grouped[dateStr]) {
                grouped[dateStr] = [];
            }
            grouped[dateStr].push(sale);
        });

        // Convert to array and sort descending
        return Object.entries(grouped)
            .map(([dateStr, dateSales]) => {
                const uniqueSales = unifyDailySales(dateSales);
                const aggregated = aggregateSales(uniqueSales);
                return {
                    dateStr,
                    rawDate: new Date(dateSales[0].fecha), // use first record's date
                    aggregated,
                    details: uniqueSales, // Use unique list for details too, to match totals
                    hasIngrid: uniqueSales.some(s => s.empleada === 'Ingrid'),
                    hasMarta: uniqueSales.some(s => s.empleada === 'Marta')
                };
            })
            .sort((a, b) => b.rawDate - a.rawDate);

    }, [sales]);

    const formatDateShort = (date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    const handleDeleteDay = async (dayData) => {
        if (!dayData || !dayData.details) return;

        // TARGET HIDDEN DUPLICATES:
        // We find ALL records in the global list that match the date and employees 
        // of the selected day. This ensures we clean up the "stack" of duplicates 
        // if they exist (which was the cause of the calculation bug).
        const targetIds = [];
        const targetDateStr = dayData.dateStr; // "Mon Jan 01 2024"

        dayData.details.forEach(detailSale => {
            // For each employee in this day's view (Ingrid/Marta)
            const employeeName = detailSale.empleada;

            // Find all matching records in the full sales list
            const duplicates = sales.filter(s => {
                const sDateStr = new Date(s.fecha).toDateString();
                return s.empleada === employeeName && sDateStr === targetDateStr;
            });

            duplicates.forEach(dup => targetIds.push(dup.id));
        });

        // Ensure unique IDs
        const uniqueIds = [...new Set(targetIds)];

        try {
            await Promise.all(uniqueIds.map(id => deleteSale(id)));
            setSelectedDay(null); // Close modal
        } catch (error) {
            console.error("Error deleting day records:", error);
            alert("Error al borrar los registros");
        }
    };

    if (!sales || sales.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <h3 className="empty-state-title">Sin registros</h3>
                <p className="empty-state-text">
                    El historial de registros diarios aparecerá aquí
                </p>
            </div>
        );
    }

    return (
        <div className="registro-diario">
            <h3 className="section-title">📅 Historial Diario</h3>

            <div className="daily-cards-grid">
                {dailyRecords.map((day) => (
                    <div
                        key={day.dateStr}
                        className="daily-card-visual"
                        onClick={() => setSelectedDay(day)}
                    >
                        <div className="daily-card-header">
                            <span className="daily-card-date">{formatDateShort(day.rawDate)}</span>
                            <div className="daily-badges-mini">
                                {day.hasIngrid && <span className="dot dot-ingrid" title="Ingrid"></span>}
                                {day.hasMarta && <span className="dot dot-marta" title="Marta"></span>}
                            </div>
                        </div>
                        <div className="daily-card-amount">
                            {formatCurrency(day.aggregated.venta)}
                        </div>
                        <div className="daily-card-footer">
                            <span className="text-muted text-xs">Ver detalle →</span>
                        </div>
                    </div>
                ))}
            </div>

            <DailyDetailModal
                isOpen={!!selectedDay}
                onClose={() => setSelectedDay(null)}
                dayData={selectedDay}
                onDelete={handleDeleteDay}
            />
        </div>
    );
}
