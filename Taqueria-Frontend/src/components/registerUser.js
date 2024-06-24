import React, { useState } from 'react';
const bcrypt = require('bcryptjs');
const saltRounds = 10; // Number of salt rounds for bcrypt hashing
const IPBE = process.env.REACT_APP_IP_BACKEND

const RegisterUser = () => {

    const [formData, setFormData] = useState({
        user: '',
        passw: '',
        role: 'Cliente'
        //es la pagina de registro para usuarios por lo tanto se le debe asignar rol cliente por defecto
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
                    alert('Este usuario ya existe.')
                }
                else{
                    alert('Registro correcto!');
                }
            } else {
                alert('Hubo un error al registrarse. Intente mas tarde.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al registrarse. Intente mas tarde.');
        }
    };

    const showPassword = () => {
        var passwordInput = document.getElementById('passw');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
        
    };

    const returntoLogin = () => {
        window.location = '/';
    }

    

    return (
        <div className="contenedorRegistroUser">
            
            <form onSubmit={handleSubmit}>
                <h1>Registrarse</h1>
                <div>
                <input placeholder="Usuario" type="text" id="user" user="user" value={formData.user} onChange={handleInputChange} required />
                <button style={{visibility:'hidden'}} ></button>
                </div>

                <div>
                <input placeholder="Contraseña" type="password" id="passw" user="passw" value={formData.passw} onChange={handleInputChange} required />
                <button className="botonMostrarPW" type="button" onClick={showPassword}></button>
                </div>

                <button className="commonButton" type="submit">Registrarse</button>
                <br></br>
                <button className="regresaraLogin" type="button" onClick={returntoLogin}>Cancelar</button>
            </form>
        </div>
    );
};

export default RegisterUser;
