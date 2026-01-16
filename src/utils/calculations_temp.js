export function aggregateSales(salesArray) {
    if (!salesArray || salesArray.length === 0) {
        return null;
    }

    const initialStats = {
        clientes: 0,
        operaciones: 0,
        unidades: 0,
        venta: 0,
        horasTrabajadas: 0,
    };

    const totals = salesArray.reduce((acc, sale) => {
        return {
            clientes: acc.clientes + (sale.clientes || 0),
            operaciones: acc.operaciones + (sale.operaciones || 0),
            unidades: acc.unidades + (sale.unidades || 0),
            venta: acc.venta + (sale.venta || 0),
            horasTrabajadas: acc.horasTrabajadas + (sale.horasTrabajadas || 0),
        };
    }, initialStats);

    // Recalculate ratios based on the aggregated totals
    // Using calculateRatios logic but allowing for potential 0 values without erroring immediately if we just want to return safe defaults
    // However, calculateRatios throws if inputs are 0 or less. We should handle that.

    // Safety check for division by zero, although calculateRatios handles some validations
    if (totals.clientes === 0 && totals.operaciones === 0) {
        return {
            ...totals,
            conversion: 0,
            apo: 0,
            pmv: 0,
            ticketMedio: 0,
            productividad: 0
        }
    }

    try {
        const ratios = calculateRatios(totals);
        return {
            ...totals,
            ...ratios
        };
    } catch (e) {
        // Fallback if validation fails (e.g. 0 clients)
        return {
            ...totals,
            conversion: 0,
            apo: 0,
            pmv: 0,
            ticketMedio: 0,
            productividad: 0
        };
    }
}
