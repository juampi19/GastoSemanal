//variables
const formulario = document.querySelector( '#agregar-gasto' );
const contenedorLista = document.querySelector( '#gastos ul' );



//Eventos
eventListeners();
function eventListeners() {
    document.addEventListener( 'DOMContentLoaded', agregarPresupuesto );
    formulario.addEventListener( 'submit', agregarGastos );
}

//clases
class Presupuesto {
    constructor( presupuesto ) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto( gasto ) {
        this.gastos = [ ...this.gastos, gasto ];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( ( total, gasto ) => total + gasto.cantidad, 0 );

        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto( id ) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );

        this.calcularRestante();
    }
}

class UI{

    insertarPresupuesto( cantidad ) {
        const { presupuesto, restante } = cantidad;
        const total = document.querySelector( '#total' );
        const sobrante = document.querySelector( '#restante' );
        //Insertar en el html
        total.textContent = presupuesto;
        sobrante.textContent = restante;
    }

    imprimirAlerta( mensaje, tipo ) {
        const alerta = document.createElement( 'p' );
        alerta.classList.add( 'text-center', 'alert' );

        if( tipo === 'error' ){
            alerta.classList.add( 'alert-danger' );
        }else {
            alerta.classList.add( 'alert-success' );
        }

        alerta.textContent = mensaje;

        //Insertar en el html 
        document.querySelector( '.primario' ).insertBefore( alerta, formulario );

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

    agregarHTML( gastos ) {
        
        this.limpiarHTML();
        gastos.forEach( gasto => {
            const { nombre, cantidad, id } = gasto;
            //Creando la lista de los gastos
            const lista = document.createElement( 'li' );
            lista.classList.add( 'list-group-item', 'd-flex', 'justify-content-between', 'align-items-center' );
            lista.dataset.id = id;
            lista.innerHTML = `
                ${nombre}  <span class="bagde badge-primary badge-pill">$ ${cantidad}</span>
            `;

            //Crear el boton para eliminar
            const btnBorrar = document.createElement( 'button' );
            btnBorrar.classList.add( 'btn', 'btn-danger', 'borrar-gasto' );
            btnBorrar.innerHTML = ' Borrar &times;'
            btnBorrar.onclick = () => {
                borrarGasto( id );
            }
            lista.appendChild( btnBorrar );


            contenedorLista.appendChild( lista );
        } );
    }

    limpiarHTML() {
        while( contenedorLista.firstChild ) {
            contenedorLista.removeChild( contenedorLista.firstChild );
        }
    }

    actualizarRestante( restante ) {
        document.querySelector( '#restante').textContent = restante;
    }

    comprobarPresupuesto( presupuestoObj ) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector( '.restante' );

        //Comprobando el 25%
        if( ( presupuesto / 4 ) > restante ) {
            restanteDiv.classList.remove( 'alert-success', 'alert-warning' );
            restanteDiv.classList.add( 'alert-danger' );

            //Comprobando el 50%
        } else if( ( presupuesto / 2 ) > restante ){
            restanteDiv.classList.remove( 'alert-success', 'alert-danger' );
            restanteDiv.classList.add( 'alert-warning' );

        } else {
            restanteDiv.classList.remove( 'alert-danger', 'alert-warning' );
            restanteDiv.classList.add( 'alert-success' );
        }


        //Si el restante es menor a 0
        if( restante <= 0 ){
            this.imprimirAlerta( 'El presupuesto se ha agotado', 'error' );

            formulario.querySelector( 'button[type="submit"]' ).disabled = true;
        }else {
            formulario.querySelector( 'button[type="submit"]' ).disabled = false;
        }
        
    }
}

//Instancias
let presupuesto;
const ui = new UI();


//funciones
function agregarPresupuesto() {
    const presupuestoUsuario = prompt( '¿Cual es tu presupuesto?' );
    if( presupuestoUsuario === '' || presupuestoUsuario === null || isNaN( presupuestoUsuario ) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    presupuesto = new Presupuesto( presupuestoUsuario );
    ui.insertarPresupuesto( presupuesto );
}

function agregarGastos( e ) {
    e.preventDefault();
    
    //Seleccionando los inputs
    const nombre = document.querySelector( '#gasto' ).value;
    const cantidad = Number(document.querySelector( '#cantidad' ).value);

    if( nombre === '' || cantidad === '' ) {
        ui.imprimirAlerta( 'Ambos campos son obligatorios', 'error' );
        return;
    }else if( cantidad <= 0 || isNaN( cantidad ) ) {
        ui.imprimirAlerta( 'Cantidad no valida', 'error' );
        return;
    }

    //Creando un objeto e insertarlo en el arreglo
    const gasto = { nombre, cantidad, id: Date.now() }
    presupuesto.nuevoGasto( gasto );

    //Imprimir mensaje
    ui.imprimirAlerta( 'Gastos agregados correctamente' );

    //Imprimer los gastos en el html y actualizar el restante
    const { gastos, restante } = presupuesto;
    
    //Imprimir los gastos en el html
    ui.agregarHTML( gastos );

    //Actualizar el restante en el html
    ui.actualizarRestante( restante );

    //Comprobar el presupuesto
    ui.comprobarPresupuesto( presupuesto );


    formulario.reset();500
}


function borrarGasto( id ) {
    presupuesto.eliminarGasto( id );

    const { gastos, restante } = presupuesto;
    ui.agregarHTML( gastos );
    ui.actualizarRestante( restante );
    ui.comprobarPresupuesto( presupuesto );
}