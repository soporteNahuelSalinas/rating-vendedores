// URL del webhook
const webhookUrl = 'https://hook.us2.make.com/xmayxoy1jlf2pjpvwf6b2wmio99w5wcf';

// Obtener el vendedor seleccionado desde el localStorage
const vendedorSeleccionado = localStorage.getItem('vendedorSeleccionado');

// Obtener el elemento para mostrar mensajes
const mensajeDisplay = document.getElementById('mensaje-display');

console.log('app.js cargado');

// Si estamos en la página de selección
if (window.location.pathname.includes('index.html')) {
    console.log('Página index.html detectada');
}

// Si estamos en la página de calificación
if (window.location.pathname.includes('/pag/calificar.html')) {
    console.log('Página calificar.html detectada');
}


// Si estamos en la página de selección (index.html)
if (window.location.pathname.includes('index.html')) {
    const botonesVendedor = document.querySelectorAll('.vendedor-btn');

    // Evento para seleccionar un vendedor
    botonesVendedor.forEach(boton => {
        boton.addEventListener('click', () => {
            const vendedorId = boton.getAttribute('data-id');
            localStorage.setItem('vendedorSeleccionado', vendedorId); // Guardar vendedor en localStorage
            window.open('/pag/calificar.html', '_blank'); // Abrir en una nueva ventana
        });
    });
}

// Si estamos en la página de calificación (calificar.html)
if (window.location.pathname.includes('/pag/calificar.html')) {
    const ratingButtons = document.querySelectorAll('.rating-btn');
    const vendedorDisplay = document.getElementById('vendedor-display');

    // Mostrar el nombre del vendedor seleccionado
    if (vendedorSeleccionado) {
        vendedorDisplay.textContent = `Vendedor: ${vendedorSeleccionado}`;
    } else {
        vendedorDisplay.textContent = 'Error: No se seleccionó ningún vendedor.';
    }

    // Evento para enviar el rating al webhook
    ratingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const rating = button.getAttribute('data-rating');

            // Crear el objeto de datos
            const data = {
                vendedor: vendedorSeleccionado,
                rating: rating
            };

            // Enviar al webhook
            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                // Leer la respuesta como texto primero
                return response.text().then(text => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}, Detalles: ${text}`);
                    }

                    if (text.trim() === "Accepted") {
                        return { status: "success", message: "¡Gracias por tu calificación!" };
                    }

                    // Intenta analizar como JSON
                    try {
                        const json = JSON.parse(text);
                        return json;
                    } catch (err) {
                        return { status: "success", message: text };
                    }
                });
            })
            .then(responseData => {
                console.log('Datos enviados:', responseData);
                mensajeDisplay.textContent = responseData.message;
                mensajeDisplay.style.color = '#22c594';

                // Ocultar el mensaje después de 3 segundos
                setTimeout(() => {
                    mensajeDisplay.textContent = '';
                }, 3000);
            })
            .catch(error => {
                console.error('Error al enviar datos:', error);
                mensajeDisplay.textContent = 'Hubo un error al enviar tu calificación. Detalle: ' + error.message; // Mostrar mensaje de error
                mensajeDisplay.style.color = 'red';

                // Ocultar el mensaje después de 3 segundos
                setTimeout(() => {
                    mensajeDisplay.textContent = '';
                }, 3000);
            });
        });
    });
}