/* =========================================================
   SCRIPT.JS — Loja SE7E
   Comportamentos de interface (sem backend, sem persistência).
   Cada bloco verifica se o elemento existe antes de agir, então
   este mesmo arquivo pode ser incluído em todas as páginas.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderizarLoja();
  carregarProduto();
  formularioContato();
  finalizarPedido();
  formatarPrecos();
  fotosComReserva();
  menuMovel();
  alternarSenha();
  abasAcesso();
  acessoLogin();
  atalhosConta();
  galeriaProduto();
  selecaoGrade();
  acordeaoMedidas();
  seletoresDeQuantidade();
  carrinhoDinamico();
  formaDePagamento();
  copiarCodigoRastreio();
  abrirFormularioSolicitacao();
  botaoFavorito();
  adicionarAoCarrinho();
});

/* ---------- Aviso flutuante (toast) ---------- */
function mostrarAviso(mensagem) {
  let aviso = document.querySelector(".aviso-flutuante");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.className = "aviso-flutuante";
    aviso.innerHTML = `
      <svg class="icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/></svg>
      <span class="aviso-flutuante-texto"></span>`;
    document.body.appendChild(aviso);
  }
  aviso.querySelector(".aviso-flutuante-texto").textContent = mensagem;
  aviso.setAttribute("data-visivel", "true");
  clearTimeout(aviso._temporizador);
  aviso._temporizador = setTimeout(() => aviso.setAttribute("data-visivel", "false"), 2600);
}

/* ---------- Formata números para reais (R$ 0,00) ---------- */
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarPrecos() {
  // apenas placeholder de extensão futura — preços já vêm formatados no HTML
}

/* ---------- Menu de navegação em telas pequenas ---------- */
function menuMovel() {
  const botao = document.querySelector(".botao-menu-movel");
  const nav = document.querySelector(".nav-principal");
  if (!botao || !nav) return;
  botao.addEventListener("click", () => {
    const aberto = nav.getAttribute("data-aberto") === "true";
    nav.setAttribute("data-aberto", String(!aberto));
    nav.style.display = aberto ? "none" : "flex";
  });
}

/* ---------- Mostrar/ocultar senha ---------- */
function alternarSenha() {
  document.querySelectorAll(".alternar-senha").forEach((botao) => {
    botao.addEventListener("click", () => {
      const campo = botao.closest(".entrada-com-icone").querySelector("input");
      const mostrando = campo.type === "text";
      campo.type = mostrando ? "password" : "text";
      botao.innerHTML = mostrando ? iconeOlho() : iconeOlhoFechado();
    });
  });
}
function iconeOlho() {
  return '<svg class="icone icone-pequeno" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>';
}
function iconeOlhoFechado() {
  return '<svg class="icone icone-pequeno" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>';
}

/* ---------- Abas Entrar/Cadastrar na tela de acesso ---------- */
function abasAcesso() {
  const abas = document.querySelectorAll(".abas-acesso button");
  const paineis = document.querySelectorAll("[data-painel-acesso]");
  if (!abas.length) return;
  abas.forEach((aba) => {
    aba.addEventListener("click", () => {
      abas.forEach((a) => a.setAttribute("aria-selected", "false"));
      aba.setAttribute("aria-selected", "true");
      const alvo = aba.getAttribute("data-aba");
      paineis.forEach((p) => {
        p.style.display = p.getAttribute("data-painel-acesso") === alvo ? "block" : "none";
      });
    });
  });
}

/* ---------- Fotos: mostra o ícone reserva se a imagem não existir ---------- */
function fotosComReserva() {
  document.querySelectorAll("img.foto").forEach((foto) => {
    const caixa = foto.parentElement;
    const marcarFalha = () => caixa.classList.add("sem-foto");
    const marcarOk = () => caixa.classList.remove("sem-foto");
    foto.addEventListener("error", marcarFalha);
    foto.addEventListener("load", marcarOk);
    // a imagem pode já ter falhado antes deste script rodar
    if (foto.complete && foto.naturalWidth === 0) marcarFalha();
  });
}

/* ---------- Galeria de imagens do produto ---------- */
function galeriaProduto() {
  const miniaturas = document.querySelectorAll(".lista-miniaturas button");
  const fotoPrincipal = document.querySelector(".imagem-principal .foto");
  if (!miniaturas.length) return;
  miniaturas.forEach((miniatura) => {
    miniatura.addEventListener("click", () => {
      miniaturas.forEach((m) => m.setAttribute("aria-current", "false"));
      miniatura.setAttribute("aria-current", "true");
      const novaFoto = miniatura.dataset.imagem;
      if (fotoPrincipal && novaFoto) fotoPrincipal.src = novaFoto;
    });
  });
}

/* ---------- Seleção de cor e tamanho no produto ---------- */
function selecaoGrade() {
  document.querySelectorAll(".grade-cores, .grade-tamanhos").forEach((grupo) => {
    grupo.addEventListener("click", (evento) => {
      const opcao = evento.target.closest("button");
      if (!opcao || opcao.disabled) return;
      grupo.querySelectorAll("button").forEach((b) => b.setAttribute("aria-current", "false"));
      opcao.setAttribute("aria-current", "true");
    });
  });
}

/* ---------- Acordeão da tabela de medidas ---------- */
function acordeaoMedidas() {
  document.querySelectorAll(".acordeao-cabecalho").forEach((cabecalho) => {
    cabecalho.addEventListener("click", () => {
      const acordeao = cabecalho.closest(".acordeao");
      const aberto = acordeao.getAttribute("data-aberto") === "true";
      acordeao.setAttribute("data-aberto", String(!aberto));
      cabecalho.setAttribute("aria-expanded", String(!aberto));
    });
  });
}

/* ---------- Botão "Adicionar ao carrinho" (feedback visual) ---------- */
function adicionarAoCarrinho() {
  const botao = document.querySelector("[data-acao='adicionar-carrinho']");
  if (!botao) return;
  botao.addEventListener("click", () => {
    const detalhe = document.querySelector(".grade-produto-detalhe");
    const produto = PRODUTOS.find((p) => p.id === detalhe.dataset.produtoId);
    if (!produto) return;
    if (produto.estoque < 1) return mostrarAviso("Produto esgotado.");
    const tamanho = detalhe.querySelector(".grade-tamanhos [aria-current='true']")?.textContent.trim() || "M";
    const campo = detalhe.querySelector(".seletor-quantidade input, .seletor-quantidade span");
    const qtd = Number(campo?.value ?? campo?.textContent) || 1;
    const carrinho = lerCarrinho();
    const existente = carrinho.find((i) => i.id === produto.id && i.tamanho === tamanho);
    if (existente) existente.qtd = Math.min(existente.qtd + qtd, 10);
    else carrinho.push({ id: produto.id, tamanho, qtd });
    gravarCarrinho(carrinho);
    atualizarContador();
    mostrarAviso("Produto adicionado ao carrinho!");
  });
}

/* ---------- Favoritar produto ---------- */
function botaoFavorito() {
  document.querySelectorAll(".botao-favorito").forEach((botao) => {
    botao.addEventListener("click", (evento) => {
      evento.preventDefault();
      botao.classList.toggle("ativo");
    });
  });
}

/* ---------- Contadores de quantidade (produto e carrinho) ---------- */
function seletoresDeQuantidade() {
  document.querySelectorAll(".seletor-quantidade").forEach((seletor) => {
    const campo = seletor.querySelector("input, span");
    const diminuir = seletor.querySelector("[data-quantidade='diminuir']");
    const aumentar = seletor.querySelector("[data-quantidade='aumentar']");
    const minimo = 1;
    const maximo = Number(seletor.dataset.max) || 10;

    const definir = (valor) => {
      valor = Math.min(Math.max(valor, minimo), maximo);
      if (campo.tagName === "INPUT") campo.value = valor;
      else campo.textContent = valor;
      seletor.dispatchEvent(new CustomEvent("quantidade-alterada", { bubbles: true, detail: { valor } }));
    };

    diminuir?.addEventListener("click", () => definir(Number(campo.value ?? campo.textContent) - 1));
    aumentar?.addEventListener("click", () => definir(Number(campo.value ?? campo.textContent) + 1));
  });
}

/* ---------- Carrinho: recalcular subtotal/total e remover itens ---------- */
function carrinhoDinamico() {
  const lista = document.querySelector("[data-lista-carrinho]");
  if (!lista) return;

  const atualizarTotais = () => {
    let subtotal = 0;
    let quantidadeItens = 0;
    lista.querySelectorAll(".item-carrinho").forEach((item) => {
      const preco = Number(item.dataset.preco);
      const quantidadeEl = item.querySelector(".seletor-quantidade input, .seletor-quantidade span");
      const quantidade = Number(quantidadeEl.value ?? quantidadeEl.textContent);
      subtotal += preco * quantidade;
      quantidadeItens += quantidade;
      item.querySelector(".subtotal-item").textContent = formatarMoeda(preco * quantidade);
    });

    const frete = Number(document.querySelector("[data-valor-frete]")?.dataset.valorFrete || 0);
    const contadorItens = document.querySelector("[data-contador-itens]");
    const elSubtotal = document.querySelector("[data-subtotal]");
    const elTotal = document.querySelector("[data-total]");
    const contadorHeader = document.querySelector(".contador-carrinho");

    if (contadorItens) contadorItens.textContent = quantidadeItens;
    if (elSubtotal) elSubtotal.textContent = formatarMoeda(subtotal);
    if (elTotal) elTotal.textContent = formatarMoeda(subtotal + frete);
    if (contadorHeader) contadorHeader.textContent = quantidadeItens;

    const vazio = lista.querySelectorAll(".item-carrinho").length === 0;
    document.querySelector("[data-carrinho-cheio]")?.style.setProperty("display", vazio ? "none" : "");
    document.querySelector("[data-carrinho-vazio]")?.style.setProperty("display", vazio ? "block" : "none");
  };

  lista.addEventListener("quantidade-alterada", atualizarTotais);

  lista.querySelectorAll(".remover-item").forEach((botao) => {
    botao.addEventListener("click", () => {
      botao.closest(".item-carrinho").remove();
      atualizarTotais();
      mostrarAviso("Item removido do carrinho.");
    });
  });

  atualizarTotais();
}

/* ---------- Alternar forma de pagamento ---------- */
function formaDePagamento() {
  const opcoes = document.querySelectorAll("[name='forma-pagamento']");
  if (!opcoes.length) return;
  const paineis = document.querySelectorAll(".painel-pagamento");
  const mostrarPainel = (valor) => {
    paineis.forEach((p) => p.setAttribute("data-ativo", String(p.dataset.pagamento === valor)));
  };
  opcoes.forEach((opcao) => opcao.addEventListener("change", () => mostrarPainel(opcao.value)));
  const marcada = document.querySelector("[name='forma-pagamento']:checked");
  if (marcada) mostrarPainel(marcada.value);
}

/* ---------- Copiar código de rastreio ---------- */
function copiarCodigoRastreio() {
  const botao = document.querySelector("[data-acao='copiar-codigo']");
  if (!botao) return;
  botao.addEventListener("click", async () => {
    const codigo = document.querySelector("[data-codigo-rastreio]")?.textContent.trim();
    try {
      await navigator.clipboard.writeText(codigo);
      mostrarAviso("Código copiado!");
    } catch {
      mostrarAviso("Não foi possível copiar o código.");
    }
  });
}

/* ---------- Abrir formulário de troca/devolução ---------- */
function abrirFormularioSolicitacao() {
  document.querySelectorAll(".opcao-solicitacao").forEach((opcao) => {
    opcao.addEventListener("click", () => {
      const alvoId = opcao.getAttribute("data-abre");
      const formulario = document.getElementById(alvoId);
      if (!formulario) return;
      const jaAberto = formulario.getAttribute("data-aberto") === "true";
      document.querySelectorAll(".formulario-solicitacao").forEach((f) => f.setAttribute("data-aberto", "false"));
      formulario.setAttribute("data-aberto", String(!jaAberto));
      if (!jaAberto) formulario.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  document.querySelectorAll(".formulario-solicitacao").forEach((formulario) => {
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      formulario.setAttribute("data-aberto", "false");
      mostrarAviso("Solicitação enviada com sucesso!");
    });
  });
}

/* ---------- Página do produto: mostra o item clicado (?id=...) ---------- */
function carregarProduto() {
  const detalhe = document.querySelector(".grade-produto-detalhe");
  if (!detalhe || typeof PRODUTOS === "undefined") return;
  const id = new URLSearchParams(location.search).get("id");
  const produto = PRODUTOS.find((p) => p.id === id) || PRODUTOS[0];
  const fotos = (produto.fotos.length ? produto.fotos : [""]).map((f) => caminhoFoto(f, true));
  while (fotos.length < 2) fotos.push(fotos[0]); // mesma grade do Terceirão: sempre 2 miniaturas

  detalhe.dataset.produtoId = produto.id;
  document.title = `${produto.nome} — SE7E`;
  detalhe.querySelector("h1").textContent = produto.nome;
  detalhe.querySelector(".preco-detalhe").textContent = formatarMoeda(produto.preco);
  detalhe.querySelector(".descricao-produto").textContent = produto.descricao;
  const trilha = document.querySelector(".trilha span");
  if (trilha) trilha.textContent = produto.nome;
  const cor = detalhe.querySelector(".bloco-selecao span");
  if (cor) cor.textContent = "Cor: " + produto.cor;

  const principal = detalhe.querySelector(".imagem-principal .foto");
  principal.src = fotos[0];
  principal.alt = produto.nome;

  const lista = detalhe.querySelector(".lista-miniaturas");
  const reserva = lista.querySelector(".icone-reserva").outerHTML;
  lista.innerHTML = fotos.map((f, i) => `
    <button ${i === 0 ? 'aria-current="true"' : ""} aria-label="Ver foto ${i + 1}" data-imagem="${f}">
      <img class="foto" src="${f}" alt="${produto.nome} - foto ${i + 1}">${reserva}
    </button>`).join("");
}

/* ---------- Login / cadastro (simulado, sem banco de dados) ---------- */
function acessoLogin() {
  const entrar = document.querySelector('form[data-painel-acesso="entrar"]');
  const cadastrar = document.querySelector('form[data-painel-acesso="cadastrar"]');
  if (!entrar || !cadastrar) return;
  const concluir = (perfil, nome, destino) => {
    sessionStorage.setItem("se7e-perfil", perfil);
    sessionStorage.setItem("se7e-boasvindas", nome);
    sessionStorage.setItem("se7e-nome", nome);
    location.href = destino;
  };
  entrar.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = entrar.email.value.trim(), senha = entrar.senha.value;
    if (usuario.toLowerCase() === "admin") {
      if (senha !== "admin") return mostrarAviso("Usuário ou senha inválidos.");
      return concluir("admin", "Administrador", "admin.html");
    }
    if (!/^\S+@\S+\.\S+$/.test(usuario)) return mostrarAviso("Informe um e-mail válido.");
    concluir("cliente", usuario.split("@")[0], "../index.html");
  });
  cadastrar.addEventListener("submit", (e) => {
    e.preventDefault();
    if (cadastrar.senha.value.length < 8) return mostrarAviso("A senha precisa ter no mínimo 8 caracteres.");
    concluir("cliente", cadastrar.nome.value.trim().split(" ")[0], "../index.html");
  });
}

/* Boas-vindas na loja e atalho do ícone "Minha conta" para o admin logado */
function atalhosConta() {
  const nome = sessionStorage.getItem("se7e-boasvindas");
  if (nome && !document.querySelector("[data-painel-acesso]")) {
    sessionStorage.removeItem("se7e-boasvindas");
    mostrarAviso(`Bem-vindo(a), ${nome}!`);
  }
  if (sessionStorage.getItem("se7e-perfil") === "admin") {
    const destino = location.pathname.includes("/pages/") ? "admin.html" : "pages/admin.html";
    document.querySelectorAll('a[aria-label="Minha conta"]').forEach((a) => (a.href = destino));
  }
}

/* ================= Loja ligada aos dados dos produtos ================= */
const ICONE_RESERVA = '<svg class="icone icone-reserva" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
const svgIcone = (d, classe = "icone icone-pequeno") => `<svg class="${classe}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fotoDe = (p) => caminhoFoto(p.fotos[0] || "", location.pathname.includes("/pages/"));
const miniatura = (p) => `<div class="miniatura-produto"><img class="foto" src="${esc(fotoDe(p))}" alt="${esc(p.nome)}">${ICONE_RESERVA}</div>`;

function atualizarContador() {
  const total = lerCarrinho().reduce((s, i) => s + i.qtd, 0);
  document.querySelectorAll(".contador-carrinho").forEach((el) => (el.textContent = total));
}

function renderizarLoja() {
  if (typeof PRODUTOS === "undefined") return;
  atualizarContador();
  renderizarHome();
  renderizarCarrinho();
  renderizarResumo();
  renderizarListaResumo();
  renderizarTroca();
}

/* Home: cards e filtro de categorias vêm de PRODUTOS */
function renderizarHome() {
  const grade = document.querySelector("[data-grade-produtos]");
  if (!grade) return;
  const favorito = grade.querySelector(".botao-favorito")?.innerHTML || "";
  const desenhar = (categoria) => {
    const lista = PRODUTOS.filter((p) => categoria === "Todos" || p.categoria === categoria);
    grade.innerHTML = lista.map((p) => `
      <a href="pages/produto.html?id=${p.id}" class="cartao-produto">
        <button class="botao-favorito" aria-label="Favoritar ${esc(p.nome)}">${favorito}</button>
        ${miniatura(p)}
        <div class="info-produto-cartao"><h3>${esc(p.nome)}</h3><span class="preco">${formatarMoeda(p.preco)}</span></div>
      </a>`).join("") || "<p>Nenhum produto nesta categoria.</p>";
  };
  desenhar("Todos");
  const pilulas = document.querySelectorAll("#destaques .pilula-categoria");
  pilulas.forEach((pilula) => pilula.addEventListener("click", () => {
    pilulas.forEach((x) => x.setAttribute("aria-current", "false"));
    pilula.setAttribute("aria-current", "true");
    desenhar(pilula.textContent.trim());
    fotosComReserva();
    botaoFavorito();
  }));
}

/* Carrinho: itens reais, quantidades e remoção salvas */
function renderizarCarrinho() {
  const lista = document.querySelector("[data-lista-carrinho]");
  if (!lista) return;
  lista.innerHTML = itensDetalhados(lerCarrinho()).map(({ produto: p, tamanho, qtd }) => `
    <div class="item-carrinho" data-preco="${p.preco}" data-id="${p.id}" data-tam="${esc(tamanho)}">
      ${miniatura(p)}
      <div>
        <h3>${esc(p.nome)}</h3>
        <span class="variacao">${esc(p.cor)} | ${esc(tamanho)}</span>
        <div class="mt-1"><span class="preco subtotal-item">${formatarMoeda(p.preco * qtd)}</span></div>
      </div>
      <div class="seletor-quantidade" data-max="${Math.min(10, Math.max(p.estoque, 1))}">
        <button type="button" data-quantidade="diminuir" aria-label="Diminuir quantidade">${svgIcone("M5 12h14")}</button>
        <input type="text" value="${qtd}" inputmode="numeric" aria-label="Quantidade" />
        <button type="button" data-quantidade="aumentar" aria-label="Aumentar quantidade">${svgIcone("M12 5v14M5 12h14")}</button>
      </div>
      <button class="remover-item" aria-label="Remover ${esc(p.nome)} do carrinho">${svgIcone("M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6", "icone")}</button>
    </div>`).join("");
  const sincronizar = () => {
    gravarCarrinho([...lista.querySelectorAll(".item-carrinho")].map((el) => ({
      id: el.dataset.id, tamanho: el.dataset.tam,
      qtd: Number(el.querySelector(".seletor-quantidade input").value) || 1,
    })));
    atualizarContador();
  };
  lista.addEventListener("quantidade-alterada", () => setTimeout(sincronizar, 0));
  lista.addEventListener("click", (e) => { if (e.target.closest(".remover-item")) setTimeout(sincronizar, 0); });
}

/* Entrega e pagamento: resumo do pedido com frete escolhido */
function renderizarResumo() {
  const elItens = document.querySelector("[data-r-itens]");
  if (!elItens) return;
  const { qtd, subtotal } = totaisCarrinho();
  const radios = document.querySelectorAll("input[name='frete']");
  const guardado = sessionStorage.getItem("se7e-frete");
  if (radios.length) {
    radios.forEach((r) => { if (guardado !== null && Number(r.value) === Number(guardado)) r.checked = true; });
  }
  const freteAtual = () => {
    if (!qtd) return 0;
    const marcado = document.querySelector("input[name='frete']:checked");
    return marcado ? Number(marcado.value) : Number(guardado ?? 12.9);
  };
  const pintar = () => {
    const frete = freteAtual();
    elItens.textContent = qtd;
    document.querySelector("[data-r-subtotal]").textContent = formatarMoeda(subtotal);
    document.querySelector("[data-r-frete]").textContent = formatarMoeda(frete);
    document.querySelector("[data-r-total]").textContent = formatarMoeda(subtotal + frete);
  };
  radios.forEach((r) => r.addEventListener("change", () => { sessionStorage.setItem("se7e-frete", r.value); pintar(); }));
  pintar();
}

/* Pagamento e confirmação: lista de itens do pedido */
function renderizarListaResumo() {
  const alvo = document.querySelector("[data-lista-resumo]");
  if (!alvo) return;
  const pedido = lerJSON(CHAVE_PEDIDO, null);
  const usarPedido = location.pathname.endsWith("confirmacao.html") && pedido;
  alvo.innerHTML = itensDetalhados(usarPedido ? pedido.itens : lerCarrinho()).map(({ produto: p, tamanho, qtd }) => `
    <div class="item-resumo-mini ${alvo.dataset.listaResumo || ""}">
      ${miniatura(p)}
      <div><strong>${esc(p.nome)}</strong><span>${esc(p.cor)} | ${esc(tamanho)} × ${qtd}</span></div>
      <span class="preco">${formatarMoeda(p.preco * qtd)}</span>
    </div>`).join("");
}

/* Ao finalizar: registra o pedido (aparece no admin), baixa o estoque e esvazia o carrinho */
function finalizarPedido() {
  if (!location.pathname.endsWith("pagamento.html")) return;
  const botao = document.querySelector('a[href$="confirmacao.html"]');
  if (!botao) return;
  botao.addEventListener("click", () => {
    const itens = lerCarrinho();
    if (!itens.length) return;
    const frete = Number(sessionStorage.getItem("se7e-frete") ?? 12.9);
    const pedidos = lerJSON("se7e-pedidos", []);
    const pedido = {
      codigo: "#SE7E" + (12346 + pedidos.length), cliente: sessionStorage.getItem("se7e-nome") || "Cliente",
      itens, total: totaisCarrinho(itens).subtotal + frete,
    };
    pedidos.push(pedido);
    gravarJSON("se7e-pedidos", pedidos);
    gravarJSON(CHAVE_PEDIDO, pedido);
    itens.forEach((i) => { const p = PRODUTOS.find((x) => x.id === i.id); if (p) p.estoque = Math.max(0, p.estoque - i.qtd); });
    salvarProdutos();
    gravarCarrinho([]);
  });
}

/* Troca/devolução: pedidos com os produtos reais */
function renderizarTroca() {
  const selects = [...document.querySelectorAll("select")].filter((s) => [...s.options].some((o) => o.text.includes("#SE7E")));
  if (!selects.length) return;
  const pedido = lerJSON(CHAVE_PEDIDO, null);
  const opcoes = pedido
    ? itensDetalhados(pedido.itens).map((i) => `${pedido.codigo} — ${i.produto.nome}`)
    : PRODUTOS.slice(0, 2).map((p, k) => `#SE7E${12345 - k} — ${p.nome}`);
  selects.forEach((s) => (s.innerHTML = opcoes.map((o) => `<option>${esc(o)}</option>`).join("")));
}

/* Contato */
function formularioContato() {
  const form = document.querySelector("[data-form-contato]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
    mostrarAviso("Mensagem enviada! Responderemos em breve.");
  });
}
