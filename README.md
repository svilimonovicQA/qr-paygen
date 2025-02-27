# QR PayGen - Serbian Payment QR Code Generator

A web application for generating QR codes for Serbian payment slips, following the National Bank of Serbia (NBS) standards.

Live demo: [https://qr-paygen.vercel.app/](https://qr-paygen.vercel.app/)

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Form Fields](#form-fields)
- [Validation Rules](#validation-rules)
- [API Integration](#api-integration)
- [Testing](#testing)
  - [Test Structure](#test-structure)
  - [Running Tests](#running-tests)
  - [Test Coverage](#test-coverage)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- Generate QR codes for Serbian payment slips
- Real-time form validation
- Visual feedback for validation errors
- Support for required and optional fields
- Integration with NBS QR code generation API
- Responsive design
- Comprehensive test coverage

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Jest (Testing Framework)
- JSDOM (DOM Testing Environment)

## Project Structure

```
qr-paygen/
├── index.html          # Main HTML file
├── style.css          # Styles
├── script.js          # Core application logic
├── tests/            # Test files
│   ├── setup.js      # Test environment setup
│   ├── form.test.js  # Form handling tests
│   ├── ui.test.js    # UI interaction tests
│   └── validation.test.js # Validation logic tests
├── package.json      # Project dependencies and scripts
└── README.md        # Project documentation
```

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/qr-paygen.git
   cd qr-paygen
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development:

   - Open index.html in your browser
   - For live reload, you can use any local server

4. Run tests:
   ```bash
   npm test        # Run tests once
   npm test:watch  # Run tests in watch mode
   ```

## Form Fields

### Required Fields

- **K**: Company/Payee Name
- **V**: Version (1.0)
- **C**: Currency (1 for RSD)
- **R**: Account Number (18 digits)
- **N**: Payer Name
- **I**: Amount (Format: RSD[amount],[decimals])
- **SF**: Payment Code (1-3 digits)

### Optional Fields

- **P**: Additional Payment Details
- **S**: Payment Purpose
- **RO**: Reference Number (Model + Reference)

## Validation Rules

1. **Account Number (R)**

   - Exactly 18 digits
   - Numeric only

   ```javascript
   const regex = /^\d{18}$/;
   ```

2. **Amount (I)**

   - Format: RSD followed by amount
   - Optional decimal places

   ```javascript
   const regex = /^RSD\d+(?:,\d{2})?$/;
   ```

3. **Payment Code (SF)**

   - 1-3 digits

   ```javascript
   const regex = /^\d{1,3}$/;
   ```

4. **Reference Number (RO)**
   - Model (2 digits) + Reference (up to 21 digits)
   ```javascript
   const regex = /^(0[1-9]|[1-9][0-9])[0-9]{1,21}$/;
   ```

## API Integration

The application integrates with the NBS QR code generation API:

```javascript
fetch("https://nbs.rs/QRcode/api/qr/v1/gen", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(formData),
});
```

## Testing

### Test Structure

1. **Validation Tests** (validation.test.js)

   - Account number validation
   - Amount format validation
   - Payment code validation
   - Reference number validation

2. **Form Tests** (form.test.js)

   - Required field validation
   - Form submission handling
   - API error handling
   - QR code display

3. **UI Tests** (ui.test.js)
   - Error message display
   - Border color management
   - Form state preservation
   - Optional field handling
   - Network error feedback

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/ui.test.js
```

### Test Coverage

The test suite includes:

- 30 total tests across 3 test suites
- Form validation tests
- UI interaction tests
- Error handling tests
- Network request mocking
- DOM manipulation tests

Key test scenarios:

1. Form Validation

   - Empty required fields
   - Invalid input formats
   - Multiple simultaneous errors

2. UI Feedback

   - Error message styling
   - Border color changes
   - QR code image display

3. Error Handling

   - Network errors
   - API response errors
   - Form state preservation

4. Optional Fields
   - Proper handling of undefined values
   - API payload verification

## Error Handling

1. **Validation Errors**

   - Visual feedback with red borders
   - Error messages below fields
   - Clear error messages on resubmission

2. **Network Errors**

   - User-friendly error messages
   - Form state preservation
   - Retry capability

3. **API Errors**
   - Graceful error handling
   - Clear user feedback
   - Console error logging (in development)

## Deployment

The application is deployed on Vercel:

- Production URL: [https://qr-paygen.vercel.app/](https://qr-paygen.vercel.app/)
- Automatic deployments on main branch updates
- Zero-configuration setup

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
