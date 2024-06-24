// Login.js
import React, { useState } from 'react';
import axios from 'axios';

const IPBE = process.env.REACT_APP_IP_BACKEND

function Login() {
  const [user, setUsername] = useState('');
  const [passw, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {

    try {
      if (user === '' || passw === ''){
        return window.alert('Falta llenar alguno de los campos.');
      }

      const response = await axios.post('http://'+IPBE+'/api/login', {
        user,
        passw,
      });


      //genera un Token al iniciar sesion
      localStorage.setItem('token', response.data.token);

      localStorage.setItem ('userRole', response.data.rol);

      //obtenemos el nombre del usuario
      localStorage.setItem ('userName', response.data.username);

      //se busca al usuario, su rol y este se agrega a una variable en localStorage
      //const userRoleReq = await fetch(`http://54.160.176.26//searchuser/${user}`);

      
      //ocalStorage.setItem('userRole', userRole);


      if (response && response.data) {
        setMessage(response.data.message);
        //window.alert('Inicio de sesion correcto!');
        return window.location.href = '/'; }
        
      else {setMessage('Error: Respuesta inválida del servidor');}
    } catch (error) { setMessage("Error de Servidor, intente de nuevo mas tarde."); }
  };

  const gotoRegister = () => {
    window.location.href = '/register'
  };

  const gotoMain = () => {
    window.location.href='/';
  }
  
  /*Agregar despues:
  Al entrar al sitio web se haga un auto click en Usuario.*/
  return (
    <div className="contenedorLogin">
      <div>
        <h1>Ingrese sus datos.</h1>
        <input
          id='inputUsuario'
          type="text"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={passw}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button className="commonButton" onClick={handleLogin}>Iniciar sesión</button>
        <br></br>
        <span>No tienes cuenta?</span>
        <br></br>
        <button className="commonButton" onClick={gotoRegister}>Registrarse</button>
        <br></br>
        <button className='commonButton' onClick={gotoMain}>Cancelar</button>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Login;
