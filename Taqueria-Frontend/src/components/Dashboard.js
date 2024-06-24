//import React from "react";
import React, { useState, useEffect } from "react";
import UpdateUser from "./updateUser";

const IPBE = process.env.REACT_APP_IP_BACKEND

const bcrypt = require('bcryptjs');
const saltRounds = 10; // Number of salt rounds for bcrypt hashing


function Dashboard(){
    
    //buscar usuarios
    const buscaUsuario = async () => {
        //si no hay nombre escrito manda un alerta
        if (userSearch === ''){
            return window.alert('Escriba un usuario a buscar.');
        }

        try {
            //console.log('pro:'+userSearch)
            // Perform API call to fetch data from MongoDB Atlas
            const response = await fetch(`http://`+IPBE+`/api/searchuser/${userSearch}`);
            const data = await response.json();
            //si no encuentra coincidencias no se actualiza la tabla
            //console.log(data.length);
            if (data.length === undefined )
                return window.alert('No se encontraron coincidencias!');
            else
                // Update state with fetched data
                setUserData(data);
                

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const [userSearch, setSearchUser] = useState('');

    //logica de token
    const isAuthenticated = localStorage.getItem('token');

    const isAdmin = localStorage.getItem('userRole');

    const userName = localStorage.getItem('userName');

    if(!isAuthenticated){
        window.location.href = '/login'
    }

    //preguntamos si tiene el token de inicio de sesion.
    if(isAuthenticated && isAdmin === 'Admin'){
        //console.log('token given!')
        var botonSesion = "Cerrar Sesion";
    }
    else{
        window.location.href = '/';
    }

    //pop up para modificar datos
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModalUsers = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitUpdate = async (user, passw, role) => {
        const requestBody = {
          user,
          passw,
          role
        };
    try {
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(requestBody.passw, saltRounds);
        requestBody.passw = hashedPassword;

        const response = await fetch(`http://`+IPBE+`/api/updateUser/${oldUserName}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
  
        const data = await response.json();

        if (response.ok) {
          console.log(data.message); // User updated successfully
          window.alert('Usuario actualizado correctamente!');
          fetchData();
        } else {
          console.error(data.message); // User not found or Internal server error
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    };

    const [userData, setUserData] = useState([]);
    const [oldUserName, setOldUserName] = useState([]);

    //obtener datos de la coleccion de mongoatlas
    useEffect(() => {
        // Fetch data from MongoDB Atlas collection
        fetchData();
    }, []);


    //Obtener datos
    const fetchData = async () => {
        try {
            // Perform API call to fetch data from MongoDB Atlas
            const response = await fetch("http://"+IPBE+"/api/users");
            const data = await response.json();
            // Update state with fetched data
            setUserData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    //log out
    const logOut = async => {
        alert("Sesion cerrada.")
        window.location.href = '/';
        //esto destruye el token
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
    };

    //cambio de ventana para nuevo usuario
    const createUser = () => {
        window.location.href = '/insertUser';
    };

    //borrar usuario
    const deleteUser = async (user) => {

        if (window.confirm('Eliminar a '+user+'?')) {
            try {
                // Perform API call to delete user
                await fetch(`http://`+IPBE+`/api/deluser/${user}`, {
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
    //update
    const updateUser = (username) => {
        setOldUserName(username);
        handleOpenModalUsers();
    };

    return(
        <>
        <nav className="barraNavegacion">
            <a href="/">Inicio</a>
            <a href="/pedidos">Pedidos</a>
            <a href="#" onClick={logOut}>{botonSesion}</a>
            
            <a className="contPerfilUsuario"> <img></img> <span>Hola, {userName}!</span></a>
        </nav>

        <section>
        <div className="contenedorDashboard">
        <input
          type="text"
          placeholder="Usuario"
          value={userSearch}
          onChange={(e) => setSearchUser(e.target.value)}
        />
        <section>
        <button
        className="commonButton"
        onClick={buscaUsuario}>
            Buscar
            </button>

            <button
        className="commonButton"
        onClick={fetchData}>
            Mostrar todos
            </button>
   
        </section>

        <table className="tablaUsuarios">
                    <thead>
                        
                        <tr>
                            <th>User</th>
                            <th>Password</th>
                            <th>Tipo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((user) => (
                            <>
                            <tr className="filaUsers" key={user.user}>
                                <td>{user.user}</td>
                                <td>{user.passw}</td>
                                <td>{user.role}</td>
                                <td className="optionButtons">
                                    <button className="botonModificar" onClick={() => updateUser(user.user)}> <span>Modificar</span> </button>
                                    <button className="botonEliminar" onClick={() => deleteUser(user.user)}> <span>Eliminar</span> </button>
                                </td>
                            </tr>
                            
                            </>
                        ))
                        }
                    </tbody>
        <>
        <button className="botonAgregar" onClick={createUser}> <span>Crear nuevo usuario</span> </button>
        </>            
        </table>
                                    <UpdateUser
                                        isOpen={isModalOpen}
                                        onClose={handleCloseModal}
                                        onSubmit={handleSubmitUpdate}
                                        oldUsername={oldUserName}
                                    />
        {//<button className="commonButton" onClick={logOut}>Cerrar Sesion</button>}
    }
        </div>
        </section>
        
        </>
    );
}

export default Dashboard;
