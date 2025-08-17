const toggleBtn = document.getElementById("theme-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  if (document.body.classList.contains("light")) {
    toggleBtn.textContent = "Dark Mode";
  } else {
    toggleBtn.textContent = "Light Mode";
  }
});

// Booking form placeholder
const bookingForm = document.querySelector("#booking form");
bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert(
    "Your booking has been submitted! We will contact you with payment details."
  );
});

function whatsappMe() {
  // Replace with YOUR phone number (international format, no + or spaces)
  const phoneNumber = "256787963708";
  const message =
    "Hello Allan, I got your number from your website. Are you available to chat?";

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // Open WhatsApp chat
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
}

document.getElementById("whatsapp").addEventListener("onclick", whatsappMe);
