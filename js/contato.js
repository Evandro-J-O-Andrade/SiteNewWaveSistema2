// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
  
  // Seleciona o formulário pelo ID definido no HTML
  const form = document.getElementById('formContato');

  // Se não encontrar o formulário, encerra o script para evitar erros
  if (!form) return;

  // Adiciona um listener que escuta o evento de submit do formulário
  form.addEventListener('submit', async (e) => {
    // Previne o comportamento padrão do submit, que recarregaria a página
    e.preventDefault();

    // Coleta e limpa o valor do campo nome
    const nome = form.nome.value.trim();

    // Coleta e limpa o valor do campo email
    const email = form.email.value.trim();

    // Coleta e limpa o valor do campo telefone (opcional)
    const telefone = form.telefone.value.trim();

    // Coleta e limpa o valor do campo mensagem
    const mensagem = form.mensagem.value.trim();

    // Valida se os campos obrigatórios foram preenchidos
    if (!nome || !email || !mensagem) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return; // Interrompe o envio se faltar algum campo
    }

    // Expressão regular para validar o formato do e-mail informado
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Valida o formato do e-mail, se estiver incorreto, mostra alerta
    if (!emailRegex.test(email)) {
      alert('Por favor, informe um e-mail válido.');
      return; // Interrompe o envio se o e-mail for inválido
    }

    try {
      // Faz a requisição para o endpoint do Formspree ou servidor
      const response = await fetch('https://formspree.io/f/xrbglbod', {
        method: 'POST', // Método POST para envio
        headers: {
          'Content-Type': 'application/json' // Define o formato como JSON
        },
        // Converte os dados capturados para JSON para enviar no corpo da requisição
        body: JSON.stringify({
          nome,
          email,
          telefone,
          mensagem
        })
      });

      // Verifica se a resposta da API foi um sucesso (status HTTP 200-299)
      if (response.ok) {
        alert('Mensagem enviada com sucesso! Obrigado por entrar em contato.');
        form.reset(); // Limpa todos os campos do formulário após o envio
      } else {
        // Caso a resposta não esteja ok, informa o erro ao usuário
        alert('Erro ao enviar a mensagem. Tente novamente.');
      }
    } catch (error) {
      // Captura e exibe no console qualquer erro de rede ou processamento
      console.error('Erro ao enviar o formulário:', error);
      alert('Erro de conexão. Tente novamente mais tarde.');
    }
  });
});
