async function understandQuestion(question) {
    const q = question.toLowerCase();

    // 1. Total revenue
    if (
        q.includes("total revenue") ||
        q.includes("overall revenue") ||
        q.includes("revenue generated") && !q.includes("product")
    ) {
        return { type: "total_revenue" };
    }

    // 2. Highest revenue product
    if (
        q.includes("product") &&
        (
            q.includes("highest") ||
            q.includes("top") ||
            q.includes("best") ||
            q.includes("most revenue")
        )
    ) {
        return { type: "top_product" };
    }

    // 3. Monthly revenue
    if (
        q.includes("monthly") ||
        q.includes("month-wise") ||
        q.includes("revenue trend")
    ) {
        return { type: "monthly_revenue" };
    }

    // 4. Highest revenue region
    if (
        q.includes("region") &&
        (
            q.includes("highest") ||
            q.includes("best") ||
            q.includes("top")
        )
    ) {
        return { type: "top_region" };
    }

    // 5. Compare two months
    const months = {
        january: "01",
        february: "02",
        march: "03",
        april: "04",
        may: "05",
        june: "06"
    };

    const foundMonths = [];

    for (const [name, number] of Object.entries(months)) {
        const regex = new RegExp("\\b" + name + "\\b");
        if (regex.test(q)) {
            foundMonths.push("2026-" + number);
        }
    }

    if (
        (q.includes("compare") || q.includes("difference")) &&
        foundMonths.length >= 2
    ) {
        return {
            type: "compare_months",
            month1: foundMonths[0],
            month2: foundMonths[1]
        };
    }

    // Gemini fallback for unfamiliar questions
    if (!process.env.GEMINI_API_KEY) {
        return { type: "unsupported" };
    }

    try {
        const prompt = `
Classify this sales question into:
total_revenue, top_product, monthly_revenue,
top_region, compare_months, unsupported.

Return only JSON:
{"type":"unsupported","month1":null,"month2":null}

Question: ${question}
`;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0,
                        responseMimeType: "application/json"
                    }
                }),
                signal: AbortSignal.timeout(10000)
            }
        );

        if (!response.ok) {
            console.error("Gemini unavailable. Using fallback response.");
            return { type: "unsupported" };
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        const parsed = JSON.parse(text);

        const allowed = [
            "total_revenue",
            "top_product",
            "monthly_revenue",
            "top_region",
            "compare_months",
            "unsupported"
        ];

        if (!allowed.includes(parsed.type)) {
            return { type: "unsupported" };
        }

        return parsed;

    } catch (error) {
        console.error("Gemini fallback:", error.message);
        return { type: "unsupported" };
    }
}

module.exports = { understandQuestion };
