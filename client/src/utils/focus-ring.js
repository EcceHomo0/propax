// Toggle a class on <html> when the user navigates with keyboard (Tab)
// This lets us show focus rings only for keyboard users.
(function () {
  function handleFirstTab(e) {
    if (e.key === "Tab") {
      document.documentElement.classList.add("user-is-tabbing");
      window.removeEventListener("keydown", handleFirstTab);
      window.addEventListener("mousedown", handleMouseDownOnce);
    }
  }

  function handleMouseDownOnce() {
    document.documentElement.classList.remove("user-is-tabbing");
    window.removeEventListener("mousedown", handleMouseDownOnce);
    window.addEventListener("keydown", handleFirstTab);
  }

  window.addEventListener("keydown", handleFirstTab);
})();
