document.addEventListener('DOMContentLoaded', () => {
  const topbarToggler = document.getElementById('topbarToggler');
  const topbarMenu = document.getElementById('topbarMenu');

  if (topbarToggler && topbarMenu) {
    topbarToggler.addEventListener('click', () => {
      topbarMenu.classList.toggle('active');
    });
  }

  // Opcional: cerrar el menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!topbarMenu.contains(e.target) && !topbarToggler.contains(e.target)) {
      topbarMenu.classList.remove('active');
    }
  });
});
