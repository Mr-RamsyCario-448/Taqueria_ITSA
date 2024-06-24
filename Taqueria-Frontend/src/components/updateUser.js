import React, { useState } from 'react';
import Modal from 'react-modal';

const UpdateUser = ({ isOpen, onClose, onSubmit, oldUsername }) => {

  //encriptado de datos

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [role, setRole] = useState('Cliente'); // Default value for the role

  const handleSubmit = async () => {
    
    onSubmit(input1, input2, role);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <div className="contenedorUpdateUser">

      <div>
      <br>
      </br>
      <h3>Usuario a Modificar:</h3>
      <p className="usuarioObjetivo">{oldUsername}</p>
      
      <h2>Ingresa los nuevos datos.</h2>
      <input
        type="text"
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        placeholder="Usuario"
      />
      <br></br>
      <input
        type="text"
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        placeholder="Contraseña"
      />
      <br></br>

      <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Cliente">Cliente</option>
            <option value="Admin">Admin</option>
          </select>
          <br />

      <div className="botonesUpdate">
      <button className="botonGuardar" onClick={handleSubmit}> <span>Guardar</span></button>
      <button className="botonCancelar" onClick={onClose}> <span>Cancelar</span> </button>
      </div>
      </div>

      </div>
    </Modal>
  );
};

export default UpdateUser;
