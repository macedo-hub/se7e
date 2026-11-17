/* ADMIN.JS — interações da área do administrador (sem backend: dados ficam só na tela) */
if (sessionStorage.getItem("se7e-perfil") !== "admin") location.replace("login.html");

document.addEventListener("click", (e) => {
  if (e.target.closest('[aria-label="Sair"], .item-lateral.sair')) sessionStorage.removeItem("se7e-perfil");
});
document.querySelectorAll('button[aria-label="Sair"]').forEach((b) =>
  b.addEventListener("click", () => (location.href = "../index.html")));
document.addEventListener("DOMContentLoaded", () => {
  const pagina = document.querySelector("[data-pagina]")?.dataset.pagina;
  if (typeof PRODUTOS === "undefined") return;
  if (pagina === "catalogo") catalogoAdmin();
  if (pagina === "estoque") estoqueAdmin();
  if (pagina === "painel") painelAdmin();
  if (pagina === "perfil") perfilAdmin();
  if (pagina === "relatorios") relatoriosAdmin();
});

const situacaoEstoque = (q) =>
  q === 0 ? '<span class="selo selo-atencao">Esgotado</span>'
  : q <= 5 ? '<span class="selo selo-atencao">Estoque baixo</span>'
  : '<span class="selo selo-sucesso">Em estoque</span>';

/* RF010 — Manter catálogo (cadastrar / editar / excluir) */
function catalogoAdmin() {
  const corpo = document.querySelector("[data-tabela-catalogo]");
  const form = document.querySelector("[data-form-produto]");
  let editando = null;
  const campo = (id) => document.getElementById("p-" + id);

  const desenhar = () => {
    salvarProdutos();
    corpo.innerHTML = PRODUTOS.map((p) => `
      <tr><td>${p.nome}</td><td>${p.categoria}</td><td>${formatarMoeda(p.preco)}</td><td>${p.estoque}</td>
      <td><button class="botao-icone" data-editar="${p.id}" aria-label="Editar ${p.nome}">✎</button>
          <button class="botao-icone" data-excluir="${p.id}" aria-label="Excluir ${p.nome}">🗑</button></td></tr>`).join("");
  };
  const abrir = (p) => {
    editando = p;
    form.hidden = false;
    form.querySelector("[data-titulo-form]").textContent = p ? "Editar produto" : "Novo produto";
    campo("nome").value = p?.nome ?? ""; campo("preco").value = p?.preco ?? "";
    campo("estoque").value = p?.estoque ?? ""; campo("categoria").value = p?.categoria ?? "Camisetas";
    campo("foto").value = p?.fotos[0] ?? ""; campo("desc").value = p?.descricao ?? "";
    form.scrollIntoView({ behavior: "smooth" });
  };

  document.querySelector("[data-acao='novo-produto']").addEventListener("click", () => abrir(null));
  document.querySelector("[data-acao='restaurar']").addEventListener("click", () => {
    if (confirm("Voltar aos produtos originais?")) { localStorage.removeItem(CHAVE_PRODUTOS); location.reload(); }
  });
  document.querySelector("[data-acao='cancelar-form']").addEventListener("click", () => (form.hidden = true));
  corpo.addEventListener("click", (e) => {
    const ed = e.target.closest("[data-editar]"), ex = e.target.closest("[data-excluir]");
    if (ed) abrir(PRODUTOS.find((p) => p.id === ed.dataset.editar));
    if (ex && confirm("Excluir este produto?")) {
      PRODUTOS.splice(PRODUTOS.findIndex((p) => p.id === ex.dataset.excluir), 1);
      desenhar(); mostrarAviso("Produto excluído.");
    }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = { nome: campo("nome").value.trim(), preco: Number(campo("preco").value),
      estoque: Number(campo("estoque").value), categoria: campo("categoria").value,
      descricao: campo("desc").value.trim(), fotos: [campo("foto").value.trim()].filter(Boolean) };
    if (!dados.nome || dados.preco < 0 || dados.estoque < 0) return mostrarAviso("Preencha os campos obrigatórios.");
    if (editando) Object.assign(editando, dados);
    else PRODUTOS.push({ id: "p" + Date.now(), cor: "—", ...dados });
    form.hidden = true; desenhar();
    mostrarAviso(editando ? "Produto atualizado!" : "Produto cadastrado!");
  });
  desenhar();
}

/* RF011 — Controlar estoque */
function estoqueAdmin() {
  const corpo = document.querySelector("[data-tabela-estoque]");
  const desenhar = () => {
    corpo.innerHTML = PRODUTOS.map((p) => `
      <tr><td>${p.nome}</td><td data-situacao="${p.id}">${situacaoEstoque(p.estoque)}</td>
      <td><input type="number" min="0" value="${p.estoque}" data-qtd="${p.id}" style="width:90px"></td>
      <td><button class="botao botao-secundario" data-salvar="${p.id}">Atualizar</button></td></tr>`).join("");
  };
  corpo.addEventListener("click", (e) => {
    const b = e.target.closest("[data-salvar]"); if (!b) return;
    const p = PRODUTOS.find((x) => x.id === b.dataset.salvar);
    const q = Number(corpo.querySelector(`[data-qtd="${p.id}"]`).value);
    if (!Number.isInteger(q) || q < 0) return mostrarAviso("Quantidade inválida.");
    p.estoque = q;
    salvarProdutos();
    corpo.querySelector(`[data-situacao="${p.id}"]`).innerHTML = situacaoEstoque(q);
    mostrarAviso("Estoque atualizado!");
  });
  desenhar();
}

/* RF012 — Relatórios de vendas (dados de exemplo) */
function relatoriosAdmin() {
  const vendas = [ // [id do produto, unidades, dias atrás]
    ["terceirao", 12, 2], ["matue", 8, 5], ["cargo", 5, 9], ["moletom", 4, 12],
    ["terceirao", 9, 18], ["cargo", 7, 24], ["matue", 6, 27], ["moletom", 3, 45], ["terceirao", 10, 60]].concat(lerJSON("se7e-pedidos", []).flatMap((p) => p.itens.map((i) => [i.id, i.qtd, 0])));
  const select = document.querySelector("[data-filtro-periodo]");
  const desenhar = () => {
    const dias = Number(select.value), total = {};
    vendas.filter((v) => !dias || v[2] <= dias).forEach(([id, un]) => (total[id] = (total[id] || 0) + un));
    const linhas = Object.entries(total).map(([id, un]) => ({ p: PRODUTOS.find((x) => x.id === id), un }))
      .filter((l) => l.p).sort((a, b) => b.un - a.un);
    const valor = linhas.reduce((s, l) => s + l.un * l.p.preco, 0);
    const unidades = linhas.reduce((s, l) => s + l.un, 0);
    document.querySelector("[data-sem-dados]").hidden = linhas.length > 0;
    document.querySelector("[data-resumo-relatorio]").innerHTML = [
      [formatarMoeda(valor), "Total vendido"], [unidades, "Unidades vendidas"], [linhas[0]?.p.nome ?? "—", "Mais vendido"]]
      .map(([v, r]) => `<div class="cartao-estatistica"><div><strong>${v}</strong><span>${r}</span></div></div>`).join("");
    document.querySelector("[data-tabela-relatorio]").innerHTML = linhas.map((l) =>
      `<tr><td>${l.p.nome}</td><td>${l.un}</td><td>${formatarMoeda(l.un * l.p.preco)}</td></tr>`).join("");
  };
  select.addEventListener("change", desenhar);
  desenhar();
}

/* Perfil do administrador + adicionar/remover contas */
function perfilAdmin() {
  const iniciais = (n) => n.split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const contas = [[1, "João Silva"], [2, "Maria Azevedo"], [3, "Carlos Santos"], [4, "Pedro Oliveira"], [5, "Ana Almeida"]];
  const corpo = document.querySelector("[data-tabela-contas]");
  const nomeCampo = document.getElementById("a-nome");

  document.querySelector("[data-form-perfil]").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = nomeCampo.value.trim();
    if (!nome) return mostrarAviso("Informe o nome.");
    document.querySelector("[data-nome-exibido]").textContent = nome;
    document.querySelector("[data-avatar]").textContent = iniciais(nome);
    contas[0][1] = nome; desenhar();
    document.getElementById("a-senha").value = "";
    mostrarAviso("Perfil atualizado!");
  });
  document.querySelector("[data-form-conta]").addEventListener("submit", (e) => {
    e.preventDefault();
    const campo = document.getElementById("c-nome"), nome = campo.value.trim();
    if (!nome) return;
    contas.push([Math.max(...contas.map((c) => c[0])) + 1, nome]);
    campo.value = ""; desenhar(); mostrarAviso("Conta adicionada!");
  });
  corpo.addEventListener("click", (e) => {
    const b = e.target.closest("[data-remover]"); if (!b) return;
    contas.splice(contas.findIndex((c) => c[0] === Number(b.dataset.remover)), 1);
    desenhar(); mostrarAviso("Conta removida.");
  });
  function desenhar() {
    corpo.innerHTML = contas.map(([id, nome]) => `<tr><td>${id}</td><td>${nome}${id === 1 ? " (você)" : ""}</td>
      <td>${id === 1 ? "" : `<button class="botao-icone" data-remover="${id}" aria-label="Remover ${nome}">🗑</button>`}</td></tr>`).join("");
  }
  desenhar();
}

/* Painel: números e vendas recentes vêm dos mesmos dados da loja */
function painelAdmin() {
  const set = (seletor, valor) => (document.querySelector(seletor).textContent = valor);
  const reais = lerJSON("se7e-pedidos", []);
  set("[data-est-total]", PRODUTOS.length);
  set("[data-est-estoque]", PRODUTOS.filter((p) => p.estoque > 0).length);
  set("[data-est-pedidos]", reais.length);
  const achar = (id) => PRODUTOS.find((p) => p.id === id);
  const demo = [
    ["#SE7E12345", "Lucas M.", [["terceirao", 1]], "Entregue", "selo-sucesso"],
    ["#SE7E12344", "Ana S.", [["matue", 1]], "Em transporte", "selo-neutro"],
    ["#SE7E12343", "Carlos R.", [["cargo", 1], ["terceirao", 1]], "Separação", "selo-atencao"],
  ].map(([codigo, cliente, it, status, classe]) => ({
    codigo, cliente, status, classe, itens: it.map(([id, qtd]) => ({ id, qtd })),
    total: it.reduce((s, [id, q]) => s + (achar(id)?.preco ?? 0) * q, 0),
  }));
  const novos = reais.slice().reverse().map((p) => ({ ...p, status: "Separação", classe: "selo-atencao" }));
  document.querySelector("[data-vendas-recentes]").innerHTML = [...novos, ...demo].slice(0, 6).map((p) => `
    <tr><td>${p.codigo}</td><td>${p.cliente}</td>
    <td>${p.itens.map((i) => `${i.qtd}× ${achar(i.id)?.nome ?? "Produto removido"}`).join(", ")}</td>
    <td>${formatarMoeda(p.total)}</td><td><span class="selo ${p.classe}">${p.status}</span></td></tr>`).join("");
}
