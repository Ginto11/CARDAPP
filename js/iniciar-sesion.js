export default function iniciarSesion(formulario){

    const $formulario = formulario;

    if(localStorage.getItem($formulario.usuario.value)){

        
        const usuario = JSON.parse(localStorage.getItem($formulario.usuario.value));
        
        console.log(usuario)
        if(usuario.usuario == $formulario.usuario.value && usuario.password == $formulario.password.value){
            sessionStorage.setItem("usuarioLogeado", JSON.stringify(usuario));
            
            window.location.href = "../views/administrador.html";

        }
    } else {
        alert("Registrese para iniciar sesion.");
        window.location.reload();
    }
}