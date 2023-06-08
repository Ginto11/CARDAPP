import Solicitud from "../model/Solicitud.js";
let $body = document.body;
const usuarioLogeado = JSON.parse(sessionStorage.usuarioLogeado);

document.addEventListener("DOMContentLoaded", e => {
    
    $body.querySelector("#bienvenida").textContent = `BIENVENIDO ${cortarNombre(usuarioLogeado.nombre).toUpperCase()}`
    
    if(e.target.querySelector(".formulario-solicitud")){
        let fechaActual = new Date();
        e.target.querySelector(".formulario-solicitud").nombre_completo.value = `${usuarioLogeado.nombre} ${usuarioLogeado.apellido}`
        e.target.querySelector(".formulario-solicitud").identificacion.value = `${usuarioLogeado.identificacion}`
        e.target.querySelector(".formulario-solicitud").fecha_solicitud.value = `${fechaActual.getDate()}/${fechaActual.getMonth()}/${fechaActual.getFullYear()}`;
    }

    if(e.target.querySelector(".btn-solicitar-producto")){
        e.target.querySelector(".btn-solicitar-producto").addEventListener("click", e => {
            e.preventDefault();
            let $formulario = e.target.parentElement;       
            usuarioLogeado.solicitudes.push(crearSolicitud($formulario));
        })
    }
});

document.querySelector(".btn-cerrar-sesion").addEventListener("click", e => {
    localStorage.setItem(usuarioLogeado.usuario, JSON.stringify(usuarioLogeado));
    sessionStorage.clear();
});

function cortarNombre(nombre){
    let lista = ""
    for(let i = 0; i < nombre.length; i++){
        if(nombre[i] == " "){
            return lista;
        } else {
            lista += nombre[i];
        }
    }
    return lista;
}


function crearSolicitud(formulario){
    const solicitud = new Solicitud(
        formulario.tipo_producto.value, 
        formulario.fecha_solicitud.value, 
        formulario.cupo_producto.value, 
        formulario.entidad.value);
    
    return solicitud;
}