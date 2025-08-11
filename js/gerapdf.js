// gerar-pdf.js
window.gerarPDFPedido = function (dados) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // ==== Cabeçalho com logo ====
  const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"; // troque pelo seu logo
  doc.addImage(logoUrl, "PNG", 10, 8, 20, 20);

  doc.setFontSize(16);
  doc.text(dados.empresa.nome, 35, 15);
  doc.setFontSize(10);
  doc.text(`CNPJ: ${dados.empresa.cnpj}`, 35, 20);
  doc.text(`Contato: ${dados.empresa.contato}`, 35, 25);

  doc.line(10, 32, 200, 32); // linha divisória

  // ==== Dados do cliente ====
  doc.setFontSize(12);
  doc.text("Dados do Cliente", 10, 40);
  doc.setFontSize(10);
  doc.text(`Nome: ${dados.cliente.nome}`, 10, 46);
  doc.text(`Telefone: ${dados.cliente.telefone}`, 10, 51);

  doc.line(10, 57, 200, 57);

  // ==== Tabela de itens ====
  const body = dados.itens.map(item => [
    item.qtd,
    item.nome,
    `R$ ${item.preco.toFixed(2).replace('.', ',')}`,
    `R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}`
  ]);

  doc.autoTable({
    head: [["Qtd", "Produto", "Unitário", "Total"]],
    body: body,
    startY: 62,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [40, 40, 40], textColor: 255, halign: 'center' },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { cellWidth: 95 },
      2: { halign: 'right', cellWidth: 25 },
      3: { halign: 'right', cellWidth: 25 }
    }
  });

  // ==== Resumo ====
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text("Resumo do Pedido", 10, finalY);
  finalY += 6;
  doc.setFontSize(10);
  doc.text(`Subtotal: R$ ${dados.calculos.subtotal.toFixed(2).replace('.', ',')}`, 10, finalY);
  finalY += 5;
  doc.text(`Desconto/Taxa: R$ ${dados.calculos.ajuste.toFixed(2).replace('.', ',')}`, 10, finalY);
  finalY += 5;
  doc.text(`Total: R$ ${dados.calculos.total.toFixed(2).replace('.', ',')}`, 10, finalY);

  // Forma de pagamento
  finalY += 8;
  doc.text(`Forma de Pagamento: ${dados.formaPagamento}`, 10, finalY);

  // Observação
  if (dados.observacao) {
    finalY += 8;
    doc.setFontSize(10);
    doc.text("Observação:", 10, finalY);
    finalY += 5;
    doc.text(dados.observacao, 10, finalY, { maxWidth: 180 });
  }

  // ==== Rodapé ====
  doc.setFontSize(8);
  doc.text(`Gerado em: ${new Date(dados.criadoEm).toLocaleString()}`, 10, 290);

  // Salvar PDF
  doc.save(`pedido-${Date.now()}.pdf`);
};
