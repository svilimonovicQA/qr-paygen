const {
  validateAccountNumber,
  validateAmount,
  validatePaymentCode,
  validateReferenceNumber,
} = require("../script");

describe("Form Validation Functions", () => {
  describe("validateAccountNumber", () => {
    test("should accept valid 18-digit account number", () => {
      const result = validateAccountNumber("123456789012345678");
      expect(result.isValid).toBe(true);
    });

    test("should reject account number with less than 18 digits", () => {
      const result = validateAccountNumber("12345678901234567");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Broj računa mora sadržati tačno 18 cifara");
    });

    test("should reject account number with more than 18 digits", () => {
      const result = validateAccountNumber("1234567890123456789");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Broj računa mora sadržati tačno 18 cifara");
    });

    test("should reject non-numeric characters", () => {
      const result = validateAccountNumber("12345678901234567a");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe("Broj računa mora sadržati tačno 18 cifara");
    });
  });

  describe("validateAmount", () => {
    test("should accept valid amount format without decimals", () => {
      const result = validateAmount("RSD1000");
      expect(result.isValid).toBe(true);
    });

    test("should accept valid amount format with decimals", () => {
      const result = validateAmount("RSD1000,50");
      expect(result.isValid).toBe(true);
    });

    test("should reject amount without RSD prefix", () => {
      const result = validateAmount("1000,50");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(
        "Iznos mora biti u formatu: RSD[broj],[decimale] (npr. RSD3596,13)"
      );
    });

    test("should reject amount with invalid decimal format", () => {
      const result = validateAmount("RSD1000.50");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(
        "Iznos mora biti u formatu: RSD[broj],[decimale] (npr. RSD3596,13)"
      );
    });
  });

  describe("validatePaymentCode", () => {
    test("should accept valid 1-digit code", () => {
      const result = validatePaymentCode("1");
      expect(result.isValid).toBe(true);
    });

    test("should accept valid 2-digit code", () => {
      const result = validatePaymentCode("12");
      expect(result.isValid).toBe(true);
    });

    test("should accept valid 3-digit code", () => {
      const result = validatePaymentCode("123");
      expect(result.isValid).toBe(true);
    });

    test("should reject code with more than 3 digits", () => {
      const result = validatePaymentCode("1234");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(
        "Šifra plaćanja mora biti broj od 1 do 3 cifre"
      );
    });

    test("should reject non-numeric characters", () => {
      const result = validatePaymentCode("12a");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(
        "Šifra plaćanja mora biti broj od 1 do 3 cifre"
      );
    });
  });

  describe("validateReferenceNumber", () => {
    test("should accept valid reference number format", () => {
      const result = validateReferenceNumber("97123456789012345678901");
      expect(result.isValid).toBe(true);
    });

    test("should accept minimum valid reference number", () => {
      const result = validateReferenceNumber("971");
      expect(result.isValid).toBe(true);
    });

    test("should reject reference number with invalid model length", () => {
      const result = validateReferenceNumber("001234567890");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(
        "Model i poziv na broj mora biti u formatu: [model-2 cifre][poziv na broj-do 21 cifre]"
      );
    });

    test("should reject reference number that's too long", () => {
      const result = validateReferenceNumber("971234567890123456789012345");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(
        "Model i poziv na broj mora biti u formatu: [model-2 cifre][poziv na broj-do 21 cifre]"
      );
    });

    test("should reject non-numeric characters", () => {
      const result = validateReferenceNumber("97abc123456789");
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(
        "Model i poziv na broj mora biti u formatu: [model-2 cifre][poziv na broj-do 21 cifre]"
      );
    });
  });
});
