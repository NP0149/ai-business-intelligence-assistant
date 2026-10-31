const Database = require("better-sqlite3");
const path = require("path");

// Database file location
const dbPath = path.join(__dirname, "../../data/sales.db");

// Connect to SQLite
const db = new Database(dbPath);

// Create sales table
db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
        transaction_id TEXT PRIMARY KEY,
        order_date TEXT NOT NULL,
        product TEXT NOT NULL,
        category TEXT NOT NULL,
        region TEXT NOT NULL,
        sales_channel TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        discount_amount REAL NOT NULL,
        status TEXT NOT NULL
    )
`);

console.log("SQLite database connected successfully!");

module.exports = db;
