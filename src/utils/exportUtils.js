/**
 * Convert sales data to CSV format and trigger download
 * @param {Array} sales - Array of sales objects
 */
export function exportSalesToCSV(sales) {
    if (!sales || sales.length === 0) {
        alert("No hay datos para exportar");
        return;
    }

    // Define CSV headers
    const headers = [
        "Fecha",
        "Empleada",
        "Venta Total (€)",
        "Unidades",
        "Operaciones",
        "Clientes",
        "Horas Trabajadas",
        "Conversion (%)",
        "Ticket Medio (€)",
        "UPT (Unidades/Ticket)",
        "PMV (Precio Medio Venta)",
        "Productividad (€/h)"
    ];

    // Helper to format values for CSV
    const formatValue = (val) => {
        if (typeof val === 'number') {
            return val.toFixed(2).replace('.', ','); // Excel prefers comma for decimals in some locales, or dot. keeping standard? 
            // Actually, for Spanish locale Excel often expects comma. Let's use standard dot for broad compatibility or comma if user prefers.
            // Let's stick to standard CSV format (dot for decimals) to avoid delimiter confusion, 
            // but since user is Spanish, they might expect semicolon delimiter and comma decimals.
            // Let's try standard US format first (comma delimiter, dot decimal) as it's safer for systems.
        }
        if (val instanceof Date) return val.toLocaleDateString();
        return val ? `"${String(val).replace(/"/g, '""')}"` : "";
    };

    // Construct CSV content
    const csvContent = [
        headers.join(","), // Header row
        ...sales.map(sale => {
            const dateStr = new Date(sale.fecha).toLocaleDateString();
            return [
                dateStr,
                `"${sale.empleada}"`,
                sale.venta,
                sale.unidades,
                sale.operaciones,
                sale.clientes,
                sale.horasTrabajadas,
                sale.conversion,
                sale.ticketMedio,
                sale.apo, // UPT
                sale.pmv,
                sale.productividad
            ].map(val => {
                // Handle undefined/null
                if (val === null || val === undefined) return "";
                // If string with comma, quote it
                if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
                return val;
            }).join(",");
        })
    ].join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `ventas_altonadock_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
