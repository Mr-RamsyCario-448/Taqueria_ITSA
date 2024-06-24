import React, { useState } from 'react';
const bcrypt = require('bcryptjs');
const saltRounds = 10; // Number of salt rounds for bcrypt hashing

const IPBE = process.env.REACT_APP_IP_BACKEND

const InsertUser = () => {

    //logica de token
    const isAuthenticated = localStorage.getItem('token');

    const isAdmin = localStorage.getItem('userRole');

    const userName = localStorage.getItem('userName');

    //preguntamos si tiene el token de inicio de sesion.
    if(isAuthenticated){
        console.log('token given!')
    }
    else{
        window.location.href = '/login';
    }

    const backtoDashBoard = async => {
        window.location.href = '/dashboard';
    };

    const [formData, setFormData] = useState({
        user: '',
        passw: '',
        role: 'Cliente' // Valor por defecto para el campo
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            // Hash the password
            const hashedPassword = await bcrypt.hash(formData.passw, saltRounds);
            formData.passw = hashedPassword;

            const response = await fetch('http://'+IPBE+'/api/insertUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                if(response.status === 201){
                    alert('Usuario ya existente.')
                }
                else{
                    alert('Usuario insertado correctamente.');
                }
            } else {
                alert('Error inserting data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error inserting data');
        }
    };

    //log out
    const logOut = async => {
        alert("Sesion cerrada.")
        window.location.href = '/';
        //esto destruye el token
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
    };

    var botonSesion = "Iniciar Sesion";
    //preguntamos si tiene el token de inicio de sesion.
    if(isAuthenticated)
        //console.log('token given!')
        var botonSesion = "Cerrar Sesion";

    if(!isAuthenticated)
        window.location.href = '/login';
    
    if(isAuthenticated && isAdmin !== 'Admin'){
            window.location.href = '/';
        }
    
    //debido a que es la ventana principal, solamente cambia el
    //boton de Iniciar o Cerrar Sesion.

    return (
        <>

        <nav className="barraNavegacion">
            <a href="/">Inicio</a>
            <a href="/pedidos">Pedidos</a>
            <a href="#" onClick={logOut}>{botonSesion}</a>
        </nav>

        <div className="contenedorinsertUser">
            <h1>Insertar nuevo usuario</h1>
            <form onSubmit={handleSubmit}>
                <input placeholder="Usuario" type="text" id="user" user="user" value={formData.user} onChange={handleInputChange} required /><br /><br />
                <input placeholder="Contraseña" type="text" id="passw" user="passw" value={formData.passw} onChange={handleInputChange} required /><br /><br />

                <label htmlFor="role">Rol:</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="Cliente">Cliente</option>
                        <option value="Admin">Admin</option>
                    </select><br /><br />

                <button className="commonButton" type="submit">Registrar usuario</button>
            </form>
        <button className="commonButton" onClick={backtoDashBoard}>Regresar a Dashboard</button>
        </div>
        </>
    );
};

export default InsertUser;
