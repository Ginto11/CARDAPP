import registrarUsuario from "./registro.js";
import iniciarSesion from "./iniciar-sesion.js";
import Tarjeta from "../model/Tarjeta.js";

document.addEventListener("DOMContentLoaded", (e) => {
  cargarAdmin();
  if (e.target.querySelector(".contenedor-tarjeta")) {
    getAxios("./assets/data.json", ".contenedor-tarjeta", false);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.matches("#registrarse")) {
    e.preventDefault();
    registrarUsuario(e.target.parentElement);
  }

  if (e.target.matches("#iniciar-sesion")) {
    e.preventDefault();
    iniciarSesion(e.target.parentElement);
  }
});

function getAxios(url, selector, cantidad) {
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

function cargarAdmin(){
  const adminUser = {
    usuario: "admin",
    nombre: "Nelson Andres",
    apellido: "Muñoz Salinas",
    identificacion: 1001345679,
    email: "empresanvs@gmail.com",
    password: "admin",
    rol: "admin"
  }

  if(localStorage.getItem("admin") == null){
    localStorage.setItem(adminUser.usuario, JSON.stringify(adminUser));
  } 
}