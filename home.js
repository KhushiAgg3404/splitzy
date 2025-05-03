const personInput = document.querySelector("#NoofPeople");
const GObtn = document.querySelector(".GoButton");

// Enable the button only if input has a value
personInput.addEventListener("input", () => {
    GObtn.disabled = !personInput.value; // Simplified condition
});

function goToNextPage() {
    const numberOfPeople = personInput.value; // Get input value

    if (numberOfPeople > 1) {
        localStorage.setItem("personInput", numberOfPeople); // Store in localStorage
        window.location.href = "page1.html"; // Navigate to next page
    } else {
        alert("Please enter a valid number!");
    }
}