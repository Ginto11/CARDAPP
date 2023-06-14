import Tarjeta from "../model/Tarjeta.js";
export default function getAxios(url, selector, cantidad) {
    axios
      .get(url)
      .then((res) => {
        let lista = "";
        let contador = cantidad ? res.data.length : 2;
        res.data.forEach((data) => {
          if (contador === 0) {
            return;
          }
  
          lista += new Tarjeta(
            data.color1,
            data.color2,
            data.tipo,
            data.numeroCuenta,
            data.nombreUsuario
          ).crearTarjeta();
  
          contador--;
        });
        document.querySelector(selector).innerHTML = lista;
      })
      .catch((res) => console.log("Error: " + res));
}

export function mostrarTarjetaSolicitada(selector, tipoTarjeta, empleado, cupo){
    
    let solicitudes = JSON.parse(localStorage.getItem("solicitudes"));

    axios("../assets/data.json")
        .then(res => {
            res.data.forEach(tarjeta => {
                if(tarjeta.tipo == tipoTarjeta){
                    
                    const tarjetaSolicitada = new Tarjeta(tarjeta.color1, tarjeta.color2, tipoTarjeta, empleado.nombre, cupo, empleado.id);
                    
                    solicitudes.push(tarjetaSolicitada);
                    
                    localStorage.setItem("solicitudes", JSON.stringify(solicitudes));

                    document.querySelector(selector).innerHTML = tarjetaSolicitada.crearTarjeta();
                    console.log("Gola")
                    alert(`Su tarjeta Nº: ${tarjetaSolicitada.numeroTarjeta}, llegará a su dirección.`);
                }
            })
        })
        .catch(err => console.log(err));
}
