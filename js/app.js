// URL del webhook Make
// const webhookUrl = 'https://hook.us2.make.com/on9f0exvo1qz6qbg2f98h7c9nyt2x04n';
// URL del webhook N8N
const webhookUrl = 'https://stingray-poetic-likely.ngrok-free.app/webhook/ef94cc20-fa5b-4f95-bbff-860305006c70';

// Preguntas para cada nivel de atención
const preguntas = {
    Buena: {
        title: '¿Qué aspecto de la atención te pareció el más destacado?😎',
        items: [
            '🔋Rapidez en la atención',
            '🙋Disposición a la atención',
            '🧠Conocimiento técnico',
            '💯Capacidad de resolución',
            '🤝Amabilidad, empatía',
            '⚙️Asesoramiento técnico'
        ]
    },
    Normal: {
        title: '¿Qué aspecto sugerirías mejorar?🙏',
        items: [
            '🔋Atención más rápida',
            '🧠Conocimientos del producto',
            '💰Conocer las financiaciones',
            '✋Mayor predisposición',
            '🤝Amabilidad y empatía'
        ]
    },
    Mala: {
        title: '¿Qué aspecto sugerirías mejorar?🙏',
        items: [
            '🔋Atención más rápida',
            '🧠Conocimientos del producto',
            '💰Conocer las financiaciones',
            '✋Mayor predisposición',
            '🤝Amabilidad y empatía'
        ]
    }
};

// Nuevas constantes para categorías y fuentes
const categorias = [
    'Productos de San Valentín',
    'Productos de Ezviz',
    'Productos de Notebooks',
    'Productos de Ventilación',
    'Otro'
];

const fuentes = [
    'WhatsApp',
    'Facebook',
    'Instagram',
    'YouTube',
    'Google (búsquedas o anuncios)',
    'Carteles o Banners en la ciudad',
    'Auto Parlante',
    'Correo Electrónico',
    'Tienda Online', 
    'Sucursal Física',
    'Recomendación del vendedor',
    'Otro'
];

// Obtener elementos del DOM
const ratingButtons = document.querySelectorAll('.rating-btn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalItems = document.getElementById('modal-items');
const sendBtn = document.getElementById('send-btn');
const closeBtn = document.getElementById('close-btn');

// Recuperar datos almacenados en localStorage: vendedor y sucursal
const vendedorSeleccionado = localStorage.getItem('vendedorSeleccionado') || 'Vendedor No Seleccionado';
const sucursalSeleccionada = localStorage.getItem('sucursalSeleccionada') || 'Sucursal No Seleccionada';

// Elementos para los nuevos modales
const brandModal = document.getElementById('brand-modal');
const brandItems = document.getElementById('brand-items');
const brandNextBtn = document.getElementById('brand-next-btn');
const closeBrandBtn = document.getElementById('close-brand-btn');

const sourceModal = document.getElementById('source-modal');
const sourceItems = document.getElementById('source-items');
const sourceNextBtn = document.getElementById('source-next-btn');
const closeSourceBtn = document.getElementById('close-source-btn');

// Elementos para el modal del número de teléfono
const phoneModal = document.getElementById('phone-modal');
const phoneInput = document.getElementById('phone-input');
const confirmPhoneBtn = document.getElementById('confirm-phone-btn');
const closePhoneModalBtn = document.getElementById('close-phone-modal-btn');

// Variables para seguimiento
let nivelSeleccionado = null;
let itemSeleccionado = null;
let marcaSeleccionada = null;
let fuenteSeleccionada = null;
let inactivityTimer = null; // Timer global para inactividad

// Función que cierra los modales abiertos y envía los datos (forzado)
function cerrarModalesPorInactividad() {
    if (modal.classList.contains('visible')) modal.classList.remove('visible');
    if (brandModal.classList.contains('visible')) brandModal.classList.remove('visible');
    if (sourceModal.classList.contains('visible')) sourceModal.classList.remove('visible');
    if (phoneModal.classList.contains('visible')) phoneModal.classList.remove('visible');
    const tel = phoneInput.value.trim() || null;
    enviarDatos(tel, true);
}

// Inicia el timer de inactividad (60 seg)
function iniciarInactividad() {
    cancelarInactividad();
    inactivityTimer = setTimeout(() => {
         cerrarModalesPorInactividad();
    }, 60000);
}

// Cancela el timer de inactividad
function cancelarInactividad() {
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }
}

// Muestra el modal según el nivel seleccionado
function mostrarModal(nivel) {
    cancelarInactividad();

    nivelSeleccionado = nivel;
    const { title, items } = preguntas[nivel];

    modalTitle.textContent = title;
    modalItems.innerHTML = items
        .map((item, index) =>
            `<div>
                <input type="radio" id="item-${index}" name="item" value="${item}">
                <label for="item-${index}">${item}</label>
            </div>`
        )
        .join('');
    
    sendBtn.classList.add('hidden');
    closeBtn.classList.remove('hidden');
    modal.classList.add('visible');

    iniciarInactividad();
}

// Muestra el modal de selección de categoría (marcas)
function mostrarBrandModal() {
    cancelarInactividad();
    brandItems.innerHTML = `
        <label for="brand-select">Selecciona una categoría:</label>
        <select id="brand-select">
            <option value="" disabled selected>Seleccioná</option>
            ${categorias.map(categoria => `<option value="${categoria}">${categoria}</option>`).join('')}
        </select>
    `;
    brandModal.classList.add('visible');

    document.getElementById('brand-select').addEventListener('change', function () {
        marcaSeleccionada = this.value;
        cancelarInactividad();
        iniciarInactividad();
    });
    iniciarInactividad();
}

// Muestra el modal de selección de fuente
function mostrarSourceModal() {
    cancelarInactividad();
    sourceItems.innerHTML = `
        <select id="source-select">
            <option value="" disabled selected>Selecciona una opción</option>
            ${fuentes.map(fuente => `<option value="${fuente}">${fuente}</option>`).join('')}
        </select>
    `;
    sourceModal.classList.add('visible');

    document.getElementById('source-select').addEventListener('change', function () {
        fuenteSeleccionada = this.value;
        cancelarInactividad();
        iniciarInactividad();
    });
    iniciarInactividad();
}

// Muestra el modal para ingresar el teléfono
function mostrarPhoneModal() {
    cancelarInactividad();
    phoneInput.value = ''; // Limpiar campo
    phoneModal.classList.add('visible');
    iniciarInactividad();
}

// Envía los datos al webhook; si "force" es true se omite la validación
function enviarDatos(telefono = null, force = false) {
    cancelarInactividad();
    if (!force && (!marcaSeleccionada || !fuenteSeleccionada)) {
        alert('Por favor selecciona una categoría y una fuente antes de continuar.');
        return;
    }

    const data = {
        vendedor: vendedorSeleccionado,
        sucursal: sucursalSeleccionada,
        nivel: nivelSeleccionado,
        aspecto: itemSeleccionado,
        producto: marcaSeleccionada,
        fuente: fuenteSeleccionada,
        telefono: telefono
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(text => {
        console.log('Respuesta del servidor:', text);
        mostrarAgradecimiento();
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        mostrarAgradecimiento();
    });

    resetearDatos();
}

// Muestra el mensaje de agradecimiento
function mostrarAgradecimiento() {
    cancelarInactividad();
    modalTitle.textContent = '¡Gracias por tu feedback!';
    modalItems.innerHTML = '';
    sendBtn.classList.add('hidden');
    closeBtn.classList.add('hidden');
    modal.classList.add('visible');

    setTimeout(() => {
        modal.classList.remove('visible');
    }, 3000);
}

// Resetea los datos de seguimiento
function resetearDatos() {
    nivelSeleccionado = null;
    itemSeleccionado = null;
    marcaSeleccionada = null;
    fuenteSeleccionada = null;
    phoneInput.value = '';

}

// ====================
// Listeners de eventos
// ====================

// Botones de nivel de atención
ratingButtons.forEach(button => {
    button.addEventListener('click', () => {
        cancelarInactividad();
        const nivel = button.getAttribute('data-rating');
        mostrarModal(nivel);
    });
});

// Cierre manual del modal de nivel
closeBtn.addEventListener('click', () => {
    cancelarInactividad();
    modal.classList.remove('visible');
    enviarDatos(null, true);
});

// Selección de ítem en el modal de nivel
modalItems.addEventListener('change', event => {
    cancelarInactividad();
    if (event.target.name === 'item') {
        itemSeleccionado = event.target.value;
        sendBtn.classList.remove('hidden');
        iniciarInactividad();
    }
});

// Botón para enviar (pasar al modal de categorías)
sendBtn.addEventListener('click', () => {
    cancelarInactividad();
    modal.classList.remove('visible');
    mostrarBrandModal();
});

// Siguiente en modal de marcas
brandNextBtn.addEventListener('click', () => {
    cancelarInactividad();
    const selectedBrand = document.getElementById('brand-select');
    if (selectedBrand && selectedBrand.value !== "") {
        marcaSeleccionada = selectedBrand.value;
        brandModal.classList.remove('visible');
        mostrarSourceModal();
    } else {
        alert('Por favor selecciona una categoría');
        iniciarInactividad();
    }
});

// Cierre manual del modal de marcas
closeBrandBtn.addEventListener('click', () => {
    cancelarInactividad();
    brandModal.classList.remove('visible');
    enviarDatos(null, true);
});

// Siguiente en modal de fuentes
sourceNextBtn.addEventListener('click', () => {
    cancelarInactividad();
    const selectedSource = document.getElementById('source-select');
    if (selectedSource && selectedSource.value !== "") {
        fuenteSeleccionada = selectedSource.value;
        sourceModal.classList.remove('visible');
        mostrarPhoneModal();
    } else {
        alert('Por favor selecciona una opción');
        iniciarInactividad();
    }
});

// Cierre manual del modal de fuentes
closeSourceBtn.addEventListener('click', () => {
    cancelarInactividad();
    sourceModal.classList.remove('visible');
    enviarDatos(null, true);
});

// Confirmación del teléfono y envío de datos
confirmPhoneBtn.addEventListener('click', () => {
    cancelarInactividad();
    const telefono = phoneInput.value.trim() || null;
    phoneInput.value = ''; // Limpiar campo
    phoneModal.classList.remove('visible');
    enviarDatos(telefono);
});

// Cierre manual del modal de teléfono y envío de datos sin confirmar
closePhoneModalBtn.addEventListener('click', () => {
    cancelarInactividad();
    const telefono = phoneInput.value.trim() || null;
    phoneInput.value = ''; // Limpiar campo
    phoneModal.classList.remove('visible');
    enviarDatos(telefono);
});

/* Mantener la pantalla encendida */
let wakeLock = null;
async function activarWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock activado');
    } catch (err) {
        console.error('Error al activar el Wake Lock:', err);
    }
}
activarWakeLock();
