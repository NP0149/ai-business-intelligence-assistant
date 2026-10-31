const analytics = require("../services/analyticsService");
const { understandQuestion } = require("../services/aiService");

async function getAnalytics(req, res) {
    try {
        let { question, type, month1, month2 } = req.body;

        if (question) {
            const intent = await understandQuestion(question);
            type = intent.type;
            month1 = intent.month1;
            month2 = intent.month2;
        }

        let data;
        let answer;

        switch (type) {
            case "total_revenue":
                data = analytics.getTotalRevenue();
                answer = "Total revenue calculated successfully";
                break;

            case "top_product":
                data = analytics.getTopProduct();
                answer = "Highest revenue-generating product";
                break;

            case "monthly_revenue":
                data = analytics.getMonthlyRevenue();
                answer = "Monthly revenue trend";
                break;

            case "top_region":
                data = analytics.getTopRegion();
                answer = "Highest revenue-generating region";
                break;

            case "compare_months":
                if (
                    !/^\d{4}-(0[1-9]|1[0-2])$/.test(month1 || "") ||
                    !/^\d{4}-(0[1-9]|1[0-2])$/.test(month2 || "")
                ) {
                    return res.status(400).json({
                        success: false,
                        error: "Please provide two valid months in YYYY-MM format."
                    });
                }

                data = analytics.compareMonths(month1, month2);
                answer = "Monthly revenue comparison";
                break;

            default:
                return res.status(400).json({
                    success: false,
                    error: "Unsupported question type"
                });
        }

        res.json({
            success: true,
            question: question || null,
            type,
            answer,
            data
        });

    } catch (error) {
        console.error("Analytics error:", error.message);

        res.status(500).json({
            success: false,
            error: "Unable to process your question. Please try again."
        });
    }
}

module.exports = { getAnalytics };
