# AI Business Intelligence Assistant

## Project Overview

The AI Business Intelligence Assistant is a web application that allows business users to ask questions about sales data using natural language and receive answers supported by database queries.

## Features

- Import sales transaction data from CSV into SQLite.
- Validate records and handle invalid data.
- Calculate total revenue.
- Identify the highest-revenue product.
- Display monthly revenue trends.
- Identify the highest-revenue region.
- Compare revenue between two months.
- Process natural-language questions.
- Display structured analytics results through a web interface.

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: SQLite
- AI Integration: Google Gemini API
- Testing: Jest and Supertest

## Project Structure

```text
ai-business-intelligence/
├── data/
├── src/
│   ├── database/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── server.js
├── public/
├── tests/
├── docs/
├── screenshots/
├── package.json
└── README.md
```

## Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd ai-business-intelligence
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key
PORT=5000
```

## Import Dataset

Place the supplied CSV file inside the `data` directory.

Run:

```bash
node src/database/importData.js
```

## Start the Application

```bash
node src/server.js
```

Open:

http://localhost:5000

## API

Endpoint:

`POST /api/ask`

Example request:

```json
{
  "question": "What is the total revenue?"
}
```

## Database and Analytics

Sales transactions are stored in SQLite.

Revenue is calculated using:

`(quantity * unit_price) - discount_amount`

Only completed transactions with valid positive quantities and unit prices are included in analytics.

## AI Integration

The AI component interprets natural-language questions and maps them to predefined analytics operations.

The backend validates the selected operation and executes predefined SQL queries rather than directly executing arbitrary AI-generated SQL.

## Security

- API keys are stored in environment variables.
- User questions are mapped to supported analytics operations.
- SQL queries use predefined statements and parameterized values.
- Destructive SQL operations are not exposed.

## Testing

Automated tests are included in the `tests` directory.

Run:

```bash
npm test
```

## Known Limitations

- Analytics are limited to the available dataset.
- Natural-language interpretation supports a predefined set of analytics questions.
- Gemini availability depends on the external API service.
- The application is a prototype and is not production-ready.

## Future Improvements

- Add more analytics questions.
- Improve natural-language understanding.
- Add interactive charts and filters.
- Support larger datasets.
- Improve authentication and deployment.
