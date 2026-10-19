"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const form = document.getElementById("billForm");
const method = document.getElementById("method");
const unitsGroup = document.getElementById("unitsGroup");
const meterGroup = document.getElementById("meterGroup");
const unitsInput = document.getElementById("units");
const previousInput = document.getElementById("previous");
const currentInput = document.getElementById("current");
const error = document.getElementById("error");
const result = document.getElementById("result");
function formatRupees(amount) {
    return "₹" + amount.toFixed(2);
}
method.addEventListener("change", () => {
    const useMeter = method.value === "meter";
    unitsGroup.hidden = useMeter;
    meterGroup.hidden = !useMeter;
    unitsInput.required = !useMeter;
    previousInput.required = useMeter;
    currentInput.required = useMeter;
    error.textContent = "";
});
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.textContent = "";
    result.hidden = true;
    let units;
    if (method.value === "meter") {
        const previous = Number(previousInput.value);
        const current = Number(currentInput.value);
        if (previousInput.value.trim() === "" ||
            currentInput.value.trim() === "" ||
            !Number.isFinite(previous) ||
            !Number.isFinite(current) ||
            previous < 0 ||
            current < previous) {
            error.textContent =
                "Enter valid meter readings. The current reading must not be less than the previous reading.";
            return;
        }
        units = current - previous;
    }
    else {
        if (unitsInput.value.trim() === "") {
            error.textContent = "Please enter units consumed.";
            return;
        }
        units = Number(unitsInput.value);
    }
    const fixedCharges = Number(document.getElementById("fixedCharges").value);
    const otherCharges = Number(document.getElementById("otherCharges").value);
    if (!Number.isFinite(units) ||
        units < 0 ||
        !Number.isFinite(fixedCharges) ||
        fixedCharges < 0 ||
        !Number.isFinite(otherCharges) ||
        otherCharges < 0) {
        error.textContent =
            "Enter valid non-negative numbers for all charges and units.";
        return;
    }
    const category = document.getElementById("category").value;
    try {
        const response = await fetch("/api/calculate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category,
                units,
                fixedCharges,
                otherCharges
            })
        });
        const data = await response.json();
        if (!response.ok) {
            error.textContent =
                "error" in data ? data.error : "Unable to calculate the bill.";
            return;
        }
        if (!("bill" in data)) {
            error.textContent = "Unexpected response from the server.";
            return;
        }
        const bill = data.bill;
        document.getElementById("resultCategory").textContent =
            bill.category === "domestic" ? "Domestic" : "Commercial";
        document.getElementById("resultUnits").textContent =
            bill.units.toLocaleString("en-IN");
        document.getElementById("energyCharges").textContent =
            formatRupees(bill.energyCharges);
        document.getElementById("fixedResult").textContent =
            formatRupees(bill.fixedCharges);
        document.getElementById("otherResult").textContent =
            formatRupees(bill.otherCharges);
        document.getElementById("total").textContent =
            formatRupees(bill.total);
        result.hidden = false;
    }
    catch {
        error.textContent =
            "Cannot connect to the server. Please make sure the backend is running.";
    }
});
form.addEventListener("reset", () => {
    error.textContent = "";
    result.hidden = true;
    unitsGroup.hidden = false;
    meterGroup.hidden = true;
    unitsInput.required = true;
    previousInput.required = false;
    currentInput.required = false;
});
document.getElementById("printButton").addEventListener("click", () => {
    window.print();
});
