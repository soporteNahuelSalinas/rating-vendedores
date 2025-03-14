document.addEventListener('DOMContentLoaded', () => {
    const formVendedor = document.getElementById('formVendedor');
    const nombreVendedorInput = document.getElementById('nombreVendedor');

    if (!formVendedor) return;

    formVendedor.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userEmail = localStorage.getItem('userEmail');
        const nombreVendedor = nombreVendedorInput.value.trim();

        if (!userEmail) {
            alert('Usuario no autenticado');
            return;
        }

        if (!nombreVendedor) {
            alert('Por favor ingrese un nombre para el vendedor');
            return;
        }

        const webhookUrl = 'https://stingray-poetic-likely.ngrok-free.app/webhook/5dc63d94-c51d-4fef-b054-8a07126fc033';

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userEmail: userEmail,
                    nombreVendedor: nombreVendedor
                })
            });

            if (!response.ok) throw new Error('Error en la creación');

            const result = await response.json();

            if (result.success) {
                actualizarListaVendedores(nombreVendedor);
                nombreVendedorInput.value = '';
                alert('Vendedor creado exitosamente!');
            } else {
                throw new Error(result.error || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error al crear vendedor:', error);
            alert(`Error al crear vendedor: ${error.message}`);
        }
    });

    function actualizarListaVendedores(nuevoVendedor) {
        const lista = document.getElementById('listaVendedores');
        if (!lista) return;

        // Verificar si ya existe en la lista
        const existe = Array.from(lista.children).some(li =>
            li.textContent.toLowerCase() === nuevoVendedor.toLowerCase()
        );

        if (!existe) {
            const li = document.createElement('li');
            li.textContent = nuevoVendedor;
            lista.appendChild(li);
        }
    }
});