# AI Business Intelligence Assistant – Architecture

## Architecture Diagram

```text
             BUSINESS USER
                   |
                   v
          FRONTEND (HTML/CSS/JS)
                   |
          Natural Language Question
                   |
                   v
           EXPRESS.JS BACKEND
                   |
                   v
             AI SERVICE
          (Gemini / Fallback)
                   |
          Identifies User Intent
                   |
                   v
          ANALYTICS CONTROLLER
                   |
                   v
           ANALYTICS SERVICE
                   |
           Predefined SQL Queries
                   |
                   v
             SQLITE DATABASE
                   |
           Sales Transaction Data
                   |
                   v
          STRUCTURED ANALYTICS
                   |
                   v
             FRONTEND RESULT
```

## Component Description

### 1. Frontend
HTML, CSS and JavaScript provide the user interface. Users enter questions and view analytics results.

### 2. Backend
Node.js and Express.js receive requests and manage communication between the frontend, AI service and database.

### 3. AI Service
Google Gemini interprets natural-language questions. Deterministic intent matching provides fallback support for predefined questions.

### 4. Analytics Service
Executes predefined SQL queries to calculate revenue, identify top-performing products and regions, and compare monthly performance.

### 5. Database
SQLite stores the imported sales transaction records.

## Data Flow

1. Sales data is imported from CSV into SQLite.
2. The user enters a natural-language question.
3. The backend receives the question.
4. The AI service identifies the intended analytics operation.
5. The controller validates the operation.
6. The analytics service executes the corresponding SQL query.
7. Results are returned as JSON.
8. The frontend displays the answer and supporting figures.
