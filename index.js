import { getComida } from "./request.js";

//INDEX
async function mostrarComida(nombreAlimento) {
  const containerAlimentos = document.getElementsByClassName("comidas")[0];

  // Eliminar contenido existente
  while (containerAlimentos.firstChild) {
    containerAlimentos.removeChild(containerAlimentos.firstChild);
  }

  const alimentos = await getComida(nombreAlimento);
  const listaAlimentos = alimentos.foods;

  listaAlimentos.forEach((alimento) => {
    añadirComida(alimento);
  });
}

function añadirComida(alimento) {
  const containerAlimentos = document.getElementsByClassName("comidas")[0];
  const gramos = 100;

  const nombre = alimento.description;
  const calorias = alimento.foodNutrients.find(
    (nutriente) => nutriente.nutrientName === "Energy"
  ); // Buscar calorías

  const comida = document.createElement("div");
  comida.classList.add("div-comida");
  comida.innerHTML = `<p>${nombre}</p> <p>${
    calorias ? calorias.value : "No disponible"
  } kcal <br> ${gramos} g </p>`;

  containerAlimentos.appendChild(comida);
}

const btnBuscar = document.getElementsByClassName("btn-buscar")[0];
btnBuscar.addEventListener("click", () => {
  const input = document.getElementsByClassName("buscador")[0];
  const nombreAlimento = input.value;

  const explorarH2 = document.getElementsByClassName("explorar")[0];
  if (explorarH2) explorarH2.remove();

  mostrarComida(nombreAlimento);
});
