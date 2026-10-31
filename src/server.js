require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", analyticsRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "BI Assistant API is running"
    });
});

// Export app for automated testing
module.exports = app;

// Start server only when running this file directly
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
