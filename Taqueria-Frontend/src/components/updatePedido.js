import React, { useState } from 'react';
import Modal from 'react-modal';

const UpdatePedido = ({ isOpen, onClose, onSubmit, id_pedidoMod }) => {

  //encriptado de datos


    //logica para agregar elementos para el pedido
    const [selects_cuantos, setSelects_cuantos] = useState([0]);
    const [selects_tipo, setSelects_tipo] = useState([0]);

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
                [e.target.name]: e.target.value
            });
        }
    };


    const addSelect = () => {
        setSelects_cuantos([...selects_cuantos, selects_cuantos.length]);
        setSelects_tipo([...selects_tipo, selects_tipo.length]);
    };
   
    const [datosUsuario, setDatosForm] = useState({
        nombre_cliente: 'Invitado',//Valor: 'Invitado' por defecto
        notas: ''
    });




  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const handleSubmit = async () => {
    
    onSubmit(input1, input2);
    onClose();
  };


  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <div className="contenedorUpdatePedido">

      <div>
      <br>
      </br>
      <h3>ID Del pedido:</h3>
      <p className="pedidoObjetivo">{id_pedidoMod}</p>
      
      <h2>Ingresa los nuevos datos.</h2>
   

        <section class="selector-tacos-modal">
                    <div className='select-cuantos-tacos-modal' id=''>
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

      <br></br>
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

export default UpdatePedido;
