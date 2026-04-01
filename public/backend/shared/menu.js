function getElement(selector) {
  return document.querySelector(selector);
}

export function ensureMenuOverlay(overlaySelector = "#menu-overlay") {
  let overlay = getElement(overlaySelector);
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = overlaySelector.startsWith("#") ? overlaySelector.slice(1) : "menu-overlay";
    document.body.appendChild(overlay);
  }
  return overlay;
}

export function initSideMenu({
  menuButtonSelector = "#menu-btn",
  sideMenuSelector = "#side-menu",
  overlaySelector = "#menu-overlay"
} = {}) {
  const menuButton = getElement(menuButtonSelector) || getElement(".top-btn--secondary");
  const sideMenu = getElement(sideMenuSelector);
  const overlay = ensureMenuOverlay(overlaySelector);

  if (!menuButton || !sideMenu || !overlay) {
    return;
  }

  const openMenu = () => {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
  };

  const closeMenu = () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  };

  menuButton.addEventListener("click", openMenu);
  overlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}
