// menu.js

document.addEventListener('DOMContentLoaded', function () {
  const btnMenu = document.getElementById('btn-menu');              // botão imagem
  const menuPrincipal = document.getElementById('menu-principal'); // ul ou nav
  const spanMenu = document.getElementById('span-menu');           // span "Menu"
  let menuAberto = false;

  btnMenu.addEventListener('click', function (event) {
    event.stopPropagation(); // Impede que o clique no botão feche o menu
    menuAberto = !menuAberto;

    menuPrincipal.classList.toggle('menu-ativo', menuAberto);
    btnMenu.classList.toggle('ativo', menuAberto);

    btnMenu.style.opacity = menuAberto ? '0' : '1';
    spanMenu.style.display = menuAberto ? 'none' : 'inline';
  });

  // Fecha o menu ao clicar fora dele (ex: qualquer lugar da tela)
  document.addEventListener('click', function (event) {
    if (menuAberto && !menuPrincipal.contains(event.target)) {
      menuAberto = false;
      menuPrincipal.classList.remove('menu-ativo');
      btnMenu.classList.remove('ativo');
      btnMenu.style.opacity = '1';
      spanMenu.style.display = 'inline';
    }
  });

  // Impede que clique dentro do menu feche ele
  menuPrincipal.addEventListener('click', function (event) {
    event.stopPropagation();
  });
});
