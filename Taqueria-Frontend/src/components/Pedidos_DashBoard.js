//import React from "react";
import React, { useState, useEffect } from "react";

const IPBE = process.env.REACT_APP_IP_BACKEND

function Pedidos_DashBoard(){

    //update pedidos stuff

    const [pedidosData, setPedidosData] = useState([]);

    //Obtener datos
    const fetchData = async () => {
        try {
            // Perform API call to fetch data from MongoDB Atlas
            const response = await fetch("http://"+IPBE+"/api/pedidos");
            const data = await response.json();
            // Update state with fetched data
            setPedidosData(data);
            //console.log(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    //obtener datos de la coleccion de mongoatlas
    useEffect(() => {
        // Fetch data from MongoDB Atlas collection
        fetchData();
    }, []);

    //logica de token
    const isAuthenticated = localStorage.getItem('token');

    const userName = localStorage.getItem('userName');

    const userRole = localStorage.getItem('userRole');

    //debido a que es la ventana principal, solamente cambia el
    //boton de Iniciar o Cerrar Sesion.

    //log out
    const logOut = () => {
        alert("Sesion cerrada.")
        window.location.href = '/';
        //esto destruye el token
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
    };

    var botonSesion = "Cerrar";
    //preguntamos si tiene el token de inicio de sesion.

    if(!isAuthenticated)
        window.location.href = '/login';

    if(isAuthenticated && userRole !== 'Admin'){
        window.location.href = '/';
    }

    
    //dar formato a lo de pedidos

    //cuantos tacos
    //const cuantostacos = pedidosData;

    //de que son
    //const tipostacos = pedidosData.select_tipos;
    
    //console.log(cuantostacos);

    const deletePedido = async (id_pedido) => {

        //const id_pedido_f = "ObjectID('"+id_pedido+"')";
        //console.log(id_pedido_f);
        if (window.confirm('Eliminar el pedido con ID: '+id_pedido+'?')) {
            try {
                // Perform API call to delete user
                await fetch(`http://"+IPBE+"/api/delpedido/${id_pedido}`, {
                    method: "DELETE",
                });
                // Refetch data after deletion
                fetchData();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
          }
          else {
                console.log('canceled')
          }
    };

    const marcarPedido = async (id_ped,estadoAct)  => {
        var confirm = window.confirm('Confirmar pedido pagado y entregado?')

        if (confirm === false){
            return null;
        }
        try {

            const response = await fetch(`http://"+IPBE+"/api/updatePedidoCompletado/${id_ped}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify()
            });
            const data = await response.json();
    
            if (response.ok) {
              console.log(data.message); // User updated successfully
              window.alert('Pedido marcado como completado!');
              fetchData();
            } else {
              console.error(data.message); // User not found or Internal server error
            }
          } catch (error) {
            console.error('Error updating pedido:', error);
          }
        }; 
    

    return(
        <>
        <nav className="barraNavegacion">
            <a href="/">Inicio</a>
            <a href="/dashboard">Usuarios</a>
            <a href="/pedidos_entregados">Pedidos Entregados</a>
            <a href="#" onClick={logOut}>{botonSesion} Sesión</a>
            
            <a className="contPerfilUsuario"> <img></img> <span>Hola, {userName}!</span></a>
        </nav>
        <div className="contenedorIndex">
        <h1>PEDIDOS PENDIENTES</h1>
        </div>

        <div className="pedidosFondo">
        <table className="tablaUsuarios">

                    <thead>       
                        <tr>
                           {/* <th>ID Pedido</th>*/}
                            <th>ID Pedido</th>
                            <th>Nombre de Cliente</th>
                            <th>Pedido</th>
                            <th>Notas</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                {pedidosData.map((pedido) => (
                    pedido.estado !== 'entregado' && (
                            <tr className="filaUsers" key={pedido.nombre_cliente}>
                                {/*<td>{pedido.id}</td>*/}
                                {/*por cada pasada que da el script se suma +1 */}
                                <td>{pedido._id}</td>
                                <td>{pedido.datosUsuario.nombre_cliente}</td>
                                {/*Esto mappea automaticamente los datos.*/}
                                <td className="tacos">
                                    {pedido.selects_cuantos.map((cuantos, index) => (
                                        <div key={index}>
                                            {cuantos} {pedido.selects_tipo[index]}
                                        </div>
                                    ))}
                                </td>
                                
                                <td>{pedido.datosUsuario.notas}</td>
                                <td>{pedido.estado}</td>
                                <td className="optionButtons">
                                    <button className="botonEliminar" onClick={() => deletePedido(pedido._id)} > <span>Eliminar</span> </button>
                                    <button className="botonAprobar" onClick={() => marcarPedido(pedido._id, pedido.estado)} > <span>Eliminar</span> </button>
                                </td>
                            </tr>
                        )
                    ))}
                </tbody>

            </table>
    
            </div>                         
        </>
    );
}

export default Pedidos_DashBoard;
