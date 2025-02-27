const fs = require("fs");
const path = require("path");

// Load the script content
const scriptContent = fs.readFileSync(
  path.join(__dirname, "../script.js"),
  "utf8"
);

describe("Form Handling", () => {
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
      <img id="qrCode" style="display: none">
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

  test("should show error for empty required fields", () => {
    // Trigger form submission
    form.dispatchEvent(new Event("submit"));

    // Check if error messages are displayed for required fields
    ["K", "V", "C", "R", "N", "I", "SF"].forEach((fieldId) => {
      const errorMessage = document.querySelector(
        `#${fieldId} + .error-message`
      );
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent).toBe("Ovo polje je obavezno");
    });
  });

  test("should validate all fields with valid data", () => {
    // Set valid values for all required fields
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

    // Mock fetch before form submission
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob()),
      })
    );

    // Submit form
    form.dispatchEvent(new Event("submit"));

    // Check that no error messages are displayed
    const errorMessages = document.querySelectorAll(".error-message");
    expect(errorMessages.length).toBe(0);

    // Verify API call
    expect(fetch).toHaveBeenCalledWith(
      "https://nbs.rs/QRcode/api/qr/v1/gen",
      expect.any(Object)
    );
  });

  test("should handle API error gracefully", async () => {
    // Set valid values for all required fields
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

    // Mock fetch to return an error
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    // Submit form
    form.dispatchEvent(new Event("submit"));

    // Wait for async operations to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check for error message
    const errorMessage = document.querySelector("#submit + .error-message");
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toBe(
      "Greška pri generisanju QR koda. Molimo proverite unete podatke."
    );

    // Verify that console.error was called
    expect(console.error).toHaveBeenCalled();
  });

  test("should display QR code on successful API response", async () => {
    // Set valid values for all required fields
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

    // Check if QR code image is displayed
    expect(qrCodeImg.style.display).toBe("block");
    expect(qrCodeImg.src).toBe(mockResult);
  });
});
