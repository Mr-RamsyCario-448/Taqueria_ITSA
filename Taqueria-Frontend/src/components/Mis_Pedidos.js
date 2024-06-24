//import React from "react";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { jsPDF } from 'jspdf';

const IPBE = process.env.REACT_APP_IP_BACKEND

function Mis_Pedidos_Dashboard(){

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

    var botonSesion = "Cerrar";
    //preguntamos si tiene el token de inicio de sesion.

    if(!isAuthenticated)
        window.location.href = '/login';

    /*if(isAuthenticated && userRole !== 'Admin'){
        window.location.href = '/';
    }*/

    
    //crear funcion para imprimir

    

    const scriptRolUsuario = `

        if(${JSON.stringify(userRole)} === 'Cliente'){
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

        const imprimirTicketPedido = (pedido) => {
            if(pedido.estado === 'pendiente'){
                window.alert('Alerta: El pedido no se ha pagado o entregado.');
            }
            else{
        
                // Create a new jsPDF instance with dimensions suitable for a ticket (e.g., 80mm wide)
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: [80, 160] // Adjust the height as needed
                });

                 // Set font size and font
                const titleFontSize = 10;
                const contentFontSize = 8;
                const font = 'Helvetica';

                doc.setFont(font);
                doc.setFontSize(titleFontSize);
                
                // Calculate total number of tacos, then multiply this thing by 20
                const totalTacos = (pedido.selects_cuantos.reduce((acc, current) => acc + parseInt(current, 10), 0)) * 20;
        
                // Center text helper function
                const centerText = (text, y) => {
                    const textWidth = doc.getTextWidth(text);
                    const pageWidth = doc.internal.pageSize.getWidth();
                    const textX = (pageWidth - textWidth) / 2;
                    doc.text(text, textX, y);
                };
        
                // Add text to the PDF
                centerText(`ID Pedido: ${pedido._id}`, 10);
                centerText(`Nombre de Cliente: ${pedido.datosUsuario.nombre_cliente}`, 20);
                centerText(`Pedido:`, 30);
        
                // Add each item with its quantity and the calculated value
                doc.setFontSize(contentFontSize);
                let yPosition = 40;
                pedido.selects_cuantos.forEach((cuantos, index) => {
                    centerText(`- ${cuantos} ${pedido.selects_tipo[index]} $${cuantos * 20}`, yPosition);
                    yPosition += 10;
                });

                centerText(`Notas:`, yPosition);
                yPosition += 10;
                centerText(`${pedido.datosUsuario.notas}`, yPosition);
                yPosition += 20;
                centerText(`Total: $${totalTacos}`, yPosition);
        
                // Save the PDF
                doc.save(`Ticket_Pedido_${pedido._id}.pdf`);

            }
        }
        


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

        <h1>MIS PEDIDOS</h1>
        
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
                    //el nombre registrado en el pedido debe coincidir con el nombre de usuario
                    pedido.datosUsuario.nombre_cliente === userName && (
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
                                    <button className="botonImprimir" onClick={() => imprimirTicketPedido(pedido)} > <span>Imprimir Ticket</span> </button>
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

export default Mis_Pedidos_Dashboard;
