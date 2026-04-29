const PHONE_DISPLAY = "(000) 000-0000";
const PHONE_TEL = "+10000000000";

document.querySelectorAll("[data-phone-display]").forEach((node) => {
  node.textContent = PHONE_DISPLAY;
});

document.querySelectorAll("[data-phone-link]").forEach((node) => {
  node.setAttribute("href", `tel:${PHONE_TEL}`);
});

const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-main-nav]");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thanks. Please call now for fastest service.");
  });
}
