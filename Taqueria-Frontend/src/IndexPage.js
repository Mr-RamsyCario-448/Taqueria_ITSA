import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

function IndexPage(){
    //ocultar pedidos cuando sea un usuario cliente o nuevo
    
    //logica de token
    const isAuthenticated = localStorage.getItem('token');

    const userRole = localStorage.getItem('userRole');

    var userName = localStorage.getItem('userName');
    
    var botonSesion = "Iniciar";
    //preguntamos si tiene el token de inicio de sesion.
    if(isAuthenticated){
        //console.log('token given!')
        var botonSesion = "Cerrar";
        }
        else
            userName = 'Invitado';

    //debido a que es la ventana principal, solamente cambia el
    //boton de Iniciar o Cerrar Sesion.

    const sesion = () => {
        if (botonSesion === "Cerrar"){
            //window.alert("Sesion cerrada.");
            window.location.href = '/';
            //esto destruye el token
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
        }
        else{
            window.location.href = '/login';
        }
    };

    const realizarPedido = () => {

        //obtener nombre del usuario si existe la sesion, si no existe, entonces dar la opcion en otra ventana de agregar el nombre
        //proximamente: agregar un icono con foto de perfil y nombre del usuario.
        window.location.href = '/crear_pedido';
    }
    //es necesario el Stringify ya que sin ello la palabra 'Admin' es tomada como referencia en vez de texto, queremos que sea texto.
    //solo existen dos casos, donde sea admin y donde no lo es.
    const scriptRolUsuario = `

    if(${JSON.stringify(userRole)} === 'Cliente' || ${JSON.stringify(userRole)} === 'Admin'){
        document.getElementById("nav-mis-pedidos").style.visibility = "visible";
    }
    else{
        document.getElementById("nav-mis-pedidos").style.display = "none";
    }
    
    if(${JSON.stringify(userRole)} === 'Admin'){
        document.getElementById("nav-pedidos").style.visibility = "visible";
        document.getElementById("nav-users").style.visibility = "visible";

    }
    else{
        document.getElementById("nav-pedidos").style.display = "none";
        document.getElementById("nav-users").style.display = "none";
    }



    `;

    return(
        <>
        <Helmet>
            <script>
                
                    {scriptRolUsuario}
                
            </script>
        </Helmet>

        <nav className="barraNavegacion">
            <a id="nav-inicio" href="/">Inicio</a>
            {/*<a id="nav-pedidos" href="/pedidos">Pedidos</a>*/}

            {
            /*Seccion para hacer visible o invisble*/
            <>

        
            <a id="nav-mis-pedidos" href="/mis_pedidos">Mis Pedidos</a>

            <a id="nav-pedidos" href="/pedidos">Pedidos</a>
            
            <a id="nav-users" href="/dashboard">Usuarios</a>

            </>
            }

            <a id="nav-sesion"  onClick={sesion} href="#">{botonSesion} Sesión</a>

            <a className="contPerfilUsuario"> <img></img> <span>Hola, {userName}!</span></a>




        </nav>

        <div className="contenedorIndex">
        <h1>Pagina de Inicio</h1>
        <p>Esta es la pagina de Inicio</p>
        
        <button className="commonButton" onClick={realizarPedido}>Realizar Pedido</button>
        </div>
        <div className="textoInferior">
            <section className="productoTaco" >
            <div id="taco-birria"></div>
            <p>Tacos de Birria</p>
            </section>

            <section className="productoTaco" >
            <div id="taco-bistek"></div>
            <p>Tacos de Bistek</p>
            </section>
            
            <section className="productoTaco" >
            <div id="taco-chorizo"></div>
            <p>Tacos de Chorizo</p>
            </section>

            
            <section className="productoTaco" >
            <div id="taco-cabeza"></div>
            <p>Tacos de Cabeza</p>
            </section>


        </div>  

        </>

    );
}

export default IndexPage;