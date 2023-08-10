async function getData() {
  try {
    const response = await fetch("https://mindicador.cl/api");
    const data = await response.json();

    return data;
  } catch (e) {
    document.querySelector("#result").innerHTML =
      "Error al obtener datos desde mindicador.cl";

    return;
  }
}

var chart = null;

async function printMonedas() {
  data = await getData();

  select = document.getElementById("cur");

  console.log(data);
  // data = Object.keys(data)

  console.log(data);

  option = "";
  for (const key in data) {
    if (typeof data[key] === "object") {
      option += `<option value="${data[key].valor}">${data[key].codigo}</option>`;
    }
  }

  select.innerHTML = option;
}

async function grafico(moneda = "dolar") {
  data = await getData();

  let labels = [];

  // for (const key in data) {
  //   if (typeof data[key] === "object") {
  //     labels.push(data[key].codigo)
  //   }
  // }

  let datasets = [];

  let fecha = new Date();
  // subsctract 10 days
  fecha.setDate(fecha.getDate() - 10);

  for (let i = 0; i < 10; i++) {
    fecha.setDate(fecha.getDate() + 1);
    // get date in dd-mm-yyyy format
    let fechaString = fecha.toLocaleDateString("es-CL");

    var data = null;
    try {
      data = await fetch(
        `https://mindicador.cl/api/${moneda}/${fechaString}`
      );
      data = await data.json();
    } catch (e) {
      document.querySelector("#result").innerHTML =
      "Error al obtener datos desde mindicador.cl";

      return;
    }

    if (data.serie.length == 1) {
      labels.push(fechaString);
      datasets.push(data.serie[0].valor);
    } else {
      labels.push(fechaString);
      // Poner dato falso porque no llego información
      datasets.push(datasets[datasets.length - 1]);
    }
  }

  // configuracion de grafico
  const config = {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: moneda,
          data: datasets,
        },
      ],
    },
  };

  // si el grafico ya existe hay que destruirlo para poder volver a crearlo
  if (chart) {
    chart.destroy();
  }

  const myChart = document.getElementById("myChart");
  myChart.style.backgroundColor = "white";
  chart = new Chart(myChart, config);
}

buscar = document.querySelector("#buscar");
buscar.addEventListener("click", function () {
  res = document.querySelector("#result");

  valor = document.querySelector("#cur").value;
  cantidad = document.querySelector("#clp").value;

  res.innerHTML = "Resultado : " + cantidad / valor;

  // obtener el nombre de la moneda seleccionada
  const moneda = document.getElementById('cur');

  // se obtiene el indice seleccionado para obtener la moneda
  const text = moneda.options[moneda.selectedIndex].innerHTML;
  grafico(text);
});

printMonedas();
grafico();
