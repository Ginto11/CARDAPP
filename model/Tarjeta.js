export default class Tarjeta {

    static DEBITO = "Debito";
    static CREDITO = "Credito"; 

    constructor(color1 = "#FFF", color2 = "#FFF", tipo, nombreUsuario, cupo, idPropietario){
        this.color1 = color1;
        this.color2 = color2;
        this.tipo = tipo;
        this.numeroTarjeta = (Math.random() * 10000000000000000).toFixed(0);
        this.nombreUsuario = nombreUsuario;
        this.cupo = parseInt(cupo);
        this.idPropietario = parseInt(idPropietario);
        this.estadoTarjeta = true;
    }

    crearTarjeta(){
        const tarjeta = `
            <div class="tarjeta tarjeta-debito" style="background: ${this.fondoGradient(this.color1, this.color2)}">
            <!-- TITULOS -->
            <h3 style="text-shadow: 0 0 2px #000; color: #FFF, font-style: italic;">${this.tipo}</h3>
            <h2>CARDAPP</h2>
            <!-- BARRAS -->
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <hr width="50%" color="red">
                <hr width="60%" color="blue">
                <hr width="70%" color="chartreuse">
            </div>
            <!-- INFORMACION -->
            <div class="tarjeta-info">
                <!-- CHIP -->
                <div class="chip">
                    <div style="display: flex; justify-content: left;">
                        <hr  width="55%">
                    </div>
                    <div style="display: flex; justify-content: right;">
                        <hr width="70%">
                    </div>
                    <div style="display: flex; justify-content: left;">
                        <hr width="40%">
                    </div>
                </div>
                <!-- NUMERO DE CUENTA -->
                <div>
                    <p style="text-shadow: 0 0 2px #000; font-style: italic;">${this.darFormatoNumeroCuenta(this.numeroTarjeta)}</p>
                </div>
            </div>
            <!-- NOMBRE USUARIO -->
            <div style="text-align: center; color: #000; font-weight: 600; font-size: 17px;">
                <p style="text-shadow: 0 0 2px #000; font-style: italic;">${this.nombreUsuario.toUpperCase()}</p>
            </div>
            <!-- CONTENEDOR CODIGO DE BARRAS -->
            <div style="background-color: #fff3; height: 55px; width: 100%; display: flex; gap: 3px; justify-content: center; position: absolute; bottom: 0;
            border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
                <div class="barra"></div>
            </div>
        </div>
        `
        return tarjeta;
    }

    darFormatoNumeroCuenta(numeroCuenta){
        let lista = "";
        let contador = 0;
        for (let i = 0; i < numeroCuenta.length; i++) {
            lista += numeroCuenta[i];
            if(contador == 3){
                lista += "&nbsp;";
                contador = 0;
            } else {
                contador++;
            }
            
        }
        return lista;
    }

    fondoGradient(color1, color2){
        return `linear-gradient(${color1}, ${color2})`;
    }
}