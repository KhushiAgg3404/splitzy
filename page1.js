function simplifyDebts(transactions) {
    const balance = {};

    transactions.forEach(({ payer, amount, participants }) => {
        const share = amount / participants.length;

        participants.forEach(person => {
            if (person !== payer) {
                balance[person] = (balance[person] || 0) - share;
                balance[payer] = (balance[payer] || 0) + share;
            }
        });
    });

    const people = Object.entries(balance)
        .filter(([_, bal]) => Math.abs(bal) > 0.01);

    const creditors = [];
    const debtors = [];

    people.forEach(([person, bal]) => {
        if (bal > 0) creditors.push({ person, amount: bal });
        else debtors.push({ person, amount: -bal });
    });

    const result = [];

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        const settledAmount = Math.min(debtor.amount, creditor.amount);

        result.push({
            from: debtor.person,
            to: creditor.person,
            amount: settledAmount.toFixed(2)
        });

        debtor.amount -= settledAmount;
        creditor.amount -= settledAmount;

        if (debtor.amount < 0.01) i++;
        if (creditor.amount < 0.01) j++;
    }

    return result;
}

function extractTransactionsFromUI() {
    const users = document.querySelectorAll(".user");
    const transactions = [];

    users.forEach(user => {
        const payerId = user.querySelector(".Name input").value;
        const expenses = user.querySelectorAll(".Exp");

        expenses.forEach(exp => {
            const amount = parseFloat(exp.querySelector(".howMuch").value);
            if (!isNaN(amount) && amount > 0) {
                const checkboxes = exp.querySelectorAll(".share-check:checked");
                const participants = Array.from(checkboxes).map(cb => cb.value);

                if (participants.length > 0) {
                    transactions.push({ payer: payerId, amount, participants });
                }
            }
        });
    });

    return transactions;
}

function calculateTotalExpense(parentUser) {
    let expenseInputs = parentUser.querySelectorAll(".howMuch");
    let total = 0;

    expenseInputs.forEach(input => {
        let value = parseFloat(input.value);
        if (!isNaN(value)) {
            total += value;
        }
    });

    let totalExpSpan = parentUser.querySelector(".totalExp span");
    if (totalExpSpan) {
        totalExpSpan.textContent = total.toFixed(2);
    }
}

function updateShareOptions(userCount) {
    const allExpenses = document.querySelectorAll(".Exp");
    const allUsers = document.querySelectorAll(".user");

    // Get the user names from their inputs
    const userNames = Array.from(allUsers).map(user => {
        const input = user.querySelector(".Name input");
        return input ? input.value : "";
    });

    allExpenses.forEach(exp => {
        const shareOptions = exp.querySelector(".share-options");
        shareOptions.innerHTML = "<div>Who shares this expense?</div>";

        userNames.forEach(name => {
            const userCheckbox = document.createElement("label");
            userCheckbox.innerHTML = `
              <input type="checkbox" class="share-check" value="${name}" checked>
              ${name}
            `;
            shareOptions.appendChild(userCheckbox);
        });
    });
}

function toggleShareOptions(event) {
    const dropdown = event.currentTarget.nextElementSibling;
    dropdown.classList.toggle("show");
}

function addShareButtonFunctionality() {
    const buttons = document.querySelectorAll(".share-btn");
    buttons.forEach(button => {
        button.removeEventListener("click", toggleShareOptions);
        button.addEventListener("click", toggleShareOptions);
    });
}

// Instead of adding listeners to each element individually,
// use event delegation for focus on name inputs to clear default text.
document.addEventListener("focusin", function (event) {
    if (event.target && event.target.matches(".Name input")) {
        const defaultText = event.target.getAttribute("data-default");
        if (event.target.value === defaultText) {
            event.target.value = "";
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let personInput = parseInt(localStorage.getItem("personInput")) || 1;
    let container = document.querySelector(".container");
    let original = document.querySelector(".wrap");

    // Set up additional (cloned) user entries if needed
    if (personInput) {
        for (let i = 2; i <= personInput; i++) {
            let clone = original.cloneNode(true);
            let nameInput = clone.querySelector(".Name input");
            let defaultName = `Name ${i}`;
            nameInput.placeholder = defaultName;
            nameInput.value = defaultName;
            nameInput.id = `Name ${i}`;
            // Store the default value in a data attribute
            nameInput.setAttribute("data-default", defaultName);

            let userDiv = clone.querySelector(".user");
            userDiv.id = `User ${i}`;

            let expWrap = clone.querySelector("#ExpWrap");
            expWrap.id = `ExpWrap${i}`;

            let moreBtn = clone.querySelector("#moreBtn");
            moreBtn.id = `moreBtn${i}`;

            container.appendChild(clone);
        }
    }

    // For the initial name inputs, set their data-default attribute
    document.querySelectorAll(".Name input").forEach((input, index) => {
        let defaultName = `Name ${index + 1}`;
        input.setAttribute("data-default", defaultName);
    });

    updateShareOptions(personInput);
    addShareButtonFunctionality();
});

document.addEventListener("click", function (event) {
    if (event.target && event.target.matches(".More button")) {
        let parentWrap = event.target.closest(".user");
        let expWrap = parentWrap.querySelector(".ExpWrap, [id^='ExpWrap']");

        if (expWrap) {
            let original = expWrap.querySelector(".Exp");
            if (original) {
                let clone = original.cloneNode(true);
                clone.querySelector(".what").value = "";
                clone.querySelector(".howMuch").value = "";

                let shareOptions = clone.querySelector(".share-options");
                shareOptions.innerHTML = "";
                let allUsers = document.querySelectorAll(".user");

                allUsers.forEach(user => {
                    const nameInput = user.querySelector(".Name input");
                    const name = nameInput ? nameInput.value : "";

                    const userCheckbox = document.createElement("label");
                    userCheckbox.innerHTML = `
                      <input type="checkbox" class="share-check" value="${name}" checked>
                      ${name}
                    `;
                    shareOptions.appendChild(userCheckbox);
                });

                expWrap.appendChild(clone);
                addShareButtonFunctionality();
            }
        }
    }

    if (event.target && event.target.classList.contains("remove-expense")) {
        let expenseDiv = event.target.closest(".Exp");
        let parentUser = expenseDiv.closest(".user");
        let allExpenses = parentUser.querySelectorAll(".Exp");

        if (allExpenses.length > 1) {
            expenseDiv.remove();
        } else {
            expenseDiv.querySelector(".what").value = "";
            expenseDiv.querySelector(".howMuch").value = "";
        }

        calculateTotalExpense(parentUser);
    }
});

document.addEventListener("input", function (event) {
    if (event.target && event.target.classList.contains("howMuch")) {
        let parentUser = event.target.closest(".user");
        calculateTotalExpense(parentUser);
    }

    if (event.target && event.target.matches(".Name input")) {
        const personInput = document.querySelectorAll(".user").length;
        updateShareOptions(personInput);
    }
});

function goToNextPage() {
    const transactions = extractTransactionsFromUI();
    const settlements = simplifyDebts(transactions);

    localStorage.setItem("settlements", JSON.stringify(settlements));
    window.location.href = "page2.html";
}
