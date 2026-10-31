const express = require("express");
const router = express.Router();

const { getAnalytics } = require("../controllers/analyticsController");

router.post("/ask", getAnalytics);

module.exports = router;