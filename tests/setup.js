require("whatwg-fetch");

// Mock DOM elements that our script expects to exist
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
  </form>
  <img id="qrCode">
`;
