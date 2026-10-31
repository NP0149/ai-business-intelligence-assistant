# AI Business Intelligence Assistant
## Development Report

### 1. Project Overview

The AI Business Intelligence Assistant is a web-based application that allows business users to ask natural-language questions about sales transactions and receive answers supported by actual database queries.

The application processes sales data stored in an SQLite database and provides useful business insights through a simple web interface.

### 2. Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js and Express.js
- Database: SQLite
- Database Library: better-sqlite3
- AI Integration: Google Gemini API
- Testing: Jest and Supertest
- Development Assistance: ChatGPT

### 3. Architecture

The application follows a simple layered architecture.

1. Frontend: Accepts questions from users and displays results.
2. Backend API: Receives questions through Express.js routes.
3. AI Service: Interprets natural-language questions and identifies supported analytics operations.
4. Analytics Service: Executes predefined SQL queries.
5. Database: Stores sales transaction records in SQLite.

### 4. Data Management

The supplied CSV dataset is imported into SQLite.

During importing:
- Required fields are validated.
- Invalid records are skipped where appropriate.
- Duplicate transaction IDs are ignored.
- Dates are normalized.
- Sales transactions are stored in a structured database table.

Revenue is calculated using:

Revenue = (Quantity × Unit Price) − Discount Amount

Only completed transactions with valid positive quantities and unit prices are included in revenue calculations.

### 5. Supported Analytics

The application supports the following questions:

1. What is the total revenue?
2. Which product generated the highest revenue?
3. What is the monthly revenue trend?
4. Which region generated the highest sales?
5. How did revenue change between two months?

The results are calculated using predefined SQL queries rather than relying on AI-generated numerical answers.

### 6. AI Integration

Google Gemini API was used to interpret natural-language questions.

The AI component maps user questions to predefined analytics operations.

To improve reliability:
- Only supported operation types are accepted.
- The backend validates the operation.
- SQL queries are predefined.
- Month parameters are validated.
- Arbitrary destructive SQL operations are not permitted.

A deterministic intent-matching fallback was also implemented for the five supported questions because external AI services may occasionally be unavailable.

### 7. Testing

Automated API tests were implemented using Jest and Supertest.

The following eight test cases passed:

1. API health check.
2. Total revenue calculation.
3. Highest revenue product.
4. Monthly revenue trend.
5. Highest sales region.
6. Unsupported question handling.
7. Invalid month format handling.
8. Revenue comparison between two months.

Test result: 8 passed, 0 failed.

### 8. AI Tools Used During Development

ChatGPT was used as a development assistant.

It helped with:
- Understanding the project requirements.
- Planning the application architecture.
- Generating and reviewing code.
- Debugging backend errors.
- Designing SQL analytics queries.
- Creating automated tests.
- Preparing project documentation.

### 9. Problems Encountered and Debugging

**Problem 1: Database Import**

CSV records required validation and date normalization before insertion.

Solution: Implemented a CSV importer with validation and duplicate handling.

**Problem 2: Backend Errors**

An identifier redeclaration error occurred in the analytics controller.

Solution: Reviewed the controller and corrected the duplicate declaration.

**Problem 3: Gemini API Availability**

The Gemini API returned HTTP 503 (UNAVAILABLE) because of temporary high demand.

Solution: Implemented deterministic intent matching for the five supported analytics questions so core functionality does not depend entirely on external AI availability.

**Problem 4: Automated Testing**

The default npm test script did not execute Jest.

Solution: Updated the package.json test script and implemented eight API tests using Jest and Supertest.

### 10. Known Limitations

- Natural-language interpretation is limited to supported analytics questions and fallback patterns.
- Gemini API availability depends on the external service.
- The application currently works with the supplied sales dataset.
- The application is a prototype and does not include user authentication.
- Advanced visual analytics and report exports are not implemented.

### 11. Future Improvements

With additional development time, the application could be improved by:

- Supporting more natural-language questions.
- Adding interactive charts and dashboards.
- Supporting larger datasets.
- Adding authentication and role-based access.
- Improving AI response validation.
- Adding downloadable business reports.
- Deploying the application to a cloud platform.

### 12. Conclusion

The project demonstrates how natural-language interfaces, backend APIs, databases and AI-assisted interpretation can be combined to build a simple Business Intelligence application.

The application successfully imports sales data, performs database-backed analytics, presents results through a web interface and passes eight automated tests.
