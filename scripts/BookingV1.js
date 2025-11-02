const form = document.getElementById("bookingForm");
const dateInput = document.getElementById("bookingDate");
const placeSelect = document.getElementById("bookingPlace");
const otherInputsDiv = document.getElementById("otherInputs");
const otherPlaceInput = document.getElementById("otherPlace");
const otherAmountInput = document.getElementById("otherAmount");
const responseMsg = document.getElementById("responseMessage");

const today = new Date().toISOString().split("T")[0];
dateInput.value = today;

placeSelect.addEventListener("change", (e) => {
    if (e.target.value === "Other") {
        otherInputsDiv.style.display = "block";
        otherPlaceInput.required = true;
        otherAmountInput.required = true;
    } else {
        otherInputsDiv.style.display = "none";
        otherPlaceInput.required = false;
        otherAmountInput.required = false;
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let place = placeSelect.value;
    const formData = new FormData(form);

    if (place === "Other") {
        const name = otherPlaceInput.value;
        const amount = otherAmountInput.value;

        formData.set("Place", name);
        formData.set("Amount", amount);
    } else {
        const selectedOption = placeSelect.options[placeSelect.selectedIndex];
        formData.set("Amount", selectedOption.getAttribute("data-price"));
    }

    const scriptURL ="https://script.google.com/macros/s/AKfycbzwudQBUurWZchP7Ip4nH0rQbWHRGsBBBGz5KjwNnNCAbwGS2NWAuPfiQdgLDYHbDpu2Q/exec"; // <<<<<< REPLACE

    const urlEncodedData = new URLSearchParams(formData).toString();

    try {
        responseMsg.textContent = "Submitting...";
        responseMsg.style.color = "orange";

        await fetch(scriptURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: urlEncodedData,
        });

        responseMsg.textContent = "✅ Booking submitted!";
        responseMsg.style.color = "green";

        form.reset();
        dateInput.value = today;
        otherInputsDiv.style.display = "none";
    } catch (err) {
        responseMsg.textContent = "❌ Submission failed!";
        responseMsg.style.color = "red";
        console.error(err);
    }
});
