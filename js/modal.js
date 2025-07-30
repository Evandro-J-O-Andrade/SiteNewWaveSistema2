// Aguarda o carregamento completo do conteúdo da página antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
  
  // Seleciona o elemento do modal pelo ID 'modal-saiba-mais'
  const modal = document.getElementById('modal-saiba-mais');
  
  // Seleciona o elemento onde ficará o título do modal
  const modalTitulo = document.getElementById('modal-titulo');
  
  // Seleciona o elemento onde ficará a descrição do modal
  const modalDescricao = document.getElementById('modal-descricao');
  
  // Seleciona o iframe onde será carregado o vídeo do modal
  const modalVideoFrame = document.getElementById('modal-video-frame');
  
  // Seleciona o botão (ou elemento) para fechar o modal (o "X")
  const modalClose = document.getElementById('modal-close');

  // Verifica se todos os elementos necessários existem na página
  if (!modal || !modalTitulo || !modalDescricao || !modalVideoFrame || !modalClose) {
    console.error('Elementos do modal não encontrados no DOM.');
    return; // Para a execução do script caso algum elemento esteja faltando
  }

  // Objeto que contém informações de cada produto para preencher o modal dinamicamente
  // Aqui com 15 produtos
  const produtosInfo = {
    produto1: {
      titulo: "Kit de Câmeras",
      descricao: "Este kit inclui câmeras de alta definição para segurança residencial e empresarial.",
      videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A"
    },
    produto2: {
      titulo: "Teclados",
      descricao: "Teclados ergonômicos e resistentes para uso profissional e doméstico.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    produto3: {
      titulo: "Centrais de alarmes",
      descricao: "Centrais inteligentes para proteção e monitoramento 24h.",
      videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4"
    },
    produto4: {
      titulo: "Integração com Intranet",
      descricao: "Soluções para integrar sistemas internos com alta segurança.",
      videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY"
    },
    produto5: {
      titulo: "Mouse Simples",
      descricao: "Mouse ergonômico, confortável e preciso para uso diário.",
      videoUrl: "https://www.youtube.com/embed/FTQbiNvZqaY"
    },
    produto6: {
      titulo: "Monitor HD",
      descricao: "Monitores de alta definição para melhor qualidade de imagem.",
      videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ"
    },
    produto7: {
      titulo: "Impressoras Laser",
      descricao: "Impressoras rápidas e econômicas para escritórios.",
      videoUrl: "https://www.youtube.com/embed/Fb3kj2Ow0qQ"
    },
    produto8: {
      titulo: "Roteadores Wi-Fi",
      descricao: "Roteadores com alta velocidade e alcance ampliado.",
      videoUrl: "https://www.youtube.com/embed/IwzjXS5RQXo"
    },
    produto9: {
      titulo: "Estabilizadores",
      descricao: "Proteção contra picos de energia para seus equipamentos.",
      videoUrl: "https://www.youtube.com/embed/xvFZjo5PgG0"
    },
    produto10: {
      titulo: "Headsets Profissionais",
      descricao: "Headsets confortáveis com excelente qualidade de áudio.",
      videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw"
    },
    produto11: {
      titulo: "Tablets",
      descricao: "Tablets para uso profissional com alta performance.",
      videoUrl: "https://www.youtube.com/embed/3fumBcKC6RE"
    },
    produto12: {
      titulo: "Servidores",
      descricao: "Servidores dedicados para empresas de todos os tamanhos.",
      videoUrl: "https://www.youtube.com/embed/eVTXPUF4Oz4"
    },
    produto13: {
      titulo: "Software ERP",
      descricao: "Sistemas integrados para gestão empresarial eficiente.",
      videoUrl: "https://www.youtube.com/embed/8SbUC-UaAxE"
    },
    produto14: {
      titulo: "Câmeras IP",
      descricao: "Câmeras de segurança com acesso remoto via internet.",
      videoUrl: "https://www.youtube.com/embed/LsoLEjrDogU"
    },
    produto15: {
      titulo: "Nobreaks",
      descricao: "Equipamentos para garantir energia contínua em caso de queda.",
      videoUrl: "https://www.youtube.com/embed/tntOCGkgt98"
    }
  };

  // Função que abre o modal preenchendo com as informações do produto passado como parâmetro
  function abrirModal(produtoId) {
    // Verifica se o produto existe no objeto produtosInfo
    if (produtosInfo[produtoId]) {
      // Insere o título no elemento do modal
      modalTitulo.textContent = produtosInfo[produtoId].titulo;
      
      // Insere a descrição no elemento do modal
      modalDescricao.textContent = produtosInfo[produtoId].descricao;
      
      // Define o src do iframe com o vídeo, ativando autoplay e desabilitando vídeos relacionados
      // Sem loop, apenas autoplay uma vez
      modalVideoFrame.src = produtosInfo[produtoId].videoUrl + "?autoplay=1&rel=0&loop=0";
      
      // Mostra o modal, alterando o display para 'block'
      modal.style.display = "block";
    } else {
      // Caso o produto não seja encontrado, exibe aviso no console
      console.warn(`Produto com ID '${produtoId}' não encontrado.`);
    }
  }

  // Função que fecha o modal e limpa o src do iframe para parar o vídeo
  function fecharModal() {
    modal.style.display = "none"; // Esconde o modal
    modalVideoFrame.src = "";     // Limpa o src para parar o vídeo do YouTube
  }

  // Adiciona um evento ao botão fechar para chamar a função fecharModal ao clicar
  modalClose.addEventListener('click', fecharModal);

  // Adiciona um evento para fechar o modal quando o usuário clicar fora da área do conteúdo (fundo escuro)
  window.addEventListener('click', (e) => {
    if (e.target === modal) { // Verifica se o alvo do clique foi o modal (fundo)
      fecharModal();          // Fecha o modal se for clicado fora do conteúdo
    }
  });

  // Seleciona todos os botões "Saiba mais" que abrirão o modal
  const botoesSaibaMais = document.querySelectorAll('.btn-saiba-mais');

  // Para cada botão encontrado, adiciona um evento de clique
  botoesSaibaMais.forEach(btn => {
    btn.addEventListener('click', () => {
      // Extrai o ID do produto do ID do botão (ex: 'btn-saiba-mais1' vira 'produto1')
      const idProduto = btn.id.replace('btn-saiba-mais', 'produto');
      
      // Chama a função para abrir o modal com os dados do produto correto
      abrirModal(idProduto);
    });
  });

});
