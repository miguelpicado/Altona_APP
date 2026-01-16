
// Mock calculateRatios to avoid dependency
function calculateRatios(input) {
    const { clientes, operaciones, unidades, venta, horasTrabajadas } = input;
    if (clientes <= 0 || operaciones <= 0 || unidades <= 0 || horasTrabajadas <= 0) return {};

    return {
        conversion: (operaciones * 100) / clientes,
        apo: unidades / operaciones,
        pmv: venta / unidades,
        ticketMedio: venta / operaciones,
        productividad: venta / horasTrabajadas
    };
}

function aggregateSales(salesArray) {
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

    /*
    console.log('--- Aggregation Step ---');
    console.log('Items:', salesArray.length);
    salesArray.forEach(s => console.log('Sale:', s.venta, typeof s.venta));
    console.log('Total Venta:', totals.venta);
    */

    return {
        ...totals,
        ...calculateRatios(totals)
    };
}

// Test Case
const testSales = [
    { clientes: 10, operaciones: 5, unidades: 10, venta: 500, horasTrabajadas: 4, empleada: 'Ingrid' },
    { clientes: 10, operaciones: 5, unidades: 10, venta: 500, horasTrabajadas: 4, empleada: 'Marta' }
];

console.log('Testing aggregation with number inputs:');
const result = aggregateSales(testSales);
console.log('Result Venta:', result.venta);

const testSalesStrings = [
    { clientes: 10, operaciones: 5, unidades: 10, venta: "500", horasTrabajadas: 4, empleada: 'Ingrid' },
    { clientes: 10, operaciones: 5, unidades: 10, venta: "500", horasTrabajadas: 4, empleada: 'Marta' }
];

console.log('Testing aggregation with string inputs:');
const resultStrings = aggregateSales(testSalesStrings);
console.log('Result Venta Strings:', resultStrings.venta);
