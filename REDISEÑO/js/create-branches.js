// create-branches.js
document.addEventListener('DOMContentLoaded', () => {
    const formSucursal = document.getElementById('formSucursal');
    const nombreSucursalInput = document.getElementById('nombreSucursal');
    
    if (!formSucursal) return;

    formSucursal.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userEmail = localStorage.getItem('userEmail');
        const nombreSucursal = nombreSucursalInput.value.trim();
        
        if (!userEmail) {
            alert('Usuario no autenticado');
            return;
        }
        
        if (!nombreSucursal) {
            alert('Por favor ingrese un nombre para la sucursal');
            return;
        }

        const webhookUrl = 'https://stingray-poetic-likely.ngrok-free.app/webhook/8f442cc8-0a56-4dbb-8ef3-f470086440a6';
        
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userEmail: userEmail,
                    nombreSucursal: nombreSucursal
                })
            });

            if (!response.ok) throw new Error('Error en la creación');
            
            const result = await response.json();
            
            if (result.success) {
                // Actualizar la lista de sucursales
                actualizarListaSucursales(nombreSucursal);
                nombreSucursalInput.value = ''; // Limpiar input
                alert('Sucursal creada exitosamente!');
            } else {
                throw new Error(result.error || 'Error desconocido');
            }
            
        } catch (error) {
            console.error('Error al crear sucursal:', error);
            alert(`Error al crear sucursal: ${error.message}`);
        }
    });

    function actualizarListaSucursales(nuevaSucursal) {
        const lista = document.getElementById('listaSucursales');
        if (!lista) return;

        // Verificar si ya existe en la lista
        const existe = Array.from(lista.children).some(li => 
            li.textContent.toLowerCase() === nuevaSucursal.toLowerCase()
        );

        if (!existe) {
            const li = document.createElement('li');
            li.textContent = nuevaSucursal;
            lista.appendChild(li);
        }
    }
});