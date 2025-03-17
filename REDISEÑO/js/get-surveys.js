document.addEventListener('DOMContentLoaded', () => {
  //Mostrar mensajes de error o de éxito
    const messageArea = document.getElementById('messageArea');
    // Obtener el userEmail desde localStorage
    const userEmail = localStorage.getItem('userEmail');
    console.log('userEmail:', userEmail);
    if (!userEmail) {
      console.error('No se encontró userEmail en localStorage.');
      return;
    }
  
    // Referencia a la sección de Encuestas (ya definida en index.html)
    const sectionEncuestas = document.getElementById('sectionEncuestas');
  
    // Crear (o vaciar) el contenedor para listar las encuestas
    let surveysList = document.getElementById('surveysList');
    if (!surveysList) {
      surveysList = document.createElement('div');
      surveysList.id = 'surveysList';
      sectionEncuestas.appendChild(surveysList);
    } else {
      surveysList.innerHTML = '';
    }
  
    // Función para obtener las encuestas del usuario
    async function fetchSurveys() {
      console.log('Llamando a fetchSurveys...');
      try {
        // URL de ejemplo para obtener encuestas
        const getSurveysURL = 'https://stingray-poetic-likely.ngrok-free.app/webhook/41af4322-3dc8-4ecd-bce2-2167212d9af7'; // Reemplazar con la URL real
        const response = await fetch(getSurveysURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail })
        });
        console.log('Respuesta del servidor:', response);
        if (!response.ok) {
          console.error('Error al obtener encuestas. Status:', response.status);
          surveysList.textContent = 'Error al obtener encuestas.';
          return;
        }
        const responseData = await response.json();
        // Convertir a array si es necesario
        const surveys = Array.isArray(responseData) ? responseData : [responseData];
        renderSurveys(surveys);
      } catch (error) {
        console.error('Error en fetchSurveys:', error);
        surveysList.textContent = 'Error al obtener encuestas.';
      }
    }
  
    // Función para renderizar la lista de encuestas
    function renderSurveys(surveys) {
      console.log('Renderizando encuestas...');
      surveysList.innerHTML = ''; // Limpiar contenido previo
      if (!surveys.length) {
        surveysList.textContent = 'No se encontraron encuestas.';
        console.log('No se encontraron encuestas.');
        return;
      }
      const ul = document.createElement('ul');
      surveys.forEach(survey => {
        // Definir el título de la encuesta: si survey.nombre es null, se utiliza survey.items.titulo o un fallback.
        const surveyTitle = survey.nombre || 'Encuesta sin título';
        console.log('Datos recibidos:', surveys);
        console.log('Procesando encuesta:', surveyTitle);
        
        const li = document.createElement('li');
  
        // Span con el título de la encuesta (abre modal al hacer clic)
        const titleSpan = document.createElement('span');
        titleSpan.textContent = surveyTitle;
        titleSpan.style.cursor = 'pointer';
        titleSpan.addEventListener('click', () => openModal(survey));
        li.appendChild(titleSpan);
  
        // Botón para modificar
        const modifyBtn = document.createElement('button');
        modifyBtn.textContent = 'Modificar';
        modifyBtn.style.marginLeft = '10px';
        modifyBtn.addEventListener('click', () => modifySurvey(survey));
        li.appendChild(modifyBtn);
  
        // Botón para eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.addEventListener('click', () => deleteSurvey(survey));
        li.appendChild(deleteBtn);
  
        ul.appendChild(li);
      });
      surveysList.appendChild(ul);
      console.log('Encuestas renderizadas correctamente.');
    }
  
    // Modal: se crea de manera dinámica (si no existe) y se utiliza para mostrar el detalle de la encuesta
    let modal = document.getElementById('surveyModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'surveyModal';
      modal.style.display = 'none';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '1000';
  
      const modalContent = document.createElement('div');
      modalContent.id = 'surveyModalContent';
      modalContent.style.backgroundColor = '#fff';
      modalContent.style.padding = '20px';
      modalContent.style.borderRadius = '5px';
      modalContent.style.maxWidth = '500px';
      modalContent.style.width = '90%';
  
      // Botón para cerrar el modal
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Cerrar';
      closeBtn.style.float = 'right';
      closeBtn.addEventListener('click', closeModal);
      modalContent.appendChild(closeBtn);
  
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
    }
  
    // Función para abrir el modal y mostrar detalles de la encuesta
    function openModal(survey) {
      console.log('Abriendo modal para la encuesta:', survey.id);
      const modalContent = document.getElementById('surveyModalContent');
      // Limpiar contenido previo, conservando el botón de cerrar
      while (modalContent.childNodes.length > 1) {
        modalContent.removeChild(modalContent.lastChild);
      }
  
      const title = document.createElement('h3');
      const surveyTitle = survey.nombre || survey.items.titulo || 'Encuesta sin título';
      title.textContent = surveyTitle;
      modalContent.appendChild(title);
  
      // Mostrar Preguntas
      const questionsContainer = document.createElement('div');
      questionsContainer.innerHTML = '<h4>Preguntas:</h4>';
      const preguntas = survey.items.preguntas;
      for (const nivel in preguntas) {
        const questionDiv = document.createElement('div');
        const questionTitle = document.createElement('p');
        questionTitle.textContent = `${nivel} - ${preguntas[nivel].title}`;
        questionDiv.appendChild(questionTitle);
  
        // Listado de items de la pregunta
        const itemsList = document.createElement('ul');
        preguntas[nivel].items.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          itemsList.appendChild(li);
        });
        questionDiv.appendChild(itemsList);
        questionsContainer.appendChild(questionDiv);
      }
      modalContent.appendChild(questionsContainer);
  
      // Mostrar Categorías
      const categoriasDiv = document.createElement('div');
      categoriasDiv.innerHTML = '<h4>Categorías:</h4>';
      const categoriasList = document.createElement('ul');
      survey.items.categorias.forEach(cat => {
        const li = document.createElement('li');
        li.textContent = cat;
        categoriasList.appendChild(li);
      });
      categoriasDiv.appendChild(categoriasList);
      modalContent.appendChild(categoriasDiv);
  
      // Mostrar Fuentes
      const fuentesDiv = document.createElement('div');
      fuentesDiv.innerHTML = '<h4>Fuentes:</h4>';
      const fuentesList = document.createElement('ul');
      survey.items.fuentes.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        fuentesList.appendChild(li);
      });
      fuentesDiv.appendChild(fuentesList);
      modalContent.appendChild(fuentesDiv);
  
      modal.style.display = 'flex';
    }
  
    function closeModal() {
      console.log('Cerrando modal.');
      modal.style.display = 'none';
    }
  
    // Función para modificar una encuesta
    async function modifySurvey(survey) {
      console.log('Modificando encuesta:', survey.id);
      // URL de ejemplo para modificar encuesta
      const modifyURL = 'https://example.com/modify-survey'; // Reemplazar con la URL real
      try {
        const response = await fetch(modifyURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: survey.id, userEmail })
        });
        if (response.ok) {
          console.log('Encuesta modificada correctamente.');
          //
          messageArea.textContent = 'Encuesta modificada correctamente.';
          messageArea.style.color = 'green';
          // Actualizar la lista
          fetchSurveys();
        } else {
          console.error('Error al modificar la encuesta. Status:', response.status);
          //
          messageArea.textContent = 'Error al modificar la encuesta.';
          messageArea.style.color = 'red';
        }
      } catch (error) {
        console.error('Error en modifySurvey:', error);
        alert('Hubo un problema al conectar con el servidor.');
      }
    }
  
    // Función para eliminar una encuesta
    async function deleteSurvey(survey) {
        console.log('Eliminando encuesta:', survey.id);
        
        // Pregunta de confirmación
        const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar la encuesta: "${survey.nombre || 'sin título'}"?`);
        if (!confirmDelete) {
          console.log('Eliminación cancelada.');
          return; // Si el usuario cancela, no hacer nada más
        }
      
        const deleteURL = 'https://stingray-poetic-likely.ngrok-free.app/webhook/d0ab8796-e746-4ce0-9772-40aea17d78c4'; // Reemplazar con la URL real
        try {
          const response = await fetch(deleteURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: survey.id, userEmail })
          });
          if (response.ok) {
            console.log('Encuesta eliminada correctamente.');
            messageArea.textContent = 'Encuesta eliminada correctamente.'; // Mostrar mensaje en pantalla
            messageArea.style.color = 'green'; // Color verde para éxito
            fetchSurveys(); // Actualizar la lista
          } else {
            console.error('Error al eliminar la encuesta. Status:', response.status);
            messageArea.textContent = 'Error al eliminar la encuesta.'; // Mostrar mensaje de error
            messageArea.style.color = 'red'; // Color rojo para error
          }
        } catch (error) {
          console.error('Error en deleteSurvey:', error);
          
          messageArea.textContent = 'Hubo un problema al conectar con el servidor.'; // Mostrar mensaje de error
          messageArea.style.color = 'red';
        }
      }      
  
    // Llamar a la función para obtener y renderizar las encuestas
    fetchSurveys();
  });  