/* PRODUTOS.JS — dados dos produtos da SE7E (compartilhado por loja e admin) */
const PRODUTOS_PADRAO = [
  { id: "terceirao", nome: "Camisa Terceirão", preco: 69.99, estoque: 20, cor: "Bege", categoria: "Camisetas",
    descricao: "Camisa do terceirão 2024.1, feita 100% algodão, moderna e confortável.",
    fotos: ["img/produtos/moletom-oversized-1.jpg", "img/produtos/moletom-oversized-2.jpg"] },
  { id: "matue", nome: "Camiseta Oversized Matuê 333", preco: 99.99, estoque: 15, cor: "Off-white", categoria: "Camisetas",
    descricao: "Camiseta oversized off-white, corte solto e tecido macio para o dia a dia.",
    fotos: ["https://www.asteric.com.br/cdn/shop/files/CAMISAMATUE333-OFFWHITE.jpg?v=1723335105"] },
  { id: "cargo", nome: "Calça Cargo", preco: 129.99, estoque: 10, cor: "Verde militar", categoria: "Calças",
    descricao: "Calça cargo em sarja com bolsos laterais, resistente e confortável.",
    fotos: ["https://images.tcdn.com.br/img/img_prod/873120/cala_sarja_masculina_verde_militar_1_20260416113745_f21a1eebb1d2.jpg"] },
  { id: "moletom", nome: "Moletom Oversized", preco: 199.90, estoque: 25, cor: "Verde quartzo", categoria: "Jaquetas",
    descricao: "Moletom canguru com capuz, modelagem oversized e forro macio.",
    fotos: ["https://s.brunxind.com/gallery/moletom-canguru-premium-3-cabos-com-capuz-verdel-quartzo-2702142334.jpg"] }
];

// Fotos locais (img/...) precisam de "../" quando a página está em pages/
function caminhoFoto(foto, naPastaPages) {
  return /^https?:/.test(foto) || !naPastaPages ? foto : "../" + foto;
}

/* Persistência (localStorage): produtos editados no admin, carrinho e pedidos */
const CHAVE_PRODUTOS = "se7e-produtos", CHAVE_CARRINHO = "se7e-carrinho", CHAVE_PEDIDO = "se7e-pedido";
function lerJSON(chave, padrao) {
  try { const v = JSON.parse(localStorage.getItem(chave)); return v ?? padrao; } catch { return padrao; }
}
function gravarJSON(chave, valor) { try { localStorage.setItem(chave, JSON.stringify(valor)); } catch {} }
const PRODUTOS = (() => {
  const salvos = lerJSON(CHAVE_PRODUTOS, null);
  return Array.isArray(salvos) ? salvos : JSON.parse(JSON.stringify(PRODUTOS_PADRAO));
})();
function salvarProdutos() { gravarJSON(CHAVE_PRODUTOS, PRODUTOS); }
function lerCarrinho() { return lerJSON(CHAVE_CARRINHO, []); }
function gravarCarrinho(itens) { gravarJSON(CHAVE_CARRINHO, itens); }
function itensDetalhados(itens) {
  return itens.map((i) => ({ ...i, produto: PRODUTOS.find((p) => p.id === i.id) })).filter((i) => i.produto);
}
function totaisCarrinho(itens = lerCarrinho()) {
  const d = itensDetalhados(itens);
  return { qtd: d.reduce((s, i) => s + i.qtd, 0), subtotal: d.reduce((s, i) => s + i.qtd * i.produto.preco, 0) };
}

/* Cupons de desconto (valor fixo em R$, conforme a camada de persistência do Documento de Requisitos) */
const CUPONS = { DESCONTO10: 10, DESCONTO15: 15, DESCONTO20: 20, DESCONTO30: 30, DESCONTO50: 50 };
function descontoDoCupom(subtotal) {
  try {
    const codigo = sessionStorage.getItem("se7e-cupom");
    return codigo && CUPONS[codigo] ? Math.min(CUPONS[codigo], subtotal) : 0;
  } catch { return 0; }
}
