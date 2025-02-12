// Validation functions
function validateAccountNumber(value) {
  // Serbian bank account number format: 18 digits
  const regex = /^\d{18}$/;
  return {
    isValid: regex.test(value),
    message: "Broj računa mora sadržati tačno 18 cifara",
  };
}

function validateAmount(value) {
  // Format: RSD followed by amount (with optional decimal places)
  const regex = /^RSD\d+(?:,\d{2})?$/;
  return {
    isValid: regex.test(value),
    message:
      "Iznos mora biti u formatu: RSD[broj],[decimale] (npr. RSD3596,13)",
  };
}

function validatePaymentCode(value) {
  // Payment code: 1-3 digits
  const regex = /^\d{1,3}$/;
  return {
    isValid: regex.test(value),
    message: "Šifra plaćanja mora biti broj od 1 do 3 cifre",
  };
}

function validateReferenceNumber(value) {
  // Model (2 digits) followed by up to 23 digits for reference number
  // This allows for numbers like 97163220000111111111000 (2 + 21 digits)
  const regex = /^\d{2}\d{1,21}$/;
  return {
    isValid: regex.test(value),
    message:
      "Model i poziv na broj mora biti u formatu: [model-2 cifre][poziv na broj-do 21 cifre]",
  };
}

document.getElementById("qrForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Clear previous error messages
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
  // Reset border colors
  document
    .querySelectorAll("input")
    .forEach((input) => (input.style.borderColor = ""));

  // Get form values
  const formData = {
    K: document.getElementById("K").value,
    V: document.getElementById("V").value,
    C: document.getElementById("C").value,
    R: document.getElementById("R").value,
    N: document.getElementById("N").value,
    I: document.getElementById("I").value,
    P: document.getElementById("P").value,
    SF: document.getElementById("SF").value,
    S: document.getElementById("S").value,
    RO: document.getElementById("RO").value,
  };

  // Validate required fields
  let hasErrors = false;

  // Validate account number
  const accountValidation = validateAccountNumber(formData.R);
  if (!accountValidation.isValid) {
    showError("R", accountValidation.message);
    hasErrors = true;
  }

  // Validate amount
  const amountValidation = validateAmount(formData.I);
  if (!amountValidation.isValid) {
    showError("I", amountValidation.message);
    hasErrors = true;
  }

  // Validate payment code
  const paymentCodeValidation = validatePaymentCode(formData.SF);
  if (!paymentCodeValidation.isValid) {
    showError("SF", paymentCodeValidation.message);
    hasErrors = true;
  }

  // Validate reference number
  const referenceValidation = validateReferenceNumber(formData.RO);
  if (!referenceValidation.isValid) {
    showError("RO", referenceValidation.message);
    hasErrors = true;
  }

  // Validate other required fields
  ["N", "P", "S"].forEach((fieldId) => {
    if (!formData[fieldId].trim()) {
      showError(fieldId, "Ovo polje je obavezno");
      hasErrors = true;
    }
  });

  // If there are validation errors, don't submit
  if (hasErrors) {
    return;
  }

  // Proceed with API call if validation passes
  fetch("https://nbs.rs/QRcode/api/qr/v1/gen", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((blob) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        document.getElementById("qrCode").src = reader.result;
        document.getElementById("qrCode").style.display = "block";
      };
      reader.readAsDataURL(blob);
    })
    .catch((error) => {
      console.error("Error:", error);
      showError(
        "submit",
        "Greška pri generisanju QR koda. Molimo proverite unete podatke."
      );
    });
});

// Helper function to show error messages
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.color = "red";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "5px";
  errorDiv.textContent = message;
  field.parentNode.insertBefore(errorDiv, field.nextSibling);
  field.style.borderColor = "red";
}
