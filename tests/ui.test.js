const fs = require("fs");
const path = require("path");

// Load the script content
const scriptContent = fs.readFileSync(
  path.join(__dirname, "../script.js"),
  "utf8"
);

describe("UI Interactions", () => {
  let form;
  let qrCodeImg;
  let originalConsoleError;

  beforeEach(() => {
    // Mock console.error before each test
    originalConsoleError = console.error;
    console.error = jest.fn();

    // Set up our document body
    document.body.innerHTML = `
      <form id="qrForm">
        <input id="K" type="text">
        <input id="V" type="text">
        <input id="C" type="text">
        <input id="R" type="text">
        <input id="N" type="text">
        <input id="I" type="text">
        <input id="P" type="text">
        <input id="SF" type="text">
        <input id="S" type="text">
        <input id="RO" type="text">
        <div id="submit"></div>
      </form>
      <img id="qrCode">
    `;

    // Execute the script in the context of our tests
    eval(scriptContent);

    form = document.getElementById("qrForm");
    qrCodeImg = document.getElementById("qrCode");
  });

  afterEach(() => {
    // Restore console.error after each test
    console.error = originalConsoleError;
  });

  test("should clear previous error messages when form is resubmitted", () => {
    // First submission with errors
    form.dispatchEvent(new Event("submit"));

    // Check if error messages exist
    let errorMessages = document.querySelectorAll(".error-message");
    expect(errorMessages.length).toBeGreaterThan(0);

    // Fill in one required field
    document.getElementById("K").value = "Test Company";

    // Second submission
    form.dispatchEvent(new Event("submit"));

    // Check if previous error message for K field is cleared
    const kFieldError = document.querySelector("#K + .error-message");
    expect(kFieldError).toBeNull();
  });

  test("should reset border colors when form is resubmitted", () => {
    // First submission with errors
    form.dispatchEvent(new Event("submit"));

    // Submit empty form to trigger validation
    form.dispatchEvent(new Event("submit"));

    // Check if borders are red for required fields
    ["K", "V", "C", "R", "N", "I", "SF"].forEach((fieldId) => {
      const input = document.getElementById(fieldId);
      expect(input.style.borderColor).toBe("red");
    });

    // Fill in all required fields with valid data
    const validData = {
      K: "Test Company",
      V: "1.0",
      C: "1",
      R: "123456789012345678",
      N: "Test Name",
      I: "RSD1000,00",
      SF: "121",
    };

    Object.entries(validData).forEach(([id, value]) => {
      document.getElementById(id).value = value;
    });

    // Mock fetch for successful submission
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob()),
      })
    );

    // Second submission
    form.dispatchEvent(new Event("submit"));

    // Check if borders are reset for all fields
    ["K", "V", "C", "R", "N", "I", "SF", "P", "S", "RO"].forEach((fieldId) => {
      const input = document.getElementById(fieldId);
      expect(input.style.borderColor).toBe("");
    });
  });

  test("should handle optional fields correctly", () => {
    // Fill in required fields only
    const requiredData = {
      K: "Test Company",
      V: "1.0",
      C: "1",
      R: "123456789012345678",
      N: "Test Name",
      I: "RSD1000,00",
      SF: "121",
    };

    Object.entries(requiredData).forEach(([id, value]) => {
      document.getElementById(id).value = value;
    });

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob()),
      })
    );

    // Submit form
    form.dispatchEvent(new Event("submit"));

    // Verify that optional fields were not included in the API call
    const fetchCall = global.fetch.mock.calls[0][1];
    const requestBody = JSON.parse(fetchCall.body);
    expect(requestBody.P).toBeUndefined();
    expect(requestBody.S).toBeUndefined();
    expect(requestBody.RO).toBeUndefined();
  });

  test("should style error messages correctly", () => {
    // Submit empty form to trigger errors
    form.dispatchEvent(new Event("submit"));

    // Check error message styling
    const errorMessages = document.querySelectorAll(".error-message");
    const firstError = errorMessages[0];

    expect(firstError.style.color).toBe("red");
    expect(firstError.style.fontSize).toBe("12px");
    expect(firstError.style.marginTop).toBe("5px");
  });

  test("should handle multiple validation errors simultaneously", () => {
    // Fill in invalid data for multiple fields
    const invalidData = {
      R: "12345", // Invalid account number
      I: "1000", // Invalid amount format
      SF: "1234", // Invalid payment code
      RO: "123", // Invalid reference number
    };

    Object.entries(invalidData).forEach(([id, value]) => {
      document.getElementById(id).value = value;
    });

    // Submit form
    form.dispatchEvent(new Event("submit"));

    // Check for multiple error messages
    const errorMessages = document.querySelectorAll(".error-message");
    expect(errorMessages.length).toBe(7); // 4 validation errors + 3 required field errors

    // Verify specific error messages
    expect(document.querySelector("#R + .error-message").textContent).toBe(
      "Broj računa mora sadržati tačno 18 cifara"
    );
    expect(document.querySelector("#I + .error-message").textContent).toBe(
      "Iznos mora biti u formatu: RSD[broj],[decimale] (npr. RSD3596,13)"
    );
    expect(document.querySelector("#SF + .error-message").textContent).toBe(
      "Šifra plaćanja mora biti broj od 1 do 3 cifre"
    );
  });

  test("should handle QR code image visibility", async () => {
    // Fill in all required fields with valid data
    const validData = {
      K: "Test Company",
      V: "1.0",
      C: "1",
      R: "123456789012345678",
      N: "Test Name",
      I: "RSD1000,00",
      SF: "121",
    };

    Object.entries(validData).forEach(([id, value]) => {
      document.getElementById(id).value = value;
    });

    // Mock successful API response
    const mockBlob = new Blob(["fake-image-data"], { type: "image/png" });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      })
    );

    // Mock FileReader
    const mockResult = "data:image/png;base64,fake-base64-data";
    const mockFileReader = {
      readAsDataURL: jest.fn(function () {
        setTimeout(() => {
          this.onloadend && this.onloadend();
        }, 0);
      }),
      result: mockResult,
      onloadend: null,
    };
    global.FileReader = jest.fn(() => mockFileReader);

    // Submit form
    form.dispatchEvent(new Event("submit"));

    // Wait for async operations to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify QR code image is displayed
    expect(qrCodeImg.style.display).toBe("block");
    // Check if the src is set (we don't check the exact value since it's a mock)
    expect(qrCodeImg.src).toBeTruthy();
  });

  test("should handle network error UI feedback", async () => {
    // Fill in all required fields with valid data
    const validData = {
      K: "Test Company",
      V: "1.0",
      C: "1",
      R: "123456789012345678",
      N: "Test Name",
      I: "RSD1000,00",
      SF: "121",
    };

    Object.entries(validData).forEach(([id, value]) => {
      document.getElementById(id).value = value;
    });

    // Mock network error
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    // Submit form
    form.dispatchEvent(new Event("submit"));

    // Wait for async operations to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify error message is displayed
    const errorMessage = document.querySelector("#submit + .error-message");
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toBe(
      "Greška pri generisanju QR koda. Molimo proverite unete podatke."
    );
    expect(errorMessage.style.color).toBe("red");
  });

  test("should maintain form state after failed submission", async () => {
    // Fill in all fields including optional ones
    const formData = {
      K: "Test Company",
      V: "1.0",
      C: "1",
      R: "123456789012345678",
      N: "Test Name",
      I: "RSD1000,00",
      SF: "121",
      P: "Additional Info",
      S: "Purpose",
      RO: "97123456789",
    };

    Object.entries(formData).forEach(([id, value]) => {
      document.getElementById(id).value = value;
    });

    // Mock network error
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    // Submit form
    form.dispatchEvent(new Event("submit"));

    // Wait for async operations to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify all field values are preserved
    Object.entries(formData).forEach(([id, value]) => {
      expect(document.getElementById(id).value).toBe(value);
    });
  });
});
