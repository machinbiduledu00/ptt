const currency = document.getElementById("currency");
const invoiceAmount = document.getElementById("invoiceAmount");
const currentTermsCustom = document.getElementById("currentTermsCustom");
const alternativeTermsCustom = document.getElementById("alternativeTermsCustom");
const currentTerms = document.getElementById("currentTerms");
const alternativeTerms = document.getElementById("alternativeTerms");
const capitalCost = document.getElementById("capitalCost");
const invoicesPerYear = document.getElementById("invoicesPerYear");
const offeredDiscount = document.getElementById("offeredDiscount");

const daysResult = document.getElementById("daysResult");
const invoiceCostResult = document.getElementById("invoiceCostResult");
const annualCostResult = document.getElementById("annualCostResult");
const discountResult = document.getElementById("discountResult");
const maxDiscountResult = document.getElementById("maxDiscountResult");
const summaryText = document.getElementById("summaryText");
const discountCostResult = document.getElementById("discountCostResult");
const netImpactResult = document.getElementById("netImpactResult");
const verdictResult = document.getElementById("verdictResult");
const verdictRow = verdictResult.closest(".verdict-row");

function formatMoney(value, currencySymbol) {

    return currencySymbol +
        Math.abs(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
}

function calculate() {

    const amount = parseFloat(invoiceAmount.value);

    const currentDays =
        currentTerms.value === "custom"
            ? parseInt(currentTermsCustom.value) || 0
            : parseInt(currentTerms.value);

    const alternativeDays =
        alternativeTerms.value === "custom"
            ? parseInt(alternativeTermsCustom.value) || 0
            : parseInt(alternativeTerms.value);

    const annualRate = parseFloat(capitalCost.value) / 100;

    const invoices = parseInt(invoicesPerYear.value);

    const dayDifference =
        currentDays - alternativeDays;

    const costPerInvoice =
        amount *
        annualRate *
        (dayDifference / 365);

    const annualCost =
        costPerInvoice *
        invoices;

    const equivalentDiscount =
        (costPerInvoice / amount) *
        100;

    const maxWorthwhileDiscount =
        dayDifference > 0
            ? Math.abs(equivalentDiscount)
            : 0;

    const offeredDiscountRate =
        parseFloat(offeredDiscount.value) / 100 || 0;

    const discountCost =
        amount * offeredDiscountRate;

    const financingBenefit =
        dayDifference > 0
            ? Math.abs(costPerInvoice)
            : 0;

    const netImpact =
        financingBenefit - discountCost;

    daysResult.textContent =
        `${dayDifference} days`;

    if (dayDifference > 0) {

        maxDiscountResult.textContent =
            `${maxWorthwhileDiscount.toFixed(2)}%`;

    } else {

        maxDiscountResult.textContent =
            "N/A";
    }

    const currencySymbol = currency.value;

    invoiceCostResult.textContent =
        formatMoney(costPerInvoice, currencySymbol);

    annualCostResult.textContent =
        formatMoney(annualCost, currencySymbol);

    discountResult.textContent =
        `${Math.abs(equivalentDiscount).toFixed(2)}%`;

    discountCostResult.textContent =
        formatMoney(discountCost, currencySymbol);

    netImpactResult.textContent =
        `${netImpact >= 0 ? "+" : "-"}${formatMoney(netImpact, currencySymbol)}`;

    netImpactResult.classList.remove(
        "positive-value",
        "negative-value",
        "neutral-value"
    );

    if (netImpact > 0) {

        netImpactResult.classList.add("positive-value");

    } else if (netImpact < 0) {

        netImpactResult.classList.add("negative-value");

    } else {

        netImpactResult.classList.add("neutral-value");
    }

    verdictRow.classList.remove(
        "verdict-good",
        "verdict-bad",
        "verdict-neutral"
    );

    if (dayDifference <= 0) {

        verdictResult.textContent = "N/A";
        verdictRow.classList.add("verdict-neutral");

    } else if (netImpact > 0) {

        verdictResult.textContent = "WORTH IT";
        verdictRow.classList.add("verdict-good");

    } else if (netImpact < 0) {

        verdictResult.textContent = "NOT WORTH IT";
        verdictRow.classList.add("verdict-bad");

    } else {

        verdictResult.textContent = "BREAK EVEN";
        verdictRow.classList.add("verdict-neutral");
    }

    if (dayDifference > 0) {

        summaryText.innerHTML = `
        Switching from Net ${currentDays} to Net ${alternativeDays}
        gives you access to ${formatMoney(amount, currencySymbol)}
        ${dayDifference} days earlier.

        Based on an annual cost of capital of ${(annualRate * 100).toFixed(1)}%,
        this is worth approximately
        <strong>${formatMoney(costPerInvoice, currencySymbol)}
        and
        <strong>${formatMoney(annualCost, currencySymbol)} per year</strong>.

        An early-payment discount of approximately
        <strong>${maxWorthwhileDiscount.toFixed(2)}%</strong>
        would therefore represent the estimated break-even point.

        With an offered early-payment discount of
        <strong>${(offeredDiscountRate * 100).toFixed(2)}%</strong>,
        the discount costs
        <strong>${formatMoney(discountCost, currencySymbol)}</strong>
        per invoice.

        The estimated net impact is
        <strong>${netImpact >= 0 ? "+" : "-"}${currencySymbol}${Math.abs(netImpact).toFixed(2)}</strong>
        per invoice.
    `;

    } else if (dayDifference < 0) {

        const delay = Math.abs(dayDifference);

        summaryText.innerHTML = `
            Switching from Net ${currentDays} to Net ${alternativeDays}
            means waiting ${delay} additional days to get paid.
            Based on an annual cost of capital of ${(annualRate * 100).toFixed(1)}%,
            this adds approximately
            <strong>${formatMoney(costPerInvoice, currencySymbol)} per invoice</strong>
            and
            <strong>${formatMoney(annualCost, currencySymbol)} per year</strong>
            in financing cost.
        `;

    } else {

        summaryText.innerHTML = `
            These payment terms are identical,
            so there is no timing-related financing difference.
        `;
    }
}

function updateCustomFields() {

    if (currentTerms.value === "custom") {
        currentTermsCustom.style.display = "block";
    } else {
        currentTermsCustom.style.display = "none";
    }

    if (alternativeTerms.value === "custom") {
        alternativeTermsCustom.style.display = "block";
    } else {
        alternativeTermsCustom.style.display = "none";
    }

    calculate();
}

currency.addEventListener("change", calculate);
invoiceAmount.addEventListener("input", calculate);

currentTerms.addEventListener("change", updateCustomFields);
alternativeTerms.addEventListener("change", updateCustomFields);

currentTermsCustom.addEventListener("input", calculate);
alternativeTermsCustom.addEventListener("input", calculate);

capitalCost.addEventListener("input", calculate);
invoicesPerYear.addEventListener("input", calculate);
offeredDiscount.addEventListener("input", calculate);

updateCustomFields();