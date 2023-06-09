import Solicitud from "../model/Solicitud.js";
let $body = document.body;
const usuarioLogeado = JSON.parse(sessionStorage.usuarioLogeado);

document.addEventListener("DOMContentLoaded", e => {
    
    $body.querySelector("#bienvenida").textContent = `BIENVENIDO ${cortarNombre(usuarioLogeado.nombre).toUpperCase()}`
    buscar("../assets/empleados.json", guardarEmpleados)

});

document.addEventListener("click", e => {
    if(e.target.matches(".btn-cerrar-sesion")){
        localStorage.setItem(usuarioLogeado.usuario, JSON.stringify(usuarioLogeado));
        sessionStorage.clear();
    }

    if(e.target.parentElement.matches(".links-header-administrador")){
        const sectionsAdminitrador = document.querySelectorAll(".sections-administrador");
        console.log(sectionsAdminitrador)
        e.preventDefault();

        if(e.target.matches(".agregar-empleado")){
            mostrarSection("agregar-empleado", sectionsAdminitrador, "flex");
        }

        if(e.target.matches(".lista-empleados")){
            buscar("../assets/empleados.json", mostrarEmpleados);
            mostrarSection("lista-empleados", sectionsAdminitrador, "flex");
        }
    }
})

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

function mostrarSection(id, lista, propiedad){
    lista.forEach(elemento => {
        if(elemento.id == id){
            elemento.style.display = propiedad;
        } else {
            elemento.style.display = "none"
        }
    })
}

function buscar(ruta, funcion){
    axios(ruta)
        .then(res => funcion(res.data));
}

function mostrarEmpleados(res){
    let lista = "";
    res.forEach(elemento => {
        lista += `
            <tr>
                <td>${elemento.nombre}</td>
                <td>${elemento.correoCorporativo}</td>
                <td>${elemento.telefono}</td>
                <td>${elemento.cargo}</td>
                <td>${elemento.jefeInmediato}</td>
                <td>${elemento.pais}</td>
                <td>${(elemento.estado) ? "Activo" : "Inactivo"}</td>
            </tr>
        `
    })

    document.querySelector("tbody").innerHTML = lista;
}

function guardarEmpleados(data){
    localStorage.setItem("empleados", JSON.stringify(data))
}