const invoiceDate = document.getElementById("invoiceDate");
const paymentTerms = document.getElementById("paymentTerms");
const customDaysField = document.getElementById("customDaysField");
const customDays = document.getElementById("customDays");
const dueDateResult = document.getElementById("dueDateResult");
const termsResult = document.getElementById("termsResult");
const daysResult = document.getElementById("daysResult");
const copyResult = document.getElementById("copyResult");

function localDateValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function parseLocalDate(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function selectedDays() {
    if (paymentTerms.value !== "custom") {
        return Number(paymentTerms.value);
    }

    const value = Number(customDays.value);
    return Number.isInteger(value) && value > 0 ? value : null;
}

function calculate() {
    const days = selectedDays();
    const termLabel = paymentTerms.options[paymentTerms.selectedIndex].text;

    termsResult.textContent = termLabel;

    if (!invoiceDate.value || days === null) {
        dueDateResult.textContent = "Enter a valid date and custom day count";
        daysResult.textContent = days === null ? "Enter custom days" : `${days} calendar days`;
        return;
    }

    const dueDate = parseLocalDate(invoiceDate.value);
    dueDate.setDate(dueDate.getDate() + days);

    dueDateResult.textContent = dueDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    daysResult.textContent = `${days} calendar day${days === 1 ? "" : "s"}`;
}

function updateCustomDays() {
    const isCustom = paymentTerms.value === "custom";
    customDaysField.hidden = !isCustom;
    customDays.disabled = !isCustom;
    calculate();
}

async function copyCalculation() {
    if (dueDateResult.textContent.startsWith("Enter")) {
        return;
    }

    const result = `Invoice Date: ${invoiceDate.value}\nTerms: ${termsResult.textContent}\nDue Date: ${dueDateResult.textContent}\nCredit Period: ${daysResult.textContent}`;

    try {
        await navigator.clipboard.writeText(result);
        copyResult.textContent = "Copied!";
        window.setTimeout(() => { copyResult.textContent = "Copy Result"; }, 1600);
    } catch {
        copyResult.textContent = "Copy unavailable";
        window.setTimeout(() => { copyResult.textContent = "Copy Result"; }, 1600);
    }
}

invoiceDate.value = localDateValue(new Date());
invoiceDate.addEventListener("change", calculate);
paymentTerms.addEventListener("change", updateCustomDays);
customDays.addEventListener("input", calculate);
copyResult.addEventListener("click", copyCalculation);

updateCustomDays();
