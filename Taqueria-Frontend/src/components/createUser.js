import React from "react";

function createUser(){

    const InsertUser = () => {
        const [formData, setFormData] = useState({
            user: '',
            passw: ''
        });
    }
    
    const handleInputChange = (event) => {
            const { name, value } = event.target;
            setFormData({ ...formData, [name]: value });
        };


        const handleSubmit = async (event) => {
            event.preventDefault();
            

            try {
                const response = await fetch('http://34.192.211.85/api/createUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
    
                if (response.ok) {
                    alert('Data inserted successfully');
                } else {
                    alert('Error inserting data');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error inserting data');
            }
        };

    return(
        <>
        <h1>Pagina Crear</h1>
        <div>
            <h1>Insert Data</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nombre de usuario:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required /><br /><br />
                <label htmlFor="email">Contraseña:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required /><br /><br />
                <button type="submit">Submit</button>
            </form>
        </div>

        <button onClick={logOut}>Cerrar Sesion</button>
        
        </>
    );
};

export default createUser;
