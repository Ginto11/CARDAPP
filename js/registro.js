export default function registrarUsuario(formulario){

    const $formulario = formulario;

    const registro = {
        usuario: $formulario.usuario.value,
        nombre: $formulario.nombres.value,
        apellido: $formulario.apellidos.value,
        identificacion: $formulario.cedula.value,
        email: $formulario.email.value,
        password: $formulario.password.value,
        solicitudes: [],
        productos: []
    }

    if(localStorage.getItem(registro.usuario) == null){
        localStorage.setItem(registro.usuario, JSON.stringify(registro));
        alert("Usuario registrado");
        window.location.reload();
    } else {
        alert("Ese nombre de usuario ya esta en uso.");
    }

}
