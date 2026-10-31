const questionInput = document.getElementById("question");
const resultBox = document.getElementById("result");
const askBtn = document.getElementById("askBtn");

function setQuestion(question) {
    questionInput.value = question;
}

function formatCurrency(value) {
    return "₹" + Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
}

function displayResult(response) {
    const data = response.data;

    let html = `
        <h2>Analysis Result</h2>
        <div class="result-card">
            <h3>${response.answer}</h3>
            <p><strong>Your question:</strong> ${escapeHTML(response.question || "")}</p>
    `;

    if (response.type === "total_revenue") {
        html += `
            <p><strong>Total Revenue:</strong> ${formatCurrency(data.total_revenue)}</p>
            <p><strong>Valid Transactions:</strong> ${data.total_transactions}</p>
        `;
    }

    else if (response.type === "top_product") {
        html += `
            <p><strong>Product:</strong> ${escapeHTML(data.product)}</p>
            <p><strong>Revenue:</strong> ${formatCurrency(data.revenue)}</p>
        `;
    }

    else if (response.type === "top_region") {
        html += `
            <p><strong>Region:</strong> ${escapeHTML(data.region)}</p>
            <p><strong>Revenue:</strong> ${formatCurrency(data.revenue)}</p>
        `;
    }

    else if (response.type === "monthly_revenue") {
        html += `<h3>Monthly Revenue</h3>`;

        data.forEach(item => {
            html += `
                <p>
                    <strong>${escapeHTML(item.month)}:</strong>
                    ${formatCurrency(item.revenue)}
                </p>
            `;
        });
    }

    else if (response.type === "compare_months") {
        html += `
            <p><strong>${escapeHTML(data.month1)}:</strong> ${formatCurrency(data.revenue1)}</p>
            <p><strong>${escapeHTML(data.month2)}:</strong> ${formatCurrency(data.revenue2)}</p>
            <p><strong>Difference:</strong> ${formatCurrency(Math.abs(data.difference))}</p>
            <p><strong>Change:</strong> ${
                data.percentageChange === null
                    ? "Not available (first month's revenue is zero)"
                    : data.percentageChange.toFixed(2) + "%"
            }</p>
        `;
    }

    html += `</div>`;

    resultBox.innerHTML = html;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

async function askQuestion() {
    const question = questionInput.value.trim();

    if (!question) {
        resultBox.innerHTML = `
            <h2>Analysis Result</h2>
            <p class="error">Please enter a question.</p>
        `;
        return;
    }

    askBtn.disabled = true;
    askBtn.textContent = "Analyzing...";

    resultBox.innerHTML = `
        <h2>Analysis Result</h2>
        <p>AI is analyzing your question. Please wait...</p>
    `;

    try {
        const response = await fetch("/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Something went wrong");
        }

        displayResult(result);

    } catch (error) {
        resultBox.innerHTML = `
            <h2>Analysis Result</h2>
            <p class="error">${escapeHTML(error.message)}</p>
        `;
    } finally {
        askBtn.disabled = false;
        askBtn.textContent = "Ask AI";
    }
}
