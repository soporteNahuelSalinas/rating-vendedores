console.log('app.js cargado');

// Si estamos en la página de selección (index.html)
if (window.location.pathname.includes('')) {
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
}