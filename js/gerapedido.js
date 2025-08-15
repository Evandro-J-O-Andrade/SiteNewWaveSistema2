// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener("DOMContentLoaded", () => {
    if (!window.fetch) {
        console.error("Fetch API não é suportada neste navegador.");
        alert("Seu navegador não suporta algumas funcionalidades deste site. Atualize seu navegador.");
        return; // Impede execução do código se fetch não estiver disponível
    }

    // Elementos da página utilizados
    const subtotalGeral = document.getElementById("subtotal-geral");
    const totalGeral = document.getElementById("total-geral");
    const freteSpan = document.getElementById("frete");
    const cepInput = document.getElementById("cep");
    const enderecoSpan = document.getElementById("endereco");
    const resumoTotal = document.getElementById("total");

    let frete = 0;                      // Valor inicial do frete
    const limiteFreteGratis = 360;     // Limite para frete grátis
    let isCepValidated = false;        // Controla se o CEP foi validado
    let isPurchaseFinalized = false;   // Controla se a compra foi finalizada

    // Atualiza o ícone do carrinho com base nos produtos
    function atualizarIconeCarrinho() {
        const produtosNoCarrinho = !carrinhoVazio();
        const cartIcons = document.querySelectorAll(".cart-icon");

        cartIcons.forEach(cartIcon => {
            cartIcon.src = produtosNoCarrinho
                ? "/assets/img/carrinhocheio.png"
                : "/assets/img/carrinho2.png";
        });
    }

    // Atualiza totais e frete
    function atualizarTotais() {
        let subtotal = 0;

        document.querySelectorAll(".quantidade").forEach((input) => {
            const preco = parseFloat(input.dataset.preco);
            const quantidade = parseInt(input.value) || 0;
            const subtotalProduto = preco * quantidade;

            input.closest("tr").querySelector(".subtotal").textContent = `R$ ${subtotalProduto.toFixed(2)}`;
            subtotal += subtotalProduto;
        });

        if (subtotal >= limiteFreteGratis) {
            frete = 0;
            freteSpan.textContent = "Parabéns você ganhou frete gratis!";
            freteSpan.style.color = "green";
        } else {
            freteSpan.textContent = `R$ ${frete.toFixed(2)}`;
            freteSpan.style.color = ""; // cor padrão
        }

        subtotalGeral.textContent = `R$ ${subtotal.toFixed(2)}`;
        totalGeral.textContent = `R$ ${(subtotal + frete).toFixed(2)}`;
        resumoTotal.textContent = (subtotal + frete).toFixed(2);

        atualizarIconeCarrinho();
    }

    // Verifica se o carrinho está vazio
    function carrinhoVazio() {
        let produtosNoCarrinho = 0;
        document.querySelectorAll(".quantidade").forEach((input) => {
            produtosNoCarrinho += parseInt(input.value) || 0;
        });
        return produtosNoCarrinho === 0;
    }

    // Consulta o frete baseado no CEP
    function calcularFrete() {
        const cep = cepInput.value.replace(/\D/g, "");

        if (cep.length !== 8) return; // Não continua se o CEP for inválido

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert("CEP inválido! Tente novamente.");
                    isCepValidated = false;
                    return;
                }

                enderecoSpan.textContent = `Endereço: ${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;

                if (["SP", "RJ"].includes(data.uf)) frete = 30.00;
                else if (["RS", "SC", "PR"].includes(data.uf)) frete = 50.00;
                else frete = 70.00;

                isCepValidated = true;
                atualizarTotais();
            })
            .catch(error => {
                alert("Erro ao buscar o CEP. Tente novamente.");
                console.error("Erro na API ViaCEP:", error);
                isCepValidated = false;
            });
    }

    // Evento quando o campo perde o foco
    cepInput.addEventListener("blur", () => {
        const cep = cepInput.value.replace(/\D/g, "");

        if (cep === "" || cep.length < 8) {
            enderecoSpan.textContent = "";
            frete = 0;
            isCepValidated = false;
            freteSpan.textContent = "Digite seu CEP para calcular o frete.";
            freteSpan.style.color = "#d10000"; // vermelho
            atualizarTotais();
        } else {
            calcularFrete();
        }
    });

    // Atualiza totais ao digitar o CEP
    cepInput.addEventListener("input", () => {
        const cep = cepInput.value.replace(/\D/g, "");

        if (cep === "") {
            enderecoSpan.textContent = "";
            frete = 0;
            isCepValidated = false;
            freteSpan.textContent = "Digite seu CEP para calcular o frete.";
            freteSpan.style.color = "#d10000";
            atualizarTotais();
        }
    });

    // Atualiza totais ao alterar quantidade
    document.querySelectorAll(".quantidade").forEach((input) => {
        input.addEventListener("input", () => {
            if (isPurchaseFinalized) {
                alert("A compra já foi finalizada. Inicie uma nova compra para modificar.");
                input.value = input.defaultValue;
                return;
            }
            atualizarTotais();
        });
    });

    // Atualiza totais na primeira execução
    atualizarTotais();

    // Expõe as funções globalmente se forem usadas no HTML
    window.calcularFrete = calcularFrete;
});

(() => {
  // catálogo de exemplo (id, nome, preço, imagem)
  const CATALOGO = [
    { id: "Base Líquida 30ml", nome: "Base Líquida 30ml", preco: 39.90, img: "https://picsum.photos/seed/p1/400/300" },
    { id: "Batom Hidratante", nome: "Batom Hidratante", preco: 24.50, img: "https://picsum.photos/seed/p2/400/300" },
    { id: "Paleta de Sombras", nome: "Paleta de Sombras", preco: 89.00, img: "https://picsum.photos/seed/p3/400/300" },
    { id: "Demaquilante 200ml", nome: "Demaquilante 200ml", preco: 29.90, img: "https://picsum.photos/seed/p4/400/300" },
    { id: "Esmalte Vermelho", nome: "Esmalte Vermelho", preco: 15.00, img: "https://picsum.photos/seed/p5/400/300" },
    { id: "Kit de Pincéis", nome: "Kit de Pincéis", preco: 79.90, img: "https://picsum.photos/seed/p6/400/300" },
    { id: "Máscara para Cílios", nome: "Máscara para Cílios", preco: 35.00, img: "https://picsum.photos/seed/p7/400/300" },
    { id: "Perfume Floral 50ml", nome: "Perfume Floral 50ml", preco: 120.00, img: "https://picsum.photos/seed/p8/400/300" },
    { id: "Hidratante Corporal 200ml", nome: "Hidratante Corporal 200ml", preco: 45.00, img: "https://picsum.photos/seed/p9/400/300" },
    { id: "Protetor Solar FPS 50", nome: "Protetor Solar FPS 50", preco: 55.00, img: "https://picsum.photos/seed/p10/400/300" },
    { id: "Sombra Compacta", nome: "Sombra Compacta", preco: 22.00, img: "https://picsum.photos/seed/p11/400/300" },
    { id: "Gloss Labial", nome: "Gloss Labial", preco: 18.00, img: "https://picsum.photos/seed/p12/400/300" },
    { id: "Lápis de Olho", nome: "Lápis de Olho", preco: 15.50, img: "https://picsum.photos/seed/p13/400/300" },
    { id: "Creme Anti-Idade", nome: "Creme Anti-Idade", preco: 99.90, img: "https://picsum.photos/seed/p14/400/300" },
    { id: "Kit de Maquiagem Completo", nome: "Kit de Maquiagem Completo", preco: 299.90, img: "https://picsum.photos/seed/p15/400/300" }
  ];

  // Mapeamento dos IDs da página produtos para os IDs do catálogo
  const mapaIdsProdutos = {
    produto1: "Base Líquida 30ml",
    produto2: "Batom Hidratante",
    produto3: "Paleta de Sombras",
    produto4: "Demaquilante 200ml",
    produto5: "Esmalte Vermelho",
    produto6: "Kit de Pincéis",
    produto7: "Máscara para Cílios",
    produto8: "Perfume Floral 50ml",
    produto9: "Hidratante Corporal 200ml",
    produto10: "Protetor Solar FPS 50",
    produto11: "Sombra Compacta",
    produto12: "Gloss Labial",
    produto13: "Lápis de Olho",
    produto14: "Creme Anti-Idade",
    produto15: "Kit de Maquiagem Completo"
  };

  // taxas/ descontos
  const DESCONTO_AVISTA = 0.10;
  const TAXA_CARTAO = 0.05;

  // estado
  let carrinho = [];

  // elementos DOM
  const catalogoEl = document.getElementById("catalogo");
  const tabelaBody = document.querySelector("#tabelaProdutos tbody");
  const formaPagamento = document.getElementById("formaPagamento");
  const subtotalEl = document.getElementById("subtotal");
  const ajusteEl = document.getElementById("ajuste");
  const totalEl = document.getElementById("total");
  const btnGerarPDF = document.getElementById("btnGerarPDF");
   const limparCarrinho = document.getElementById("limparCarrinho");
  const nomeCliente = document.getElementById("nomeCliente");
  const telefoneCliente = document.getElementById("telefoneCliente");
  const observacao = document.getElementById("observacao");

  function formatMoney(v) {
    return v.toFixed(2).replace(".", ",");
  }

  function renderCatalogo() {
    catalogoEl.innerHTML = "";
    CATALOGO.forEach(prod => {
      const card = document.createElement("div");
      card.className = "card-prod";
      card.innerHTML = `
        <img src="${prod.img}" alt="${prod.nome}">
        <div class="nome">${prod.nome}</div>
        <div class="preco">R$ ${formatMoney(prod.preco)}</div>
        <button data-id="${prod.id}">Adicionar</button>
      `;
      catalogoEl.appendChild(card);
    });

    catalogoEl.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        adicionarAoCarrinho(id);
      });
    });
  }

  function adicionarAoCarrinho(id) {
    const prod = CATALOGO.find(p => p.id === id);
    if (!prod) return;
    const existente = carrinho.find(i => i.id === id);
    if (existente) {
      existente.qtd += 1;
    } else {
      carrinho.push({ id: prod.id, nome: prod.nome, preco: prod.preco, qtd: 1 });
    }
    atualizarTabela();
  }

  function removerDoCarrinho(id) {
    carrinho = carrinho.filter(i => i.id !== id);
    atualizarTabela();
  }

  function ajustarQtd(id, novaQtd) {
    const item = carrinho.find(i => i.id === id);
    if (!item) return;
    item.qtd = novaQtd <= 0 ? 1 : novaQtd;
    atualizarTabela();
  }

  function calcular() {
    const subtotal = carrinho.reduce((acc, i) => acc + i.preco * i.qtd, 0);
    const forma = formaPagamento.value;
    let ajuste = 0;

    if (forma === "avista") {
      ajuste = -subtotal * DESCONTO_AVISTA;
    } else if (forma === "credito") {
      ajuste = subtotal * TAXA_CARTAO;
    }

    const total = subtotal + ajuste;
    return { subtotal, ajuste, total };
  }

  function atualizarTabela() {
    tabelaBody.innerHTML = "";
    if (carrinho.length === 0) {
      tabelaBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#fff;padding:14px;">Carrinho vazio. Adicione produtos.</td></tr>`;
    } else {
      carrinho.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.nome}</td>
          <td>
            <input type="number" min="1" value="${item.qtd}" data-id="${item.id}" class="qtd-input" style="width:68px;padding:6px;" />
          </td>
          <td>R$ ${formatMoney(item.preco)}</td>
          <td>R$ ${formatMoney(item.preco * item.qtd)}</td>
          <td><button class="btn-sec remove" data-id="${item.id}">Remover</button></td>
        `;
        tabelaBody.appendChild(tr);
      });
    }

    tabelaBody.querySelectorAll(".qtd-input").forEach(inp => {
      inp.addEventListener("change", () => {
        const id = inp.getAttribute("data-id");
        const v = parseInt(inp.value) || 1;
        ajustarQtd(id, v);
      });
    });

    tabelaBody.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", () => {
        removerDoCarrinho(btn.getAttribute("data-id"));
      });
    });

    const vals = calcular();
    subtotalEl.textContent = formatMoney(vals.subtotal);
    ajusteEl.textContent = (vals.ajuste >= 0 ? "" : "-") + formatMoney(Math.abs(vals.ajuste));
    totalEl.textContent = formatMoney(vals.total);
  }

  formaPagamento.addEventListener("change", atualizarTabela);

  btnGerarPDF.addEventListener("click", () => {
    if (carrinho.length === 0) {
      alert("Adicione pelo menos um produto antes de gerar o PDF.");
      return;
    }
    const dados = {
      empresa: { nome: "New Wave Sistemas Digital", cnpj: "00.000.000/0001-00", contato: "(11) 91066-9810" },
      cliente: { nome: nomeCliente.value || "-", telefone: telefoneCliente.value || "-" },
      itens: JSON.parse(JSON.stringify(carrinho)),
      formaPagamento: formaPagamento.value,
      observacao: observacao.value || "",
      calculos: calcular(),
      criadoEm: new Date().toISOString()
    };
    window.gerarPDFPedido(dados);
  });

  
  limparCarrinho.addEventListener("click", () => {
    if (!confirm("Limpar o carrinho?")) return;
    carrinho = [];
    atualizarTabela();
  });

  // Função para pegar parâmetro da URL
  function getParametroURL(nome) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nome);
  }

  // Auto-adicionar produto via parâmetro URL "produto"
  function autoAdicionarProduto() {
    const produtoURL = getParametroURL("produto"); // exemplo: "produto3"
    if (produtoURL && mapaIdsProdutos[produtoURL]) {
      const idCatalogo = mapaIdsProdutos[produtoURL];
      adicionarAoCarrinho(idCatalogo);
      alert(`Produto "${idCatalogo}" adicionado automaticamente ao carrinho.`);
    }
  }

  // init
  renderCatalogo();
  atualizarTabela();
  autoAdicionarProduto();

})();
