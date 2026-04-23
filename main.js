const grid        = document.getElementById("grid");
const btnGenerar  = document.getElementById("generar");
const modal       = document.getElementById("modal");
const modalCerrar = document.getElementById("modalCerrar");
const modalColor  = document.getElementById("modalColor");
const modalPreview= document.getElementById("modalPreview");
const btnHex      = document.getElementById("botonHexadecimal");
const btnRgb      = document.getElementById("botonRgb");
const toast       = document.getElementById("toast");

const TOTAL = 6;
let colorSeleccionado = null;

function hexRandom() {
  return Array.from({ length: 6 }, () =>
    "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
  ).join("");
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `RGB(${r}, ${g}, ${b})`;
}

function getLuminancia(hex) {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function crearTarjetas() {
  grid.innerHTML = "";
  for (let i = 0; i < TOTAL; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = i;

    card.innerHTML = `
      <span class="card__num">${String(i + 1).padStart(2, "0")}</span>
      <button class="card__copiar">copiar</button>
      <div class="card__info">
        <span class="card__hex"></span>
        <span class="card__rgb"></span>
      </div>
    `;

    card.querySelector(".card__copiar").addEventListener("click", () => {
      colorSeleccionado = card;
      abrirModal(card);
    });

    grid.appendChild(card);
  }
}

function posicionarColores() {
  const cards = grid.querySelectorAll(".card");
  cards.forEach((card) => {
    const hex = hexRandom();
    const hexa = `#${hex}`;
    const rgb  = hexToRgb(hex);
    const lum  = getLuminancia(hex);

    card.style.backgroundColor = hexa;
    card.style.transition = "background-color 0.5s ease";
    card.querySelector(".card__hex").textContent = hexa;
    card.querySelector(".card__rgb").textContent = rgb;
    card.dataset.hex = hexa;
    card.dataset.rgb = rgb;

    // Texto claro u oscuro según luminancia
    const textColor = lum > 0.4 ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.85)";
    card.querySelector(".card__num").style.color = lum > 0.4
      ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)";
    card.querySelectorAll(".card__hex, .card__rgb").forEach(el => {
      el.style.color = lum > 0.4 ? "#000" : "#fff";
      el.style.backgroundColor = lum > 0.4
        ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)";
    });
    card.querySelector(".card__copiar").style.color = lum > 0.4 ? "#000" : "#fff";
    card.querySelector(".card__copiar").style.borderColor = lum > 0.4
      ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)";
    card.querySelector(".card__copiar").style.backgroundColor = lum > 0.4
      ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)";
  });
}

function abrirModal(card) {
  const hex = card.dataset.hex;
  modalColor.textContent = hex;
  modalPreview.style.backgroundColor = hex;
  modal.classList.add("open");
}

function cerrarModal() {
  modal.classList.remove("open");
}

let toastTimeout;
function mostrarToast(msg) {
  toast.textContent = msg;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 2200);
}

async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto);
  } catch {
    // fallback
    const el = document.createElement("textarea");
    el.value = texto;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

btnGenerar.addEventListener("click", posicionarColores);

modalCerrar.addEventListener("click", cerrarModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) cerrarModal();
});

btnHex.addEventListener("click", async () => {
  if (!colorSeleccionado) return;
  await copiar(colorSeleccionado.dataset.hex);
  cerrarModal();
  mostrarToast(`${colorSeleccionado.dataset.hex} copiado`);
});

btnRgb.addEventListener("click", async () => {
  if (!colorSeleccionado) return;
  await copiar(colorSeleccionado.dataset.rgb);
  cerrarModal();
  mostrarToast(`${colorSeleccionado.dataset.rgb} copiado`);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModal();
  if (e.key === " " || e.key === "Enter" && document.activeElement === document.body) {
    posicionarColores();
  }
});

crearTarjetas();
posicionarColores();
