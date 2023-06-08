export default class Solicitud {
    constructor(tipoProducto, fechaSolicitud,cupoProducto, entidad){
        this.tipoProducto = tipoProducto;
        this.fechaSolicitud = fechaSolicitud;
        this.cupoProducto = parseInt(cupoProducto);
        this.entidad = entidad;
        this.id = parseInt((Math.random() * 10000).toFixed(0));
    }
}