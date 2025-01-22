// URL del webhook
// const webhookUrl = 'https://hook.us2.make.com/xmayxoy1jlf2pjpvwf6b2wmio99w5wcf';
const webhookUrl = 'https://evolved-parrot-explicitly.ngrok-free.app/webhook/1efbdf23-d7e9-42e1-966c-a159e1e58be6';
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

// Obtener elementos
const ratingButtons = document.querySelectorAll('.rating-btn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalItems = document.getElementById('modal-items');
const sendBtn = document.getElementById('send-btn');
const closeBtn = document.getElementById('close-btn');
const vendedorSeleccionado = localStorage.getItem('vendedorSeleccionado') || 'Vendedor No Seleccionado';

// Elementos para el modal del número de teléfono
const phoneModal = document.getElementById('phone-modal');
const phoneInput = document.getElementById('phone-input');
const confirmPhoneBtn = document.getElementById('confirm-phone-btn');
const closePhoneModalBtn = document.getElementById('close-phone-modal-btn');

// Variables para seguimiento
let nivelSeleccionado = null;
let itemSeleccionado = null;

// Mostrar modal con contenido específico
function mostrarModal(nivel) {
    nivelSeleccionado = nivel;
    const { title, items } = preguntas[nivel];

    // Configurar contenido del modal
    modalTitle.textContent = title;
    modalItems.innerHTML = items
        .map((item, index) => `<div><input type="radio" id="item-${index}" name="item" value="${item}"><label for="item-${index}">${item}</label></div>`)
        .join('');
    sendBtn.classList.add('hidden');
    closeBtn.classList.remove('hidden');
    modal.classList.add('visible');

    setTimeout(() => {
        modal.classList.remove('visible');
    }, 60000);
}
// Enviar datos al webhook
function enviarDatos(telefono = null) {
    const data = {
        vendedor: vendedorSeleccionado,
        nivel: nivelSeleccionado,
        aspecto: itemSeleccionado,
        telefono: telefono
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Datos enviados con éxito:', data);
            mostrarAgradecimiento();
        })
        .catch(error => {
            console.error('Error al enviar datos:', error);
            mostrarAgradecimiento();
        });
}

// Mostrar mensaje de agradecimiento
function mostrarAgradecimiento() {
    modalTitle.textContent = '¡Gracias por tu feedback!'; // Mensaje de agradecimiento
    modalItems.innerHTML = ''; // Limpiar los elementos del modal
    sendBtn.classList.add('hidden'); // Ocultar el botón de enviar
    closeBtn.classList.add('hidden');
    modal.classList.add('visible'); // Mostrar el modal

    // Opcionalmente, puedes cerrar el modal después de un tiempo
    setTimeout(() => {
        modal.classList.remove('visible');
    }, 3000);
}

// Listeners para botones de nivel de atención
ratingButtons.forEach(button => {
    button.addEventListener('click', () => {
        const nivel = button.getAttribute('data-rating');
        mostrarModal(nivel);
    });
});

// Listener para cerrar el modal
closeBtn.addEventListener('click', () => {
    modal.classList.remove('visible');
});

// Listener para cerrar el modal del teléfono y enviar datos
closePhoneModalBtn.addEventListener('click', () => {
    const telefono = phoneInput.value.trim() || null; // Si no se proporciona, se establece como null
    phoneModal.classList.remove('visible');
    modal.classList.remove('visible'); // Cerrar el modal principal
    enviarDatos(telefono); // Enviar datos, ya sea con el número de teléfono o sin él
});

// Listener para habilitar el botón de enviar al seleccionar un ítem
modalItems.addEventListener('change', event => {
    if (event.target.name === 'item') {
        itemSeleccionado = event.target.value;
        sendBtn.classList.remove('hidden');
    }
});

// Listener para el botón de enviar
sendBtn.addEventListener('click', () => {
    phoneModal.classList.add('visible'); // Mostrar el modal para ingresar el número de teléfono
});

// Confirmar el número de teléfono y enviar datos al webhook
confirmPhoneBtn.addEventListener('click', () => {
    const telefono = phoneInput.value.trim() || null;
    enviarDatos(telefono); // Enviar datos con o sin número de teléfono
    phoneModal.classList.remove('visible'); // Cerrar modal del teléfono
    modal.classList.remove('visible'); // Cerrar el modal principal
});

/* Mantener la pantalla encendida */
let wakeLock = null;

    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock activado');
    } catch (err) {
    console.error('Error al activar el Wake Lock:', err);
  }