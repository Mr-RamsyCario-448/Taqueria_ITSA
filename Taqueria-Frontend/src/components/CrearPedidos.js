// Login.js
import React, { useState, useEffect } from 'react';
//helmet permite ejecutar scripts en Return

const IPBE = process.env.REACT_APP_IP_BACKEND

function CrearPedidos() {

    //logica para agregar elementos para el pedido
    const [selects_cuantos, setSelects_cuantos] = useState([0]);
    const [selects_tipo, setSelects_tipo] = useState([0]);

    const addSelect = () => {
        setSelects_cuantos([...selects_cuantos, selects_cuantos.length]);
        setSelects_tipo([...selects_tipo, selects_tipo.length]);
    };
   
    const [datosUsuario, setDatosForm] = useState({
        nombre_cliente: 'Invitado',//Valor: 'Invitado' por defecto
        notas: ''
    });



    const handleChange = (e, type, index) => {
        if (type === 'cuantos') {
            const newSelectsCuantos = [...selects_cuantos];
            newSelectsCuantos[index] = e.target.value;
            setSelects_cuantos(newSelectsCuantos);

        } else if (type === 'tipos') {
            const newSelectsTipos = [...selects_tipo];
            newSelectsTipos[index] = e.target.value;
            setSelects_tipo(newSelectsTipos);

        } else {
            setDatosForm({
                ...datosUsuario,
                ['nombre_cliente'] : nombreUsuario,
                [e.target.name]: e.target.value
            });
        }
    };


    //SECCION PARA INSERCION DE DATOS

    const crearTablaArticuloPedidos = () =>{
    //creamos una variable que contendra cuantos tacos de que
    var pedido = '';
    for(var i = 0; i<selects_cuantos.length; i++){
        pedido = pedido +
        selects_cuantos[i] + ' ' +selects_tipo[i] + '\n';
    }
    return pedido;

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission, e.g., send data to MongoDB Atlas

        //preguntamos al usuario invitado su nombre
        if (nombreUsuario === 'Invitado'){

            var nombreUsuarioNew = window.prompt('Cual es su nombre?');
            //console.log(nombreUsuario);
            //Si el usuario presiona cancelar, oh bien, no escribe nada, mandar advertencia.
            if (nombreUsuarioNew === null)
                return window.alert('Pedido Cancelado.');
            

            if(nombreUsuarioNew === '')
                return window.alert('Escribe un nombre por favor.');

            datosUsuario.nombre_cliente = nombreUsuarioNew;

        }
        

        const pedidoTexto = crearTablaArticuloPedidos();    

        //console.log('Nombre en la chingadera de form es: '+datosUsuario.nombre_cliente);

        var confirmarPedido = window.confirm('El pedido es:\n'+
        'Nombre de Cliente: ' + datosUsuario.nombre_cliente + '\n' +
        'Son: ' + pedidoTexto + '\n' +
        'Notas: ' + datosUsuario.notas + '\n' + 'Confirmar?'
        )

        if (confirmarPedido === false){
            return window.alert('Pedido cancelado.');
        }

        //insercion de los datos
        try {
            const combinedData = {
                selects_cuantos,
                selects_tipo,
                datosUsuario,
                'estado':'pendiente',
            };
            console.log(combinedData);
            
            const response = await fetch('http://'+IPBE+'/api/insertPedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(combinedData)
            });

            if (response.ok) {
                if(response.status === 201){
                    alert('WTF XD')
                }
                else{
                    alert('Pedido enviado!');
                }
            } else {
                alert('Error inserting data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error inserting data');
        }


        // Reset form after submission if needed
        setDatosForm({
            notas: ''
        });
    };

    //verificar si hay sesion
    //logica de token
    const isAuthenticated = localStorage.getItem('token');
    //Buscamos el nombre de Usuario en memoria local del sistema
    var nombreUsuario = localStorage.getItem('userName');
    
    //si no existe o es nulo, se escribe invitado, en otro caso el nombreUsuario ya se escribe en la barra de navegacion
    if (nombreUsuario === null)
        nombreUsuario = 'Invitado';
    
    var botonSesion = "Iniciar";
    //preguntamos si tiene el token de inicio de sesion.
    if(isAuthenticated){
        //console.log('token given!')
        botonSesion = "Cerrar";
        }


    
    const sesion = () => {
            if (botonSesion === "Cerrar"){
                //window.alert("Sesion cerrada.");
                window.location.href = '/';
                //esto destruye el token, nombre del usuario y su rol
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
            }
            else{
                window.location.href = '/login';
            }
        };    
    
        //previene un refresh de la pagina, una forma de evitar que se pierdan los datos de pedido
    
    useEffect(() => {
            const handleBeforeUnload = (event) => {
              event.preventDefault();
              // Custom logic to handle the refresh
              // Display a confirmation message or perform necessary actions
            };
            window.addEventListener('beforeunload', handleBeforeUnload);
            return () => {
              window.removeEventListener('beforeunload', handleBeforeUnload);
            };
          }, []);


    return (
        <>

        <div class="contenedor-pedidos-clientes">
            {/*Barra de navegacion*/}
            <nav class="barraNavegacion">
            <a id="nav-inicio" href="/">Inicio</a>
            {/*<a id="nav-pedidos" href="/pedidos">Pedidos</a>*/}
            <a id="nav-sesion"  onClick={sesion} href="#">{botonSesion} Sesión</a>

            <a class="contPerfilUsuario"> <img></img> <span>Hola, {nombreUsuario}!</span> </a>

            </nav>



            <h1>Pagina de Crear un pedido</h1>
            <form onSubmit={handleSubmit}>
                {/*Si se quiere agregar otro pedido aqui esta la madre esta*/}
                {/*Cuantos tacos*/}
                <section class="selector-tacos">
                    <div className='select-cuantos-tacos' id=''>
                    {selects_cuantos.map((selects_cuantos, index_cuantos) => (
                        <div key={index_cuantos} className="select-container">
                            {/*<label htmlFor={`select${index + 1}`}>Que taco? {index + 1}:</label>*/}
                            <select name={`select_cuantos${index_cuantos + 1}`} id={`select_cuantos${index_cuantos + 1}`} onChange={(e) => handleChange(e, 'cuantos', index_cuantos)}>
                                
                                <option value="none">Cuantos?</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>

                            </select>
                        </div>
                    ))}
                    </div>
                    {/*De que los tacos?*/}
                    <div className='select-tipo-tacos'>
                    {selects_tipo.map((selects_tipo, index_tipo) => (
                        <div key={index_tipo} className="select-container">
                            {/*<label htmlFor={`select${index + 1}`}>Que taco? {index + 1}:</label>*/}
                            <select name={`select_tipo${index_tipo + 1}`} id={`select_tipo${index_tipo + 1}`} onChange={(e) => handleChange(e, 'tipos', index_tipo)}>
                                
                                <option value="none">De cuales?</option>
                                <option value="taco-birria">Taco de Birria</option>
                                <option value="taco-bistek">Taco de Bistek</option>
                                <option value="taco-chorizo">Taco de Chorizo</option>
                                <option value="taco-cabeza">Taco de Cabeza</option>

                            </select>
                        </div>
                    ))}
                    </div>
                </section>

                <button type="button" onClick={addSelect}>Agregar</button>

                <br></br>
                <label htmlFor="notas">Notas:</label><br />
                <textarea id="notas" name="notas" value={datosUsuario.notas} onChange={handleChange}></textarea><br />

                <input type="submit" value="Submit" />
            </form>




        </div>
        
        </>
        
    );
}

export default CrearPedidos;
