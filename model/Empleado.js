export default class Empleado {

    constructor(nombre, cedula, correoCorporativo, telefono, direccion, cargo, jefeInmediato, pais){
        this.id = parseInt((Math.random() * 1000000).toFixed(0));
        this.nombre = nombre;
        this.cedula = cedula;
        this.correoCorporativo = correoCorporativo;
        this.telefono = telefono;
        this.direccion = direccion;
        this.cargo = cargo;
        this.jefeInmediato = jefeInmediato;
        this.pais = pais; 
        this.estado = true;
        this.solicitudes = [];
    }
}