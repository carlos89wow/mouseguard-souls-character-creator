const botonesDados = document.querySelectorAll(".btn-dado");
const resultadoDado = document.getElementById("resultadoDado");
const tipoDado = document.getElementById("tipoDado");
const dadoAnimado = document.getElementById("dadoAnimado");

botonesDados.forEach((boton) => {
  boton.addEventListener("click", () => {
    const dado = boton.dataset.dado;
    tirarDado(dado);
  });
});

async function tirarDado(dado) {
  try {
    tipoDado.textContent = `Tirando ${dado.toUpperCase()}...`;
    resultadoDado.textContent = "Calculando resultado...";
    dadoAnimado.classList.add("girando");

    const respuesta = await fetch(`https://rolz.org/api/?${dado}.json`);
    const datos = await respuesta.json();

    setTimeout(() => {
      dadoAnimado.classList.remove("girando");
      tipoDado.textContent = `Resultado de ${dado.toUpperCase()}`;
      resultadoDado.textContent = datos.result;
    }, 800);

  } catch (error) {
    dadoAnimado.classList.remove("girando");
    tipoDado.textContent = "Error";
    resultadoDado.textContent = "No se pudo realizar la tirada.";
    console.error(error);
  }
}