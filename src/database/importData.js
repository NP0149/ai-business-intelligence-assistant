const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const db = require("./db");

// CSV file location
const csvPath = path.join(__dirname, "../../data/sales.csv");

// Convert DD-MM-YYYY into YYYY-MM-DD
function convertDate(date) {
    const [day, month, year] = date.split("-");

    return `${year}-${month}-${day}`;
}

// Check whether CSV exists
if (!fs.existsSync(csvPath)) {
    console.error("Error: sales.csv not found inside data folder!");
    db.close();
    process.exit(1);
}

// Store CSV records
const records = [];

fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (row) => {
        records.push(row);
    })
    .on("end", () => {

        try {

            // Prepare SQL INSERT query
            const insert = db.prepare(`
                INSERT OR IGNORE INTO sales (
                    transaction_id,
                    order_date,
                    product,
                    category,
                    region,
                    sales_channel,
                    quantity,
                    unit_price,
                    discount_amount,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            // Import all records inside one transaction
            const importTransaction = db.transaction((rows) => {

                let inserted = 0;
                let skipped = 0;

                for (const row of rows) {

                    const quantity = Number(row.quantity);
                    const unitPrice = Number(row.unit_price);
                    const discount = Number(row.discount_amount);

                    // Basic data validation
                    if (
                        !row.transaction_id ||
                        !row.product ||
                        !row.order_date ||
                        !Number.isInteger(quantity) ||
                        quantity < 0 ||
                        !Number.isFinite(unitPrice) ||
                        unitPrice < 0 ||
                        !Number.isFinite(discount) ||
                        discount < 0
                    ) {
                        skipped++;
                        continue;
                    }

                    const values = [
                        row.transaction_id,
                        convertDate(row.order_date),
                        row.product,
                        row.category,
                        row.region,
                        row.sales_channel,
                        quantity,
                        unitPrice,
                        discount,
                        row.status
                    ];

                    const result = insert.run(...values);

                    if (result.changes === 1) {
                        inserted++;
                    } else {
                        skipped++;
                    }
                }

                return { inserted, skipped };
            });

            // Execute import
            const result = importTransaction(records);

            console.log("\n========== CSV IMPORT RESULTS ==========");

            console.log("Total CSV records:", records.length);
            console.log("Inserted records:", result.inserted);
            console.log("Skipped records:", result.skipped);

            // Verify database
            const count = db.prepare(
                "SELECT COUNT(*) AS total FROM sales"
            ).get();

            console.log("Total database records:", count.total);

            console.log("=========================================");

        } catch (error) {

            console.error("Import failed:", error.message);
            process.exitCode = 1;

        } finally {
            db.close();
        }
    })
    .on("error", (error) => {

        console.error("CSV reading error:", error.message);
        db.close();
        process.exitCode = 1;

    });