const DATABASE_FILE = "medicine-history.json";
let medicineHistory = [];
let isHistoryVisible = true;

document.addEventListener("DOMContentLoaded", function () {
    loadMedicineHistory();
    updateNextDueDate();
    displayHistory();
    setMaxDate();
});
function setMaxDate() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("datepicker").max = today;
}

function validateDate() {
    const datePicker = document.getElementById("datepicker");
    const selectedDate = new Date(datePicker.value);

    // Validation: Check if the selected date is not in the future
    const today = new Date();
    if (selectedDate > today) {
        alert("Cannot select a future date.");
        datePicker.value = ""; // Reset the value
    }
}
function updateNextDueDate() {
    const today = new Date();

    if (medicineHistory.length === 0) {
        const nextDueDate = new Date(today);
        nextDueDate.setDate(today.getDate() + 7);
        document.getElementById("nextDueDate").innerText = `Next Due Date: ${nextDueDate.toDateString()}`;
        return;
    }

    const mostRecentDate = new Date(Math.max(...medicineHistory.map(date => new Date(date))));
    const nextDueDate = new Date(mostRecentDate);
    nextDueDate.setDate(mostRecentDate.getDate() + 7);

    document.getElementById("nextDueDate").innerText = `Next Due Date: ${nextDueDate.toDateString()}`;
}

function saveMedicineTaken() {
    const datePicker = document.getElementById("datepicker");
    const selectedDate = new Date(datePicker.value);

    // Validation: Check if the selected date is not in the future
    const today = new Date();
    if (selectedDate > today) {
        alert("Cannot save medicine taken date in the future.");
        return;
    }

    medicineHistory.push(selectedDate.toISOString());
    selectedDate.setDate(selectedDate.getDate() + 7);
    saveMedicineHistory();
    updateNextDueDate();
    displayHistory();
}

function loadMedicineHistory() {
    try {
        const jsonString = localStorage.getItem(DATABASE_FILE);
        if (jsonString) {
            medicineHistory = JSON.parse(jsonString);
        }
    } catch (error) {
        console.error("Error loading medicine history:", error);
    }
}

function saveMedicineHistory() {
    try {
        localStorage.setItem(DATABASE_FILE, JSON.stringify(medicineHistory));
    } catch (error) {
        console.error("Error saving medicine history:", error);
    }
}

function displayHistory() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    let historyArr = medicineHistory.slice().reverse();
    if (isHistoryVisible) {
        historyArr.forEach(date => {
            const listItem = document.createElement("li");
            listItem.innerText = new Date(date).toDateString();
            historyList.appendChild(listItem);
        });
        if (historyArr.length == 0) {
            const listItem = document.createElement("li");
            listItem.innerText = "No History";
            historyList.appendChild(listItem);
        }
    }
}

function toggleHistory() {
    isHistoryVisible = !isHistoryVisible;
    document.getElementById("historyBtn").innerText = isHistoryVisible ? "Hide History" : "Show History";
    displayHistory();
}

function clearHistory() {
    medicineHistory = [];
    saveMedicineHistory();
    displayHistory();
    updateNextDueDate();
}
