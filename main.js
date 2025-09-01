let colores = Array.from(document.querySelectorAll(".container__color"));
let generar = document.querySelector("#generar");
let modal = document.querySelector(".modal");
let modalCerrar = document.querySelector(".modal__cerrar");
let botonHexadecimal = document.querySelector(".modal__hexadecimal");
let botonRgb = document.querySelector(".modal__rgb");

let colorSeleccionado = null;

// Evento para generar nuevos colores
generar.addEventListener("click", posicionarColor);

// Evento para cerrar el modal
modalCerrar.addEventListener("click", () => {
  modal.style.display = "none";
});

// Evento para cada botón "Copiar"
colores.forEach((color) => {
  let botonCopia = color.querySelector(".container__copia");
  botonCopia.addEventListener("click", () => {
    colorSeleccionado = color;
    modal.style.display = "flex";
  });
});

// Eventos del modal para copiar Hex o RGB
botonHexadecimal.onclick = () => {
  if (colorSeleccionado) {
    let hex = colorSeleccionado.querySelector(
      ".container__hexadecimal"
    ).textContent;
    navigator.clipboard.writeText(hex);
    alert("Copiado hexadecimal");
    modal.style.display = "none";
  }
};

botonRgb.onclick = () => {
  if (colorSeleccionado) {
    let rgb = colorSeleccionado.querySelector(".container__rgb").textContent;
    navigator.clipboard.writeText(rgb);
    alert("Copiado RGB");
    modal.style.display = "none";
  }
};

// Función que genera y asigna colores a los bloques
function posicionarColor() {
  colores.forEach((color) => {
    let colorGenerado = generarColores();
    let hex = `#${colorGenerado}`;
    let rgb = hexadecimalARGB(colorGenerado);

    color.querySelector(".container__hexadecimal").textContent = hex;
    color.querySelector(".container__rgb").textContent = rgb;
    color.style.backgroundColor = hex;
  });
}

// Función que genera colores hexadecimales aleatorios
function generarColores() {
  let letras = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += letras[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Función que convierte de HEX a RGB
function hexadecimalARGB(hex) {
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  return `RGB(${r}, ${g}, ${b})`;
}

// Generar colores al cargar la página
posicionarColor();
