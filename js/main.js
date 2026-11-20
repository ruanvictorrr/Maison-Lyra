// Maison Lyra Beauty
const WA = "5581983559460";

// Topbar: borda ao rolar
const topbar = document.getElementById("topbar");
const onScroll = () => topbar.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Menu mobile
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const setMenu = (open) => {
  menu.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
};
menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// Reveal ao rolar
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

// Descubra seu tom
const LABEL_BASE = {
  "natural-escuro": "castanho/preto natural",
  "tinta-escura": "com tinta escura",
  "ja-clareado": "já com mechas/loiro",
};
const LABEL_GOAL = { loiro: "loiro", iluminado: "morena iluminada", ruivo: "ruivo" };

const PLANS = {
  loiro: {
    "natural-escuro": { t: "Mechas para loiro", d: "Clareamento gradual em mechas finas, com raiz esfumada para o crescimento ficar natural.", m: ["1 a 2 sessões", "Tonalização inclusa", "Retoque a cada 3–4 meses"] },
    "tinta-escura": { t: "Remoção de cor + loiro", d: "Primeiro saímos do pigmento escuro com segurança, depois construímos o loiro em etapas.", m: ["2 ou mais sessões", "Foco em saúde do fio", "Plano personalizado"] },
    "ja-clareado": { t: "Retoque e tonalização", d: "Ajustamos raiz, uniformizamos o tom e devolvemos brilho ao loiro que você já tem.", m: ["1 sessão", "Matização sob medida", "Retoque a cada 6–8 semanas"] },
  },
  iluminado: {
    "natural-escuro": { t: "Morena iluminada", d: "Luz nos pontos certos, em caramelo, mel ou bege, preservando a sua base natural.", m: ["1 sessão", "Raiz natural", "Retoque a cada 4–6 meses"] },
    "tinta-escura": { t: "Do preto de tinta ao iluminado", d: "Remoção do pigmento só onde a luz vai entrar, sem perder o comprimento.", m: ["1 a 2 sessões", "Técnica de correção", "Resultado natural"] },
    "ja-clareado": { t: "Reconstrução da iluminação", d: "Reorganizamos as mechas antigas, escurecemos a raiz e criamos contraste com intenção.", m: ["1 sessão", "Raiz esfumada", "Menos manutenção"] },
  },
  ruivo: {
    "natural-escuro": { t: "Ruivo acobreado", d: "Cor vibrante pensada para o seu tom de pele, do cobre dourado ao cereja.", m: ["1 sessão", "Brilho intenso", "Tonalização a cada 6 semanas"] },
    "tinta-escura": { t: "Correção para ruivo", d: "Clareamos o pigmento escuro o suficiente para o ruivo aparecer vivo e uniforme.", m: ["1 a 2 sessões", "Cor uniforme", "Plano de manutenção"] },
    "ja-clareado": { t: "Ruivo sobre base clara", d: "A base clara deixa o ruivo luminoso. Reforçamos o fio antes de pigmentar.", m: ["1 sessão", "Cor vibrante", "Home care indicado"] },
  },
};

const choice = { base: null, goal: null };
const result = document.getElementById("toneResult");

document.querySelectorAll(".chips").forEach((group) => {
  group.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    group.querySelectorAll(".chip").forEach((c) => {
      c.classList.toggle("is-on", c === chip);
      c.setAttribute("aria-pressed", String(c === chip));
    });
    choice[group.dataset.group] = chip.dataset.value;
    renderTone();
  });
});

function renderTone() {
  if (!choice.base || !choice.goal) return;
  const p = PLANS[choice.goal][choice.base];
  const msg = `Olá, Leonnardo! Fiz o teste no site: meu cabelo está ${LABEL_BASE[choice.base]} e eu quero ${LABEL_GOAL[choice.goal]}. Indicação: ${p.t}. Pode avaliar meu caso?`;
  result.innerHTML = `
    <div class="tone-out">
      <span class="tag">Indicação para você</span>
      <h3>${p.t}</h3>
      <p>${p.d}</p>
      <div class="meta">${p.m.map((x) => `<span>${x}</span>`).join("")}</div>
      <a class="btn btn-dark" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(msg)}">Enviar para o Leonnardo</a>
    </div>`;
}

// Filtro do portfólio
const items = document.querySelectorAll(".g-item");
document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("is-on", b === btn));
    const f = btn.dataset.filter;
    items.forEach((it) => it.classList.toggle("is-hidden", f !== "todos" && it.dataset.cat !== f));
    document.getElementById("gallery").classList.toggle("is-filtered", f !== "todos");
  });
});

// Lightbox
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
items.forEach((it) => {
  it.addEventListener("click", () => {
    const img = it.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = it.dataset.cap || "";
    if (typeof lb.showModal === "function") lb.showModal();
  });
});
document.getElementById("lbClose").addEventListener("click", () => lb.close());
lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
