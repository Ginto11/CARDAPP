import registrarUsuario from "./registro.js";
import iniciarSesion from "./iniciar-sesion.js";
import getAxios from "./axios.js";

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