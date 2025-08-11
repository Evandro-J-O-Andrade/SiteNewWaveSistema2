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
  const btnExportJson = document.getElementById("btnExportJson");
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

  btnExportJson.addEventListener("click", () => {
    const snapshot = {
      carrinho,
      cliente: { nome: nomeCliente.value, telefone: telefoneCliente.value },
      formaPagamento: formaPagamento.value,
      calculos: calcular()
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pedido.json";
    a.click();
    URL.revokeObjectURL(url);
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
