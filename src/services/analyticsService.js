const db = require("../database/db");

// Only valid completed sales contribute to revenue.
const VALID_SALES = `
    status = 'Completed'
    AND quantity > 0
    AND unit_price > 0
    AND discount_amount >= 0
    AND discount_amount <= quantity * unit_price
`;

// 1. Total revenue
function getTotalRevenue() {
    return db.prepare(`
        SELECT
            SUM((quantity * unit_price) - discount_amount) AS total_revenue,
            COUNT(*) AS total_transactions
        FROM sales
        WHERE ${VALID_SALES}
    `).get();
}

// 2. Highest revenue-generating product
function getTopProduct() {
    return db.prepare(`
        SELECT
            product,
            SUM((quantity * unit_price) - discount_amount) AS revenue
        FROM sales
        WHERE ${VALID_SALES}
        GROUP BY product
        ORDER BY revenue DESC
        LIMIT 1
    `).get();
}

// 3. Monthly revenue trend
function getMonthlyRevenue() {
    return db.prepare(`
        SELECT
            substr(order_date, 1, 7) AS month,
            SUM((quantity * unit_price) - discount_amount) AS revenue
        FROM sales
        WHERE ${VALID_SALES}
        GROUP BY month
        ORDER BY month
    `).all();
}

// 4. Highest revenue-generating region
function getTopRegion() {
    return db.prepare(`
        SELECT
            region,
            SUM((quantity * unit_price) - discount_amount) AS revenue
        FROM sales
        WHERE ${VALID_SALES}
        GROUP BY region
        ORDER BY revenue DESC
        LIMIT 1
    `).get();
}

// 5. Compare revenue between two months
function compareMonths(month1, month2) {
    const query = db.prepare(`
        SELECT
            substr(order_date, 1, 7) AS month,
            SUM((quantity * unit_price) - discount_amount) AS revenue
        FROM sales
        WHERE ${VALID_SALES}
        AND substr(order_date, 1, 7) IN (?, ?)
        GROUP BY month
    `);

    const results = query.all(month1, month2);

    const revenue1 = results.find(r => r.month === month1)?.revenue || 0;
    const revenue2 = results.find(r => r.month === month2)?.revenue || 0;

    return {
        month1,
        revenue1,
        month2,
        revenue2,
        difference: revenue2 - revenue1,
        percentageChange: revenue1 === 0
            ? null
            : ((revenue2 - revenue1) / revenue1) * 100
    };
}

module.exports = {
    getTotalRevenue,
    getTopProduct,
    getMonthlyRevenue,
    getTopRegion,
    compareMonths
};