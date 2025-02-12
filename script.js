document.getElementById("qrForm").addEventListener("submit", function (event) {
  event.preventDefault();

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
      return response.blob(); // Handle the response as a blob
    })
    .then((blob) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        document.getElementById("qrCode").src = reader.result; // Set the image source
        document.getElementById("qrCode").style.display = "block"; // Make the image visible
      };
      reader.readAsDataURL(blob); // Convert the blob to base64
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
