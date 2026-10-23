
const body = document.body;

const botaoTema = document.getElementById("botao-tema");
const botaoMenu = document.getElementById("botao-menu");
const listaNavegacao = document.getElementById("lista-navegacao");
const botaoTopo = document.getElementById("botao-topo");
const anoAtual = document.getElementById("ano-atual");

const movimentoReduzido = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// TEMA CLARO E ESCURO
let tema = "escuro";

try {
  const temaSalvo = localStorage.getItem("tema-portfolio");

  if (temaSalvo === "claro" || temaSalvo === "escuro") {
    tema = temaSalvo;
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    tema = "claro";
  }
} catch (erro) {
  // O site continua funcionando mesmo se o armazenamento estiver bloqueado.
}

function aplicarTema() {
  body.classList.toggle("claro", tema === "claro");

  if (botaoTema) {
    botaoTema.innerHTML = tema === "claro"
      ? '<i class="bi bi-moon-stars-fill"></i>'
      : '<i class="bi bi-sun-fill"></i>';

    botaoTema.setAttribute(
      "aria-label",
      tema === "claro" ? "Ativar tema escuro" : "Ativar tema claro"
    );
  }

  const metaTema = document.querySelector('meta[name="theme-color"]');

  if (metaTema) {
    metaTema.content = tema === "claro" ? "#f7f7fc" : "#0c0d16";
  }
}

aplicarTema();

if (botaoTema) {
  botaoTema.addEventListener("click", () => {
    tema = tema === "escuro" ? "claro" : "escuro";
    aplicarTema();

    try {
      localStorage.setItem("tema-portfolio", tema);
    } catch (erro) {
      // A troca de tema continua funcionando.
    }
  });
}

// MENU PARA CELULAR
function fecharMenu() {
  if (!botaoMenu || !listaNavegacao) return;

  listaNavegacao.classList.remove("aberto");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu");
  botaoMenu.innerHTML = '<i class="bi bi-list"></i>';
}

if (botaoMenu && listaNavegacao) {
  botaoMenu.addEventListener("click", () => {
    const aberto = listaNavegacao.classList.toggle("aberto");

    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.setAttribute(
      "aria-label",
      aberto ? "Fechar menu" : "Abrir menu"
    );

    botaoMenu.innerHTML = aberto
      ? '<i class="bi bi-x-lg"></i>'
      : '<i class="bi bi-list"></i>';
  });

  listaNavegacao.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") fecharMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 680) fecharMenu();
  });
}

// ANIMAÇÕES
// O conteúdo só fica oculto depois que este script está funcionando.
// Assim, se o arquivo JS não carregar, as seções continuam aparecendo.
const elementosAnimados = document.querySelectorAll(".animar-entrada");

if (
  !movimentoReduzido &&
  "IntersectionObserver" in window &&
  elementosAnimados.length > 0
) {
  body.classList.add("js-enabled");

  const observador = new IntersectionObserver(
    (entradas, observadorAtual) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observadorAtual.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elementosAnimados.forEach((elemento) => {
    observador.observe(elemento);
  });
} else {
  elementosAnimados.forEach((elemento) => {
    elemento.classList.add("visivel");
  });
}

// BOTÃO VOLTAR AO TOPO
function atualizarBotaoTopo() {
  if (botaoTopo) {
    botaoTopo.classList.toggle("visivel", window.scrollY > 350);
  }
}

window.addEventListener("scroll", atualizarBotaoTopo, { passive: true });
atualizarBotaoTopo();

if (botaoTopo) {
  botaoTopo.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: movimentoReduzido ? "auto" : "smooth"
    });
  });
}

// ANO AUTOMÁTICO NO RODAPÉ
if (anoAtual) {
  anoAtual.textContent = new Date().getFullYear();
}
