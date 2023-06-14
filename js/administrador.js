import Empleado from "../model/Empleado.js";
import Tarjeta from "../model/Tarjeta.js";
import { mostrarTarjetaSolicitada } from "./axios.js";
let $body = document.body;
const usuarioLogeado = (buscarEnSesionStorage("usuarioLogeado") === null) ? window.location.href = "../index.html" : JSON.parse(sessionStorage.usuarioLogeado);

document.addEventListener("DOMContentLoaded", e => {
    
    downloadFile("terminos");
    downloadFile("terminos-solicitud");

    if(localStorage.getItem("solicitudes") == null){localStorage.setItem("solicitudes", JSON.stringify([]))};
    
    $body.querySelector("#bienvenida").textContent = `BIENVENIDO ${cortarNombre(usuarioLogeado.nombre).toUpperCase()}`
    
    if(buscarEnLocalStorage("empleados") == null){
        
        buscar("../assets/empleados.json", guardarEmpleados);
        
    } else {
        
        let empleados = buscarEnLocalStorage("empleados");
        
        mostrarEmpleados(empleados);
    }
    
    crearSelectEmpleados("select-empleados", "nombreEmpleadoSolicitud");
    crearSelectCupos("cupoTarjeta");
    crearSelectTiposTarjetas("tipoTarjeta");
    crearSelectEmpleadosBloqueo("select-empleados-bloqueo", "nombreEmpleadoBloqueo");
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

        if(e.target.matches(".solicitudes")){

            mostrarSection("solicitudes", buscarPorSelector("class", "sections-administrador", true));
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

            if(empleado.id == e.target.dataset.id){
                cargarInfoEmpleado(empleado)
            }
        })
    }

    if(e.target.matches(".btn-regresar")){
        e.preventDefault();

        mostrarSection("lista-empleados", buscarPorSelector("class", "sections-administrador", true));
    }

    if(e.target.matches(".btn-editar")){
        e.preventDefault();

        let $inputsDisabled = buscarPorSelector("class", "input-disabled", true);

        $inputsDisabled.forEach(input => input.removeAttribute("readonly"));

        buscarPorSelector("class", "btn-actualizar", false).style.display = "block";

        buscarPorSelector("class", "btn-editar", false).style.display = "none";

    }

    if(e.target.matches(".btn-actualizar")){
        e.preventDefault();

        if(preValidacion(e.target.parentElement.parentElement.querySelector(".contenedor-inputs"))){

            buscarPorSelector("class", "btn-actualizar", false).style.display = "none";
    
            buscarPorSelector("class", "btn-editar", false).style.display = "block";
    
            actualizarEmpleado(e.target.parentElement.parentElement);
        } else {
            alert("Complete todos los campos.");
        }

    }

    if(e.target.matches(".btn-eliminar-empleado")){
        let usuarioLogeado = buscarEnSesionStorage("usuarioLogeado");

        if(usuarioLogeado.rol != "admin"){
            return alert("No tiene permisos para eliminar registros");
        }

        let empleados = buscarEnLocalStorage("empleados");

        empleados.forEach((empleado, index) => {
            if(empleado.id == e.target.dataset.id){

                let confirmacion = confirm(`Esta seguro que desea eliminar el registro con id: ${empleado.id}`);

                if(confirmacion){

                    empleados.splice(index, 1);
                    actualizarLocalStorage("empleados", empleados);
                    mostrarEmpleados();
                    mostrarSection("lista-empleados", buscarPorSelector("class", "sections-administrador", true))
                }
            }
        })
    }

    if(e.target.matches(".btn-solicitar-nueva-tarjeta")){
        e.preventDefault();

        let cupo = e.target.parentElement.parentElement.querySelector("#cupoTarjeta").value;
        let tipoTarjeta = e.target.parentElement.parentElement.querySelector("#tipoTarjeta").value;

        if(cupo == "" || tipoTarjeta == ""){
            return alert("Complete todos los campos");
        }

        let idEmpleado = e.target.parentElement.parentElement.querySelector("#nombreEmpleadoSolicitud").value;
        let empleadoEnviado;
        
        let empleados = buscarEnLocalStorage("empleados");

        empleados.forEach(empleado => {
            if(empleado.id == idEmpleado){
                empleadoEnviado = empleado;       
            }
        })

        mostrarTarjetaSolicitada(".contenedor-tarjeta-solicitada", tipoTarjeta, empleadoEnviado, cupo);
    }

    if(e.target.matches(".nueva-tarjeta")){
        mostrarSection("nueva-tarjeta", buscarPorSelector("class", "sections-solicitudes", true));
    }

    if(e.target.matches(".bloqueo-preventivo")){
        mostrarSection("bloqueo-preventivo", buscarPorSelector("class", "sections-solicitudes", true));
    }

    if(e.target.matches(".btn-bloquear-tarjeta")){
        e.preventDefault();
        alert(`La tarjeta del empleado: ${e.target.parentElement.parentElement.querySelector("#nombreEmpleadoBloqueo").value}, ha sido bloqueada.`);
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
                    <img class="btn-detalle-empleado" data-id="${elemento.id}" title="Detalle usuario: ${cortarNombre(elemento.nombre)}" src="../icons/editar.png" alt="Editar" />
                    <img class="btn-eliminar-empleado" data-id="${elemento.id}" title="Eliminar usuario: ${cortarNombre(elemento.nombre)}" src="../icons/eliminar.png" alt="Editar" />   
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
    let empleados = [];

    data.forEach(dataEmpleado => {

        const empleado = new Empleado(
            dataEmpleado.nombre, 
            dataEmpleado.cedula, 
            dataEmpleado.correoCorporativo, 
            dataEmpleado.telefono, 
            dataEmpleado.direccion, 
            dataEmpleado.cargo, 
            dataEmpleado.jefeInmediato, 
            dataEmpleado.pais);


        empleados.unshift(empleado);
    })
    localStorage.setItem("empleados", JSON.stringify(empleados))

}

/**
 * FUNCION QUE ME REGISTRA UN EMPLEADO EN EL LOCALSTORAGE
 * @param {HTMLElement} formulario 
 */
function registrarEmpleado(formulario){

    let empleado = new Empleado(
        formulario.nombre.value,
        formulario.cedula.value,
        formulario.correoCorporativo.value,
        formulario.telefono.value,
        formulario.direccion.value,
        formulario.cargo.value,
        formulario.jefeInmediato.value,
        formulario.pais.value,
    )

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

/**
 * FUNCION QUE ME BUSCA UN VALOR EN EL LOCALSTORAGE
 * @param {String} nombre SE LE PASA COMO PAREMETRO EL NOMBRE DE LA CLAVE
 * @returns ME RETORNA EL VALOR QUE LLAME Y SI NO HAY VALOR, RETORNA NULL
 */
function buscarEnLocalStorage(nombre){
    return JSON.parse(localStorage.getItem(nombre));
}

/**
 * FUNCION QUE ME BUSCA UN VALOR EN EL SESION STORAGE
 * @param {*} nombre RECIBE EL NOMBRE DE LA CLAVE 
 * @returns ME RETORNA EL VALOR QUE LLAME Y SI NO HAY VALOR, RETORNA NULL
 */
function buscarEnSesionStorage(nombre){
    return JSON.parse(sessionStorage.getItem(nombre));
}

/**
 * FUNCION QUE ME ACTUALIZA EL LOCAL STORAGE
 * @param {*} nombre RECIBE EL NOMBRE COMO PAREMETRO 
 * @param {*} valor RECIBE EL VALOR QUE SE VA ACTUALIZAR
 */
function actualizarLocalStorage(nombre, valor){
    localStorage.setItem(nombre, JSON.stringify(valor));
}

/**
 * FUNCION QUE ME CARGA LA INFORMACION DEL EMPLEADO A LA INTERFAZ 
 * @param {*} empleado OBJETO QUE CONTIENE TODA LA INFORMACION DEL EMPLEADO
 */
function cargarInfoEmpleado(empleado){
    buscarPorSelector("id", "idEmpleado", false).value = empleado.id;
    buscarPorSelector("id", "nombreEmpleadoTitulo", false).textContent = cortarNombre(empleado.nombre);
    buscarPorSelector("id", "nombreEmpleado", false).value = empleado.nombre;
    buscarPorSelector("id", "cedulaEmpleado", false).value = empleado.cedula;
    buscarPorSelector("id", "correoCorporativoEmpleado", false).value = empleado.correoCorporativo;
    buscarPorSelector("id", "telefonoEmpleado", false).value = empleado.telefono;
    buscarPorSelector("id", "direccionEmpleado", false).value = empleado.direccion;
    buscarPorSelector("id", "cargoEmpleado", false).value = empleado.cargo;
    buscarPorSelector("id", "jefeInmediatoEmpleado", false).value = empleado.jefeInmediato;
    buscarPorSelector("id", "paisEmpleado", false).value = empleado.pais;
    buscarPorSelector("id", "estadoEmpleado", false).value = (empleado.estado) ? "Activo" : "Inactivo";

    let $inputsDisabled = buscarPorSelector("class", "input-disabled", true);

    $inputsDisabled.forEach(input => input.setAttribute("readonly", ""));

    mostrarSection("detalle-empleado", buscarPorSelector("class", "sections-administrador", true));
}


/**
 * FUNCION QUE ME BUSCA UN ELEMENTO HTML DE ACUERDO AL SELECTOR QUE SE LE PASE
 * @param {*} tipoSelector TIPO DE SELECTOR A BUSCAR (CLASS Y ID)
 * @param {*} valorSelector EL VALOR DEL SELECTOR (contenedor-tarjeta)
 * @param {*} isAll ESTE PARAMETRO ME DICE SI ES UN SELECTOR MULTIPLE O UNICO, EN ESTE CASO TRUE PARA TRAER MULTIPLES ELEMENTOS O FALSE PARA UN UNICO ELEMENTO
 * @returns 
 */
function buscarPorSelector(tipoSelector, valorSelector, isAll){
    const TIPOS_SELECTORES = {
        ID: "id",
        CLASS: "class"
    }

    if(tipoSelector === TIPOS_SELECTORES.ID){
        return document.getElementById(valorSelector);
    }

    if(tipoSelector === TIPOS_SELECTORES.CLASS && isAll === false){
        return document.querySelector(`.${valorSelector}`);
    }

    if(tipoSelector === TIPOS_SELECTORES.CLASS && isAll === true){
        return document.querySelectorAll(`.${valorSelector}`);
    }

    console.error(`El selector (${tipoSelector}) con valor de ${valorSelector}, no se encuentra.`);
}

/**
 * FUNCION QUE ME AGREGA EL DOCUMENTO DE TERMINOS Y CONDICIONES
 * @param {*} selector SELECTOR EN DONDE SE VA AGREGAR EL DOCUMENTO
 */
function downloadFile(selector){
    const a = document.createElement("a");
    a.href = "../assets/Terminos_y_Condiciones.pdf";
    a.target = "_blank";
    a.textContent = "Acepto los terminos y condiciones";
    a.style.textDecoration = "none";
    a.style.color = "#DADAD9";

    a.onmouseover = (e) => {
        a.style.textDecoration = "underline";
    }

    a.onmouseout = (e) => {
        a.style.textDecoration = "none";
    }

    buscarPorSelector("class", selector, false).appendChild(a);
}

/**
 * FUNCION QUE ME ACTUALIZA UN EMPLEADO
 * @param {*} formulario RECIBE EL FORMULARIO CON TODA LA INFORMACION A ACTUALIZAR
 */
function actualizarEmpleado(formulario){

    let $informacion = formulario.querySelector(".contenedor-inputs");


    let empleados = buscarEnLocalStorage("empleados");

    empleados.forEach(empleado  => {
        if(empleado.id == $informacion.querySelector("#idEmpleado").value){

            empleado.nombre = $informacion.querySelector("#nombreEmpleado").value;
            empleado.cedula = $informacion.querySelector("#cedulaEmpleado").value;
            empleado.correoCorporativo = $informacion.querySelector("#correoCorporativoEmpleado").value;
            empleado.telefono = $informacion.querySelector("#telefonoEmpleado").value;
            empleado.direccion = $informacion.querySelector("#direccionEmpleado").value;
            empleado.cargo = $informacion.querySelector("#cargoEmpleado").value;
            empleado.jefeInmediato = $informacion.querySelector("#jefeInmediatoEmpleado").value;
            empleado.estado = $informacion.querySelector("#estadoEmpleado").value;
            empleado.pais = $informacion.querySelector("#paisEmpleado").value;
        }
    })


    alert(`Empleado con id: ${$informacion.querySelector("#idEmpleado").value} actualizado.`);

    actualizarLocalStorage("empleados", empleados);

    guadarLocalStorage();
    
    mostrarEmpleados();

    mostrarSection("lista-empleados", buscarPorSelector("class", "sections-administrador", true));

}

/**
 * FUNCION QUE ME VALIDAD LOS CAMPOS, PARA ACTUALIZAR UN EMPLEADO SIN DEJAR CAMPOS VACIOS
 * @param {*} formulario RECIBE EL FORMULARIO CON TODA LA INFORMACION
 * @returns RETORNA TRUE SI NO HAY INCONVENIENTES CON LA ACTUALIZACION O FALSE SI ALGUN CAMPO ESTA VACIO
 */
function preValidacion(formulario){
        let $nombre = formulario.querySelector("#nombreEmpleado").value;
        let $cedula = formulario.querySelector("#cedulaEmpleado").value;
        let $correoInstitucional = formulario.querySelector("#correoCorporativoEmpleado").value;
        let $telefono = formulario.querySelector("#telefonoEmpleado").value;
        let $direccion = formulario.querySelector("#direccionEmpleado").value;
        let $cargo = formulario.querySelector("#cargoEmpleado").value;
        let $jefeInmediato = formulario.querySelector("#jefeInmediatoEmpleado").value;
        let $pais = formulario.querySelector("#paisEmpleado").value;
        let $estado = formulario.querySelector("#estadoEmpleado").value;

        if($nombre === "" || $cedula === "" || $correoInstitucional === "" || $telefono === "" || $direccion === "" || $cargo === "" || $jefeInmediato === "" || $pais === "" || $estado === ""){
            return false;
        }


        return true;
}

/**
 * FUNCION QUE ME CREA EL SELECT DE LOS EMPLEADOS
 * @param {*} selector SELECTOR EN DONDE SE VA AGREGAR EL SELECT
 * @param {*} id ID DE DONDE SE AGREGARIA AL NOMBRE Y NAME DEL SELECT
 */
function crearSelectEmpleados(selector, id){
    const $select = document.createElement("select");

    $select.name = id;
    $select.id = id;

    const $optionSelected = document.createElement("option");
    $optionSelected.value = "";
    $optionSelected.textContent = "Seleccionar"

    $select.appendChild($optionSelected);

    let empleados = buscarEnLocalStorage("empleados");
    

    $select.addEventListener("change", e => {
        //console.log(e.target.parentElement.parentElement.querySelector("#cargoEmpleadoSolicitud"));

        if(e.target.value == ""){
            e.target.parentElement.parentElement.querySelector(`#cargoEmpleadoSolicitud`).value = "";
                e.target.parentElement.parentElement.querySelector(`#direccionEmpleadoSolicitud`).value = "";
                e.target.parentElement.parentElement.querySelector(`#cedulaEmpleadoSolicitud`).value = "";
                e.target.parentElement.parentElement.querySelector(`#paisEmpleadoSolicitud`).value = "";
                e.target.parentElement.parentElement.querySelector(`#estadoEmpleadoSolicitud`).value = "";
                e.target.parentElement.parentElement.querySelector(`#telefonoEmpleadoSolicitud`).value = "";
                e.target.parentElement.parentElement.querySelector(`#correoCorporativoEmpleadoSolicitud`).value = "";
        }

        empleados.forEach(empleado => {
            
            if(e.target.value == empleado.id){
                e.target.parentElement.parentElement.querySelector(`#cargoEmpleadoSolicitud`).value = empleado.cargo;
                e.target.parentElement.parentElement.querySelector(`#direccionEmpleadoSolicitud`).value = empleado.direccion;
                e.target.parentElement.parentElement.querySelector(`#cedulaEmpleadoSolicitud`).value = empleado.cedula;
                e.target.parentElement.parentElement.querySelector(`#paisEmpleadoSolicitud`).value = empleado.pais;
                e.target.parentElement.parentElement.querySelector(`#estadoEmpleadoSolicitud`).value = (empleado.estado) ? "Activo" : "Inactivo";
                e.target.parentElement.parentElement.querySelector(`#telefonoEmpleadoSolicitud`).value = empleado.telefono;
                e.target.parentElement.parentElement.querySelector(`#correoCorporativoEmpleadoSolicitud`).value = empleado.correoCorporativo;

            } 
        })
    })

    empleados.forEach(empleado => {
        const $option = document.createElement("option");
        $option.value = empleado.id;
        $option.textContent = empleado.nombre;

        $select.appendChild($option);
    })

    buscarPorSelector("class", selector, false).appendChild($select);
}

/**
 * FUNCION QUE CREA EL SELECT DE CUPOS
 * @param {*} selector SELECTOR EN DONDE SE AGREGARA EL SELECT 
 */
function crearSelectCupos(selector){

    const cupos = [120000, 400000, 600000, 1000000, 1400000, 6000000, 35000000];
    const $select = document.createElement("select");

    $select.name = "cupoTarjeta";
    $select.id = "cupoTarjeta";

    const $optionSelected = document.createElement("option");
    $optionSelected.value = "";
    $optionSelected.textContent = "Seleccionar"

    $select.appendChild($optionSelected);

    cupos.forEach(cupo => {
        let $option = document.createElement("option");
        $option.value = cupo;
        $option.textContent = formatoMoneda(cupo);

        $select.appendChild($option);
    })

    buscarPorSelector("class", selector, false).appendChild($select);
}

/**
 * FUNCION QUE ME RETORNA UN ENTERO CON FORMATO DE MONEDA
 * @param {*} cupo ES EL ENTERO QUE SE LE PASA
 * @returns CUPO FORMATEADO
 */
function formatoMoneda(cupo){
    const formateado = cupo.toLocaleString("en", {
        style: "currency",
        currency: "COP",
    });

    return formateado;
}

/**
 * FUNCION QUE ME CREA EL SELECT DE TIPOS DE TARJETAS 
 * @param {*} selector SELECTOR EN DONDE SE AGREGARA EL SELECT 
 */
function crearSelectTiposTarjetas(selector){
    const tipos = ["Credito", "Debito"];
    const $select = document.createElement("select");

    $select.name = "tipoTarjeta";
    $select.id = "tipoTarjeta";

    const $optionSelected = document.createElement("option");
    $optionSelected.value = "";
    $optionSelected.textContent = "Seleccionar"

    $select.appendChild($optionSelected);

    tipos.forEach(tipo => {
        const $option = document.createElement("option");
        $option.value = tipo;
        $option.textContent = tipo;

        $select.appendChild($option);
    })

    buscarPorSelector("class", selector, false).appendChild($select);
}

/**
 * FUNCION QUE CREA EL SELECT DE EMPLEADOS QUE TIENEN TARJETAS PARA BLOQUEAR
 * @param {*} selector SELECTOR DE DONDE SE VA AGREGAR EL SELECT
 * @param {*} id ID QUE CORRESPONDE AL ID Y AL NOMBRE DEL ELEMENTO
 */
function crearSelectEmpleadosBloqueo(selector, id){
    const $select = document.createElement("select");

    $select.name = id;
    $select.id = id;

    const $optionSelected = document.createElement("option");
    $optionSelected.value = "";
    $optionSelected.textContent = "Seleccionar"

    $select.appendChild($optionSelected);

    let solicitudes = buscarEnLocalStorage("solicitudes");
    

    $select.addEventListener("change", e => {
        //console.log(e.target.parentElement.parentElement.querySelector("#cargoEmpleadoSolicitud"));

        if(e.target.value == ""){
                e.target.parentElement.parentElement.querySelector(`#idPropietarioBloqueo`).value = "";
                e.target.parentElement.parentElement.querySelector(`#cupoTarjetaBloqueo`).value = "";
                e.target.parentElement.parentElement.querySelector(`#tipoTarjetaBloqueo`).value = "";
                e.target.parentElement.parentElement.querySelector(`#estadoTarjetaBloqueo`).value = "";
                e.target.parentElement.parentElement.querySelector(`#numeroTarjetaBloqueo`).value = "";
        }


        solicitudes.forEach(solicitud => {

            
            if(e.target.value == solicitud.idPropietario){
                document.querySelector(".contenedor-tarjeta-bloqueo").innerHTML = new Tarjeta(solicitud.color1, solicitud.color2, solicitud.tipo, solicitud.nombreUsuario, solicitud.cupo, solicitud.idPropietario).crearTarjeta();

                e.target.parentElement.parentElement.querySelector(`#idPropietarioBloqueo`).value = solicitud.idPropietario;
                e.target.parentElement.parentElement.querySelector(`#cupoTarjetaBloqueo`).value = solicitud.cupo;
                e.target.parentElement.parentElement.querySelector(`#tipoTarjetaBloqueo`).value = solicitud.tipo;
                e.target.parentElement.parentElement.querySelector(`#estadoTarjetaBloqueo`).value = (solicitud.estadoTarjeta) ? "Activo" : "Inactivo";
                e.target.parentElement.parentElement.querySelector(`#numeroTarjetaBloqueo`).value = solicitud.numeroTarjeta;

            } 
        })
    })

    solicitudes.forEach(solicitud => {
        const $option = document.createElement("option");
        $option.value = solicitud.idPropietario;
        $option.textContent = solicitud.nombreUsuario;

        $select.appendChild($option);
    })

    buscarPorSelector("class", selector, false).appendChild($select);
}
