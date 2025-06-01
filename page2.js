document.addEventListener("DOMContentLoaded", () => {
    const settlements = JSON.parse(localStorage.getItem("settlements")) || [];
    const tbody = document.querySelector("tbody");

    if (settlements.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 3;
        cell.style.textAlign = "center";
        cell.textContent = "All accounts are settled";
        row.appendChild(cell);
        tbody.appendChild(row);
    } else {
        settlements.forEach(({ from, to, amount }) => {
            const row = document.createElement("tr");

            const fromCell = document.createElement("td");
            fromCell.textContent = from;

            const amountCell = document.createElement("td");
            amountCell.textContent = `₹${amount}`;

            const toCell = document.createElement("td");
            toCell.textContent = to;

            row.appendChild(fromCell);
            row.appendChild(amountCell);
            row.appendChild(toCell);

            tbody.appendChild(row);
        });
    }
});
