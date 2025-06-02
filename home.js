const personInput = document.querySelector("#NoofPeople");
const GObtn = document.querySelector(".GoButton");
const warning = document.getElementById("warningMsg");

// Enable/Disable GO button and show warning based on input
personInput.addEventListener("input", () => {
    const value = parseInt(personInput.value);

    if (value > 50) {
        warning.style.display = "block";
        GObtn.disabled = true;
    } else if (value >= 2) {
        warning.style.display = "none";
        GObtn.disabled = false;
    } else {
        warning.style.display = "none";
        GObtn.disabled = true;
    }
});

// Function to go to next page
function goToNextPage() {
    const numberOfPeople = parseInt(personInput.value);

    if (numberOfPeople >= 2 && numberOfPeople <= 50) {
        localStorage.setItem("personInput", numberOfPeople);
        window.location.href = "page1.html";
    } else {
        alert("Please enter a valid number between 2 and 50!");
    }
}
