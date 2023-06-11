let $body = document.body;
const usuarioLogeado = (buscarEnSesionStorage("usuarioLogeado") === null) ? window.location.href = "../index.html" : JSON.parse(sessionStorage.usuarioLogeado);

document.addEventListener("DOMContentLoaded", e => {
    
    $body.querySelector("#bienvenida").textContent = `BIENVENIDO ${cortarNombre(usuarioLogeado.nombre).toUpperCase()}`

    if(buscarEnLocalStorage("empleados") == null){

        buscar("../assets/empleados.json", guardarEmpleados);

    } else {

        let empleados = buscarEnLocalStorage("empleados");

        mostrarEmpleados(empleados);
    }

});

document.addEventListener("click", e => {
    
    if(e.target.matches(".btn-cerrar-sesion")){

        limpiarSesion();

        guadarLocalStorage();

        window.location.href = "../index.html";

    }

    if(e.target.parentElement.matches(".links-header-administrador")){
        //LISTA DE ELEMENTOS HTML, RESPECTIVAMENTE DE LA SECTIONS
        e.preventDefault();

        if(e.target.matches(".agregar-empleado")){
            mostrarSection("agregar-empleado", buscarPorSelector("class", "sections-administrador", true));
        }

        if(e.target.matches(".lista-empleados")){

            mostrarEmpleados();

            mostrarSection("lista-empleados", buscarPorSelector("class", "sections-administrador", true));

        }

    }
    
    if(e.target.matches(".btn-registrar-empleado")){
        e.preventDefault();
        
        let contenedorInputs = e.target.parentElement.querySelector(".contenedor-inputs");

        let $nombre = contenedorInputs.querySelector("#nombre").value;
        let $cedula = contenedorInputs.querySelector("#cedula").value;
        let $correoInstitucional = contenedorInputs.querySelector("#correoCorporativo").value;
        let $telefono = contenedorInputs.querySelector("#telefono").value;
        let $direccion = contenedorInputs.querySelector("#direccion").value;
        let $cargo = contenedorInputs.querySelector("#cargo").value;
        let $jefeInmediato = contenedorInputs.querySelector("#jefeInmediato").value;
        let $pais = contenedorInputs.querySelector("#pais").value;
        let $terminosYCondiciones = contenedorInputs.querySelector("#terminos-y-condiciones");

        if($nombre === "" || $cedula === "" || $correoInstitucional === "" || $telefono === "" || $direccion === "" || $cargo === "" || $jefeInmediato === "" || $pais === "" || $terminosYCondiciones === ""){
            return alert("Complete todos los campos.");
        }
        
        registrarEmpleado(e.target.parentElement);
        
        guadarLocalStorage();
        
        window.location.reload();
    }

    if(e.target.className == "btn-detalle-empleado"){

        let empleados = buscarEnLocalStorage("empleados");
        
        empleados.forEach(empleado => {

            if(empleado.cedula == e.target.dataset.cedula){
                cargarInfoEmpleado(empleado)
            }
        })
    }

    if(e.target.matches(".btn-regresar")){
        e.preventDefault();
        mostrarSection("lista-empleados", buscarPorSelector("class", "sections-administrador", true));
    }
})

/**
 * FUNCION QUE ME ACORTA EL NOMBRE PARA MOESTRA EL MENSAJE DE BIENVENIDO
 * @param {String} nombre NOMBRE DEL EMPLEADO
 * @returns RETORNA EL NOMBRE RECORTADO
 */
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

/**
 * FUNCION QUE MUESTRA LA SECCION DE ACUERDO AL ID QUE SE LE PASE
 * @param {String} id ES EL SELECTOR DEL ELEMENTO QUE QUEREMOS QUE SE MUESTRE
 * @param {Array} listaSecciones ES LA LISTA DE ELEMENTOS DEL DOM QUE VAMOS A ITERAR PARA MOSTRAR CUANDO SE DE CLICK
 */
function mostrarSection(id, listaSecciones){

    listaSecciones.forEach(elemento => {

        if(elemento.id == id){
            elemento.style.display = "flex";
        } else {
            elemento.style.display = "none"
        }
    })
}

/**
 * FUNCION QUE BUSCA RECURSOS CON AXIOS
 * @param {String} ruta ES LA RUTA O URL EN QUE LA VAMOS A BUSCAR LOS RECURSOS
 * @param {Function} funcion FUNCION MANEJADORA DE LA DATA QUE NOS DEVUELVA AXIOS
 */
function buscar(ruta, funcion){
    axios(ruta)
        .then(res => funcion(res.data))
        .catch(err => console.log(err));
}

/**
 * FUNCION QUE MUESTRA LOS EMPLEADOS EN LA LISTA DE EMPLEADOS
 * @param {Array} res ES UN ARREGLO DE OBJETOS 
 */
function mostrarEmpleados(res){

    (res) ? "" : res = JSON.parse(localStorage.getItem("empleados"))

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
                <td>
                    <img class="btn-detalle-empleado" data-cedula="${elemento.cedula}" title="Detalle usuario: ${cortarNombre(elemento.nombre)}" src="../icons/editar.png" alt="Editar" />
                    <img class="btn-eliminar-empleado" data-cedula="${elemento.cedula}" title="Eliminar usuario: ${cortarNombre(elemento.nombre)}" src="../icons/eliminar.png" alt="Editar" />   
                </td>
            </tr>
        `
    })

    document.querySelector("tbody").innerHTML = lista;
}

/**
 * FUNCION QUE GUARDA LOS EMPLEADOS EN EL LOCALSTORAGE
 * @param {String} data ES UN ARREGLO DE OBJETOS
 */
function guardarEmpleados(data){
    localStorage.setItem("empleados", JSON.stringify(data))
}

/**
 * FUNCION QUE ME REGISTRA UN EMPLEADO EN EL LOCALSTORAGE
 * @param {HTMLElement} formulario 
 */
function registrarEmpleado(formulario){

    let empleado = {
        nombre: formulario.nombre.value,
        cedula: formulario.cedula.value,
        correoCorporativo: formulario.correoCorporativo.value,
        telefono: formulario.telefono.value,
        direccion: formulario.direccion.value,
        cargo: formulario.cargo.value,
        jefeInmediato: formulario.jefeInmediato.value,
        pais: formulario.pais.value,
        estado: true
    }

    let empleados  = JSON.parse(localStorage.getItem("empleados"));

    empleados.unshift(empleado);

    localStorage.setItem("empleados", JSON.stringify(empleados));

    alert("Empleado registrado");

}

/**
 * FUNCION QUE LIMPIA LA SESION DE USUARIO, AL MOMENTO DE CERRAR SESION
 */
function limpiarSesion(){
    localStorage.setItem(usuarioLogeado.usuario, JSON.stringify(usuarioLogeado));
    sessionStorage.clear();
}

/**
 * FUNCION QUE ME GUARDA LOS VALORES ACTUALES DE LA LISTA DE EMPLEADOS
 */
function guadarLocalStorage(){
    let empleadosActuales = JSON.parse(localStorage.getItem("empleados"));
    localStorage.setItem("empleados", JSON.stringify(empleadosActuales));
}

function buscarEnLocalStorage(nombre){
    return JSON.parse(localStorage.getItem(nombre));
}

function buscarEnSesionStorage(nombre){
    return sessionStorage.getItem(nombre);
}

function cargarInfoEmpleado(empleado){
    buscarPorSelector("id", "nombreEmpleadoTitulo", false).textContent = cortarNombre(empleado.nombre);
    buscarPorSelector("id", "nombreEmpleado", false).value = empleado.nombre;
    buscarPorSelector("id", "cedulaEmpleado", false).value = empleado.cedula;
    buscarPorSelector("id", "correoCorporativoEmpleado", false).value = empleado.correoCorporativo;
    buscarPorSelector("id", "telefonoEmpleado", false).value = empleado.telefono;
    buscarPorSelector("id", "direccionEmpleado", false).value = empleado.direccion;
    buscarPorSelector("id", "cargoEmpleado", false).value = empleado.cargo;
    buscarPorSelector("id", "jefeInmediatoEmpleado", false).value = empleado.jefeInmediato;
    buscarPorSelector("id", "paisEmpleado", false).value = empleado.pais;

    let $inputsDisabled = buscarPorSelector("class", "input-disabled", true);

    $inputsDisabled.forEach(input => input.setAttribute("readonly", ""));

    mostrarSection("detalle-empleado", buscarPorSelector("class", "sections-administrador", true));
}

function buscarPorSelector(tipoSelector, valorSelector, isAll){
    const TIPOS_SELECTORES = {
        ID: "id",
        CLASS: "class"
    }

    if(tipoSelector === TIPOS_SELECTORES.ID){
        return document.getElementById(valorSelector);
    }

    if(tipoSelector === TIPOS_SELECTORES.CLASS && isAll === false){
        return document.getElementsByClassName(valorSelector);
    }

    if(tipoSelector === TIPOS_SELECTORES.CLASS && isAll === true){
        return document.querySelectorAll(`.${valorSelector}`);
    }

    console.error(`El selector (${tipoSelector}) con valor de ${valorSelector}, no se encuentra.`);
}