// URL del webhook
const webhookUrl = 'https://hook.us2.make.com/xmayxoy1jlf2pjpvwf6b2wmio99w5wcf';

// Preguntas para cada nivel de atención
const preguntas = {
    Buena: {
        title: '¿Qué aspectos de la atención te parecieron más destacados?😎',
        items: [
            '🔋Rapidez en la atención',
            '🙋Disposición a la atención',
            '🧠Conocimiento técnico',
            '💯Capacidad de resolución',
            '🤝Amabilidad, empatía',
            '⚙️Asesoramiento técnico'
        ]
    },
    Regular: {
        title: '¿Qué aspectos sugeriría mejorar?🙏',
        items: [
            '🔋Atención más rápida',
            '🧠Conocimientos del producto',
            '💰Conocer las financiaciones',
            '✋Mayor predisposición',
            '🤝Amabilidad y empatía'
        ]
    },
    Mala: {
        title: '¿Qué aspectos sugeriría mejorar?🙏',
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
    modal.classList.add('visible');
}

// Enviar datos al webhook
function enviarDatos() {
    const data = {
        vendedor: vendedorSeleccionado,
        nivel: nivelSeleccionado,
        aspecto: itemSeleccionado
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Datos enviados con éxito:', data);
            mostrarAgradecimiento(); // Muestra el mensaje de agradecimiento
        })
        .catch(error => {
            console.error('Error al enviar datos:', error);
            mostrarAgradecimiento(); // Muestra el mensaje de agradecimiento incluso si hay error
        });

    // Ocultar modal después de un pequeño retraso si se desea
    setTimeout(() => {
        modal.classList.remove('visible');
    }, 2000); // Cambia el tiempo según sea necesario
}

// Mostrar mensaje de agradecimiento
function mostrarAgradecimiento() {
    // Aquí puedes agregar un mensaje de agradecimiento en el modal
    modalTitle.textContent = '¡Gracias por tu feedback!'; // Mensaje de agradecimiento
    modalItems.innerHTML = ''; // Limpiar los elementos del modal
    sendBtn.classList.add('hidden'); // Ocultar el botón de enviar
    closeBtn.classList.add('hidden');
    modal.classList.add('visible'); // Mostrar el modal

    // Opcionalmente, puedes cerrar el modal después de un tiempo
    setTimeout(() => {
        modal.classList.remove('visible');
    }, 3000); // Cerrar después de 2 segundos
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

// Listener para habilitar el botón de enviar al seleccionar un ítem
modalItems.addEventListener('change', event => {
    if (event.target.name === 'item') {
        itemSeleccionado = event.target.value;
        sendBtn.classList.remove('hidden');
    }
});

// Listener para el botón de enviar
sendBtn.addEventListener('click', enviarDatos);