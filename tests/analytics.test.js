const request = require("supertest");
const app = require("../src/server");

describe("AI Business Intelligence API Tests", () => {

    // Test 1: Health check
    test("Should check whether API is running", async () => {
        const response = await request(app)
            .get("/api/health");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // Test 2: Total revenue
    test("Should calculate total revenue", async () => {
        const response = await request(app)
            .post("/api/ask")
            .send({
                type: "total_revenue"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.total_revenue).toBeGreaterThan(0);
    });

    // Test 3: Highest revenue product
    test("Should identify highest revenue product", async () => {
        const response = await request(app)
            .post("/api/ask")
            .send({
                type: "top_product"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.product).toBeDefined();
    });

    // Test 4: Monthly revenue trend
    test("Should return monthly revenue trend", async () => {
        const response = await request(app)
            .post("/api/ask")
            .send({
                type: "monthly_revenue"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    // Test 5: Highest sales region
    test("Should identify highest sales region", async () => {
        const response = await request(app)
            .post("/api/ask")
            .send({
                type: "top_region"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.region).toBeDefined();
    });

    // Test 6: Invalid question
    test("Should reject unsupported question type", async () => {
        const response = await request(app)
            .post("/api/ask")
            .send({
                type: "invalid_question"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });

    // Test 7: Invalid month comparison
    test("Should reject invalid month format", async () => {
        const response = await request(app)
            .post("/api/ask")
            .send({
                type: "compare_months",
                month1: "January",
                month2: "March"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });

    // Test 8: Valid month comparison
    test("Should compare revenue between two months", async () => {
        const response = await request(app)
            .post("/api/ask")
            .send({
                type: "compare_months",
                month1: "2026-01",
                month2: "2026-03"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.difference).toBeDefined();
    });

});
