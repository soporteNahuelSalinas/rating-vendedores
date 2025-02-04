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

// Elementos para el modal del número de teléfono
const phoneModal = document.getElementById('phone-modal');
const phoneInput = document.getElementById('phone-input');
const confirmPhoneBtn = document.getElementById('confirm-phone-btn');
const closePhoneModalBtn = document.getElementById('close-phone-modal-btn');

// Variables para seguimiento
let nivelSeleccionado = null;
let itemSeleccionado = null;
let timeoutId = null; // Control del timeout automático

// Función para mostrar el modal con el contenido específico según el nivel
function mostrarModal(nivel) {
    // Cancelar timeout anterior si existe
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }

    nivelSeleccionado = nivel;
    const { title, items } = preguntas[nivel];

    // Configurar contenido del modal: título y opciones
    modalTitle.textContent = title;
    modalItems.innerHTML = items
        .map((item, index) =>
            `<div>
                <input type="radio" id="item-${index}" name="item" value="${item}">
                <label for="item-${index}">${item}</label>
            </div>`
        )
        .join('');
    
    // Ocultar el botón de enviar hasta que se seleccione un ítem
    sendBtn.classList.add('hidden');
    closeBtn.classList.remove('hidden');
    modal.classList.add('visible');

    // Configurar timeout para envío automático después de 50 segundos
    timeoutId = setTimeout(() => {
        modal.classList.remove('visible');
        enviarDatos();
    }, 50000);
}

// Función para enviar los datos al webhook
function enviarDatos(telefono = null) {
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }

    // Se incluye la sucursal junto con los demás datos
    const data = {
        vendedor: vendedorSeleccionado,
        sucursal: sucursalSeleccionada,
        nivel: nivelSeleccionado,
        aspecto: itemSeleccionado,
        telefono: telefono
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.text();
    })
    .then(text => {
        console.log('Respuesta del servidor:', text);
        mostrarAgradecimiento();
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        mostrarAgradecimiento();
    });

    // Resetear variables de seguimiento
    nivelSeleccionado = null;
    itemSeleccionado = null;
}

// Función para mostrar mensaje de agradecimiento
function mostrarAgradecimiento() {
    modalTitle.textContent = '¡Gracias por tu feedback!';
    modalItems.innerHTML = '';
    sendBtn.classList.add('hidden');
    closeBtn.classList.add('hidden');
    modal.classList.add('visible');

    setTimeout(() => {
        modal.classList.remove('visible');
    }, 3000);
}

// Listener para cada botón de nivel de atención
ratingButtons.forEach(button => {
    button.addEventListener('click', () => {
        const nivel = button.getAttribute('data-rating');
        mostrarModal(nivel);
    });
});

// Listener para cerrar el modal manualmente
closeBtn.addEventListener('click', () => {
    modal.classList.remove('visible');
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
});

// Listener para la selección de ítem en el modal
modalItems.addEventListener('change', event => {
    if (event.target.name === 'item') {
        itemSeleccionado = event.target.value;
        sendBtn.classList.remove('hidden');
    }
});

// Listener para el botón de enviar: mostrar modal para ingresar el teléfono
sendBtn.addEventListener('click', () => {
    phoneModal.classList.add('visible');
});

// Confirmar número de teléfono y enviar datos
confirmPhoneBtn.addEventListener('click', () => {
    const telefono = phoneInput.value.trim() || null;
    phoneInput.value = ''; // Limpiar campo
    phoneModal.classList.remove('visible');
    modal.classList.remove('visible');
    enviarDatos(telefono);
});

// Cerrar modal de teléfono y enviar datos sin confirmación adicional
closePhoneModalBtn.addEventListener('click', () => {
    const telefono = phoneInput.value.trim() || null;
    phoneInput.value = ''; // Limpiar campo
    phoneModal.classList.remove('visible');
    modal.classList.remove('visible');
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