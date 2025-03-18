// Obtener el nombre del vendedor desde localStorage
const nameVendor = localStorage.getItem('nombreVendedor');
const mensaje = `¡No olvides calificar a ${nameVendor}!`;
document.getElementById('nombreVendedor').innerText = mensaje;

// Función para obtener los datos de la encuesta
async function fetchSurveyData() {
    const idEncuesta = localStorage.getItem('idEncuesta');

    try {
        const response = await fetch('https://stingray-poetic-likely.ngrok-free.app/webhook/encuesta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idEncuesta: idEncuesta }),
        });

        if (!response.ok) {
            throw new Error('Error en la conexión al servidor');
        }

        const survey = await response.json(); // Obtener el objeto de la encuesta
        return survey; // Devolver el objeto de la encuesta
    } catch (error) {
        console.error('Error al obtener los datos de la encuesta:', error);
        throw error; // Re-lanzar el error para manejo posterior
    }
}

// Mostrar niveles de calificación
function displayRatingOptions(survey) {
    const ratingButtonsContainer = document.getElementById('rating-buttons-container');
    ratingButtonsContainer.innerHTML = ''; // Limpiar contenido previo

    // Mostrar los niveles de calificación
    const questions = survey.items.preguntas;
    for (const level in questions) {
        const button = document.createElement('button');
        button.classList.add('rating-btn');
        button.dataset.rating = level; // Guardar el nivel de calificación en data-attribute
        button.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/512/743/743418.png" alt="${level}">
            <p>${level}</p>
        `; // Icono y texto

        button.addEventListener('click', () => {
            handleRatingSelection(level); // Manejar la selección de calificación
        });

        ratingButtonsContainer.appendChild(button);
    }
}

// Manejar la selección de calificación
function handleRatingSelection(level) {
    document.getElementById('modal-title').textContent = `Calificación seleccionada: ${level}`;
    // Aquí puedes agregar lógica para avanzar a la siguiente parte de la encuesta
    document.getElementById('modal').classList.remove('hidden'); // Mostrar modal
}

// Lógica para iniciar el proceso
async function initSurvey() {
    try {
        const survey = await fetchSurveyData(); // Obtener los datos de la encuesta

        if (survey) {
            displayRatingOptions(survey); // Mostrar niveles de calificación
        } else {
            console.error('Encuesta no encontrada');
        }
    } catch (error) {
        console.error('Error al inicializar la encuesta:', error);
    }
}

// Llamar a la función para iniciar la encuesta
initSurvey();