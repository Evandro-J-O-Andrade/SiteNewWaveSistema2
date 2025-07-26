// menu.js

// Espera a página carregar totalmente
document.addEventListener('DOMContentLoaded', function () {
  const btnMenu = document.getElementById('btn-menu');       // botão imagem
  const menuPrincipal = document.getElementById('menu-principal'); // ul ou nav
  let menuAberto = false;

  btnMenu.addEventListener('click', function () {
    menuAberto = !menuAberto;

    // Alterna o menu e a imagem
    menuPrincipal.classList.toggle('menu-ativo', menuAberto);
    btnMenu.classList.toggle('ativo', menuAberto);
  });
});
