/**
 * Sales calculation engine
 * Calculates all KPIs from input data
 */

/**
 * Calculate all sales ratios from input data
 * @param {Object} input - Input data from user
 * @param {number} input.clientes - Number of visitors
 * @param {number} input.operaciones - Number of transactions
 * @param {number} input.unidades - Total units sold
 * @param {number} input.venta - Total sales in €
 * @param {number} input.horasTrabajadas - Hours worked
 * @returns {Object} Calculated ratios
 */
export function calculateRatios(input) {
    const { clientes, operaciones, unidades, venta, horasTrabajadas } = input;

    // Validate inputs to avoid division by zero
    if (clientes <= 0 || operaciones <= 0 || unidades <= 0 || horasTrabajadas <= 0) {
        throw new Error('Todos los valores deben ser mayores que 0');
    }

    // Calculate ratios
    const conversion = (operaciones * 100) / clientes;
    const apo = unidades / operaciones;
    const pmv = venta / unidades;
    const ticketMedio = venta / operaciones;
    const productividad = venta / horasTrabajadas;

    return {
        conversion: roundTo(conversion, 2),
        apo: roundTo(apo, 2),
        pmv: roundTo(pmv, 2),
        ticketMedio: roundTo(ticketMedio, 2),
        productividad: roundTo(productividad, 2)
    };
}

/**
 * Validate that Ticket Medio = APO × PMV (cross-validation)
 * @param {Object} ratios - Calculated ratios
 * @returns {boolean} True if validation passes
 */
export function validateCalculations(ratios) {
    const { apo, pmv, ticketMedio } = ratios;
    const expectedTicketMedio = apo * pmv;
    const tolerance = 0.01; // Allow small floating point differences

    return Math.abs(ticketMedio - expectedTicketMedio) < tolerance;
}

/**
 * Round number to specified decimal places
 * @param {number} value - Number to round
 * @param {number} decimals - Decimal places
 * @returns {number} Rounded number
 */
export function roundTo(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/**
 * Format currency value
 * @param {number} value - Value to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format percentage value
 * @param {number} value - Value to format (already in percentage form)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value) {
    return `${value.toFixed(2)}%`;
}

/**
 * Format number with decimals
 * @param {number} value - Value to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 2) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

/**
 * Calculate trend percentage between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {Object} Trend info with percentage and direction
 */
export function calculateTrend(current, previous) {
    if (previous === 0) {
        return { percentage: 0, direction: 'neutral' };
    }

    const change = ((current - previous) / previous) * 100;

    return {
        percentage: roundTo(Math.abs(change), 1),
        direction: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'
    };
}

/**
 * Get summary statistics from an array of sales
 * @param {Array} sales - Array of sale records
 * @param {string} field - Field to summarize
 * @returns {Object} Summary with avg, min, max, total
 */
export function getSummaryStats(sales, field) {
    if (!sales || sales.length === 0) {
        return { avg: 0, min: 0, max: 0, total: 0 };
    }

    const values = sales.map(sale => sale[field] || 0);
    const total = values.reduce((sum, val) => sum + val, 0);

    return {
        avg: roundTo(total / values.length, 2),
        min: roundTo(Math.min(...values), 2),
        max: roundTo(Math.max(...values), 2),
        total: roundTo(total, 2)
    };
}
