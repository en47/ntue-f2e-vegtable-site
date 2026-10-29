"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigationLinks = document.querySelector("#navigation-links");
const mobileViewport = window.matchMedia("(max-width: 767px)");

function setMenuOpen(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  navigationLinks.hidden = mobileViewport.matches && !open;
}

setMenuOpen(false);
mobileViewport.addEventListener("change", () => setMenuOpen(false));
menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});
navigationLinks.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  setMenuOpen(false);
  // Move keyboard focus to the destination, including when the menu collapses.
  const destination = document.querySelector(link.getAttribute("href"));
  if (destination) {
    destination.setAttribute("tabindex", "-1");
    destination.focus({ preventScroll: true });
    destination.addEventListener("blur", () => destination.removeAttribute("tabindex"), { once: true });
  }
});
document.querySelector(".navigation").addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileViewport.matches) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

const accountDialog = document.querySelector("#account-dialog");
const accountForm = document.querySelector("#account-form");
const nameField = document.querySelector("#name-field");
const nameInput = document.querySelector("#account-name");
const formStatus = document.querySelector(".form-status");
const submitButton = document.querySelector(".demo-submit");

document.querySelectorAll("[data-account]").forEach((button) => {
  button.addEventListener("click", () => {
    const joining = button.dataset.account === "join";
    accountForm.reset();
    formStatus.textContent = "";
    nameField.hidden = !joining;
    nameInput.required = joining;
    nameInput.disabled = !joining;
    document.querySelector("#account-title").textContent = joining ? "Demo registration" : "Demo sign in";
    submitButton.textContent = joining ? "Try demo registration" : "Demo sign in";
    accountDialog.showModal();
    (joining ? nameInput : document.querySelector("#account-email")).focus();
  });
});

accountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  accountForm.reset();
  formStatus.textContent = "Demo complete. No account was created and no sign-in occurred. Your entries were cleared; nothing was sent or saved.";
});
accountDialog.addEventListener("close", () => {
  accountForm.reset();
  formStatus.textContent = "";
});

const socialDialog = document.querySelector("#social-dialog");
document.querySelectorAll("[data-social]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#social-title").textContent = `${button.dataset.social} demo`;
    document.querySelector("#social-note").textContent = "This is a demonstration control. A social media profile has not been provided.";
    socialDialog.showModal();
  });
});

// Native dialogs provide modal focus containment, Escape, and focus restoration.
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
      dialog.close();
    }
  });
});
