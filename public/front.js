const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('side-menu');
const overlay = document.getElementById('menu-overlay');

function openMenu() {
  sideMenu.classList.add('active');
  overlay.classList.add('active');
}

function closeMenu() {
  sideMenu.classList.remove('active');
  overlay.classList.remove('active');
}

menuBtn.addEventListener('click', openMenu);
overlay.addEventListener('click', closeMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") closeMenu();
});