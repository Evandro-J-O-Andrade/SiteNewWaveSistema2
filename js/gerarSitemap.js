// Importa os módulos do Node
const fs = require('fs');
const path = require('path');

// Define a URL base do seu site
const BASE_URL = 'https://newwavesistemasdigital.netlify.app/';

// Define a pasta onde estão seus arquivos HTML
const pastaHtml = path.join(__dirname, 'html');

// Função para gerar o sitemap
function gerarSitemap() {
  // Lê todos os arquivos da pasta HTML
  const arquivos = fs.readdirSync(pastaHtml).filter(arquivo => arquivo.endsWith('.html'));

  // Gera as tags <url> para cada arquivo HTML
  const urls = arquivos.map(arquivo => {
    const urlCompleta = `${BASE_URL}html/${arquivo}`;
    return `
  <url>
    <loc>${urlCompleta}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('');

  // Monta o conteúdo final do sitemap.xml
  const conteudoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  // Salva o arquivo sitemap.xml
  fs.writeFileSync('sitemap.xml', conteudoSitemap);
  console.log('✅ Sitemap gerado com sucesso!');
}

// Executa a função
gerarSitemap();
