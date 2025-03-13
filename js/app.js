// URL del webhook Make
// const webhookUrl = 'https://hook.us2.make.com/xmayxoy1jlf2pjpvwf6b2wmio99w5wcf';
// URL del webhook N8N
const webhookUrl = 'https://stingray-poetic-likely.ngrok-free.app/webhook/ef94cc20-fa5b-4f95-bbff-860305006c70';

// Preguntas para cada nivel de atención
const preguntas = {
    Buena: {
        title: '¿Qué aspecto de la atención te pareció el más destacado?😎',
        items: [
            '🔋Rapidez en la atención',
            '🙋Disposición a la atención',
            // '🧠Conocimiento técnico',
            '💯Capacidad de resolución',
            '🤝Amabilidad, empatía',
            '⚙️Asesoramiento/Conocimiento técnico'
        ]
    },
    Normal: {
        title: '¿Qué aspecto sugerirías mejorar?🙏',
        items: [
            '🔋Atención más rápida',
            '🧠Conocimientos del producto',
            '💰Conocer las financiaciones',
            '✋Mayor predisposición',
            '🤝Amabilidad y empatía',
            '😐No veo oportunidad de mejora'
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
    'Liquidación Verano',
    'Vuelta a Clases',
    'Productos de Ezviz',
    'Productos de Notebooks',
    'Productos de Ventilación',
    'Otro'
];

const fuentes = [
    'Recomendación del vendedor',
    'Tienda En Línea de Anyway',
    'Sucursal Física',
    'Redes Sociales [Facebook, Instagram]',
    'Medios Digitales [Google, YouTube]', 
    'WhatsApp [Estados, Mensajes]',
    'Auto Parlante',
    'Carteles y Pasacalles',
    'Correo Electrónico',
    'Radio',    
    'Otro'
];

// Obtener elementos del DOM
const ratingButtons = document.querySelectorAll('.rating-btn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalItems = document.getElementById('modal-items');
const sendBtn = document.getElementById('send-btn');
const closeBtn = document.getElementById('close-btn');
const header = document.querySelector('header');

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
// Variable para almacenar el teléfono ingresado (para opción "Mala")
let telefonoIngresado = null;

// Crear el mensaje con el vendedor seleccionado
const mensajeCalificacion = `<h1>¡No olvides calificar a ${vendedorSeleccionado}!</h1>`;

// Insertar el mensaje en el header
if (header) {
    header.innerHTML = mensajeCalificacion;
}

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

// Muestra el modal según el nivel seleccionado (se usa para Buena, Normal y para "Mala" luego del teléfono)
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
    // Oculta el botón "Siguiente" del modal de marcas
    if (brandNextBtn) {
        brandNextBtn.style.display = 'none';
    }
    brandModal.classList.add('visible');

    document.getElementById('brand-select').addEventListener('change', function () {
        if (this.value) {
            marcaSeleccionada = this.value;
            cancelarInactividad();
            brandModal.classList.remove('visible');
            mostrarSourceModal();
        }
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
    // Oculta el botón "Siguiente" del modal de fuentes
    if (sourceNextBtn) {
        sourceNextBtn.style.display = 'none';
    }
    sourceModal.classList.add('visible');

    document.getElementById('source-select').addEventListener('change', function () {
        if (this.value) {
            fuenteSeleccionada = this.value;
            cancelarInactividad();
            sourceModal.classList.remove('visible');
            mostrarPhoneModal();
        }
    });
    iniciarInactividad();
}

// Muestra el modal para ingresar el teléfono
function mostrarPhoneModal() {
    cancelarInactividad();
    phoneInput.value = ''; // Limpiar campo
    phoneModal.classList.add('visible');
    closePhoneModalBtn.style.display = 'none';
    iniciarInactividad();
}

// Envía los datos al webhook; si "force" es true se omite la validación
function enviarDatos(telefono = null, force = false) {
    cancelarInactividad();
    if (!force && nivelSeleccionado !== 'Mala' && (!marcaSeleccionada || !fuenteSeleccionada)) {
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
    telefonoIngresado = null;
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
        // Si la calificación es "Mala", se salta el modal de preguntas y se pide el teléfono directamente.
        if (nivel === 'Mala') {
            nivelSeleccionado = nivel;
            mostrarPhoneModal();
        } else {
            mostrarModal(nivel);
        }
    });
});

// Cierre manual del modal de nivel
closeBtn.addEventListener('click', () => {
    cancelarInactividad();
    modal.classList.remove('visible');
    enviarDatos(null, true);
});

// Al seleccionar un ítem en el modal de nivel, se salta automáticamente a la siguiente etapa
modalItems.addEventListener('change', event => {
    cancelarInactividad();
    if (event.target.name === 'item') {
        itemSeleccionado = event.target.value;
        modal.classList.remove('visible');
        // Para "Mala" se envían los datos directamente usando el teléfono guardado,
        // mientras que en otros niveles se continúa al modal de categoría.
        if (nivelSeleccionado === 'Mala') {
            enviarDatos(telefonoIngresado);
        } else {
            mostrarBrandModal();
        }
    }
});

// (Se mantiene el listener del btn de enviar como respaldo, aunque ya no es necesario)
sendBtn.addEventListener('click', () => {
    cancelarInactividad();
    modal.classList.remove('visible');
    // Si la calificación es "Mala", se salta la selección de marca y fuente y va directamente al teléfono.
    if (nivelSeleccionado === 'Mala') {
        mostrarPhoneModal();
    } else {
        mostrarBrandModal();
    }
});

// Siguiente en modal de marcas (listener mantenido como respaldo)
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

// Siguiente en modal de fuentes (listener mantenido como respaldo)
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

// Confirmación del teléfono y envío de datos o despliegue del modal de preguntas para "Mala"
confirmPhoneBtn.addEventListener('click', () => {
    cancelarInactividad();
    const telefono = phoneInput.value.trim() || null;
    // Guardar el teléfono ingresado para opción "Mala"
    telefonoIngresado = telefono;
    phoneInput.value = ''; // Limpiar campo
    phoneModal.classList.remove('visible');
    if (nivelSeleccionado === 'Mala') {
         mostrarModal('Mala');
    } else {
         enviarDatos(telefono);
    }
});

// Cierre manual del modal de teléfono y envío de datos sin confirmar o despliegue del modal de preguntas para "Mala"
closePhoneModalBtn.addEventListener('click', () => {
    cancelarInactividad();
    const telefono = phoneInput.value.trim() || null;
    // Guardar el teléfono ingresado para opción "Mala"
    telefonoIngresado = telefono;
    phoneInput.value = ''; // Limpiar campo
    phoneModal.classList.remove('visible');
    if (nivelSeleccionado === 'Mala') {
         mostrarModal('Mala');
    } else {
         enviarDatos(telefono);
    }
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