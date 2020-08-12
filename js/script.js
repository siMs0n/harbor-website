// Från https://www.a11ymatters.com/pattern/mobile-nav/#dont-hide-the-nav-element
// Lärde mig hur man gör en accessible mobil-navigation.

var toggle = document.querySelector("#toggle");
var menu = document.querySelector("#menu");
var navBurgerIcon = document.querySelector("#nav-burger-icon");
var navCloseIcon = document.querySelector("#nav-close-icon");

toggle.addEventListener("click", function () {
  if (menu.classList.contains("is-active")) {
    //Menu is open and should close
    this.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-active");
    navCloseIcon.classList.remove("is-active");
    navBurgerIcon.classList.add("is-active");
  } else {
    //Menu is closed and should open
    menu.classList.add("is-active");
    this.setAttribute("aria-expanded", "true");
    navCloseIcon.classList.add("is-active");
    navBurgerIcon.classList.remove("is-active");
  }
});

// Form logic
function onSelectContactOption(event) {
  const option = document.querySelector("#contactOption").value;

  const emailElement = document.querySelector("#formEmail");
  const phoneElement = document.querySelector("#formPhone");

  if (!emailElement.classList.contains("hidden")) {
    emailElement.classList.add("hidden");
    emailElement.setAttribute("required", false);
  }

  if (!phoneElement.classList.contains("hidden")) {
    phoneElement.classList.add("hidden");
    phoneElement.setAttribute("required", false);
  }

  if (option === "Mail") {
    emailElement.classList.remove("hidden");
    emailElement.setAttribute("required", true);
  } else if (option === "Telefon") {
    phoneElement.classList.remove("hidden");
    phoneElement.setAttribute("required", true);
  }
}
