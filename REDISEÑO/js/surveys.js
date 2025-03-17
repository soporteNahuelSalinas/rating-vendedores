document.addEventListener('DOMContentLoaded', () => {
  // Obtener referencias a las pestañas y secciones ya existentes en index.html
  const tabSucursales = document.getElementById('tabSucursales');
  const tabVendedores = document.getElementById('tabVendedores');
  const tabEncuestas = document.getElementById('tabEncuestas');

  const sectionSucursales = document.getElementById('sectionSucursales');
  const sectionVendedores = document.getElementById('sectionVendedores');
  const sectionEncuestas = document.getElementById('sectionEncuestas');

  // Área para mostrar errores o mensajes de éxito
  const messageArea = document.getElementById('messageArea');

  // Manejar el cambio de pestañas: cuando se hace clic en Encuestas
  tabEncuestas.addEventListener('click', () => {
    tabEncuestas.classList.add('active');
    tabSucursales.classList.remove('active');
    tabVendedores.classList.remove('active');

    sectionEncuestas.style.display = 'block';
    sectionSucursales.style.display = 'none';
    sectionVendedores.style.display = 'none';
  });

  // 4. Función para crear un bloque de pregunta (nivel de atención) vacío
  function createPreguntaBlock() {
    const container = document.createElement('div');
    container.className = 'preguntaBlock';

    // Input para el nombre del nivel
    const nivelLabel = document.createElement('label');
    nivelLabel.textContent = 'Nivel de Atención: ';
    nivelLabel.appendChild(document.createElement('br'));
    const nivelInput = document.createElement('input');
    nivelInput.type = 'text';
    nivelInput.placeholder = 'Ej: Buena';
    nivelInput.required = true;
    nivelInput.className = 'nivelInput';
    nivelLabel.appendChild(nivelInput);
    container.appendChild(nivelLabel);
    container.appendChild(document.createElement('br'));

    // Input para el título de la pregunta
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Título de la Pregunta: ';
    titleLabel.appendChild(document.createElement('br'));
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'Ingresar enunciado';
    titleInput.required = true;
    titleInput.className = 'preguntaTitulo';
    titleLabel.appendChild(titleInput);
    container.appendChild(titleLabel);
    container.appendChild(document.createElement('br'));


    // Contenedor para items (opciones)
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'itemsContainer';
    container.appendChild(itemsContainer);
    container.appendChild(document.createElement('br'));

    // Botón para agregar un item a este bloque
    const addItemButton = document.createElement('button');
    addItemButton.type = 'button';
    addItemButton.textContent = 'Agregar Item';
    addItemButton.addEventListener('click', () => {
      const itemWrapper = document.createElement('div');
      itemWrapper.className = 'itemWrapper';
      itemWrapper.style.marginBottom = '8px';

      const itemInput = document.createElement('input');
      itemInput.type = 'text';
      itemInput.placeholder = 'Nuevo item';
      itemInput.className = 'preguntaItem';
      itemInput.style.marginRight = '8px';

      const removeItemButton = document.createElement('button');
      removeItemButton.type = 'button';
      removeItemButton.textContent = '×';
      removeItemButton.style.background = 'none';
      removeItemButton.style.border = 'none';
      removeItemButton.style.color = 'red';
      removeItemButton.style.cursor = 'pointer';
      removeItemButton.addEventListener('click', () => itemWrapper.remove());

      itemWrapper.appendChild(itemInput);
      itemWrapper.appendChild(removeItemButton);
      itemsContainer.appendChild(itemWrapper);
    });
    container.appendChild(addItemButton);

    // Botón para remover todo el bloque
    const removeBlockButton = document.createElement('button');
    removeBlockButton.type = 'button';
    removeBlockButton.textContent = 'Eliminar Nivel';
    removeBlockButton.style.marginLeft = '10px';
    removeBlockButton.addEventListener('click', () => {
      container.remove();
    });
    container.appendChild(removeBlockButton);
    container.appendChild(document.createElement('br'));
    container.appendChild(document.createElement('br'));


    return container;
  }

  // 5. Manejar el evento de "Agregar Nivel de Atención"
  const agregarNivelBtn = document.getElementById('agregarNivel');
  const preguntasContainer = document.getElementById('preguntasContainer');
  agregarNivelBtn.addEventListener('click', () => {
    const block = createPreguntaBlock();
    preguntasContainer.appendChild(block);
  });

  // 6. Manejo dinámico para Categorías (mejorado con botones de eliminación)
  const agregarCategoriaBtn = document.getElementById('agregarCategoria');
  agregarCategoriaBtn.addEventListener('click', () => {
    const nuevaCategoriaInput = document.getElementById('nuevaCategoria');
    const categoria = nuevaCategoriaInput.value.trim();
    if (categoria !== '') {
      const li = document.createElement('li');
      li.style.marginBottom = '5px';

      const span = document.createElement('span');
      span.textContent = categoria;
      span.style.marginRight = '10px';
      li.appendChild(span);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.style.background = 'none';
      deleteBtn.style.border = 'none';
      deleteBtn.style.color = 'red';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.addEventListener('click', () => li.remove());
      li.appendChild(deleteBtn);

      document.getElementById('listaCategorias').appendChild(li);
      nuevaCategoriaInput.value = '';
    }
  });

  // 7. Manejo dinámico para Fuentes (mejorado con botones de eliminación)
  const agregarFuenteBtn = document.getElementById('agregarFuente');
  agregarFuenteBtn.addEventListener('click', () => {
    const nuevaFuenteInput = document.getElementById('nuevaFuente');
    const fuente = nuevaFuenteInput.value.trim();
    if (fuente !== '') {
      const li = document.createElement('li');
      li.style.marginBottom = '5px';

      const span = document.createElement('span');
      span.textContent = fuente;
      span.style.marginRight = '10px';
      li.appendChild(span);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.style.background = 'none';
      deleteBtn.style.border = 'none';
      deleteBtn.style.color = 'red';
      deleteBtn.style.cursor = 'pointer';
      deleteBtn.addEventListener('click', () => li.remove());
      li.appendChild(deleteBtn);

      document.getElementById('listaFuentes').appendChild(li);
      nuevaFuenteInput.value = '';
    }
  });

  // 8. Manejar el envío del formulario para generar la encuesta
  const formEncuesta = document.getElementById('formEncuesta');
  formEncuesta.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener el título de la encuesta
    const tituloEncuesta = document.getElementById('tituloEncuesta').value.trim();
    if (tituloEncuesta === '') {
      alert('Debe ingresar un título para la encuesta.');
      return;
    }

    // Recolectar las preguntas (niveles)
    const preguntas = {};
    const preguntaBlocks = document.querySelectorAll('.preguntaBlock');

    if (preguntaBlocks.length === 0) {
      messageArea.textContent = 'Debe agregar al menos un nivel de atención.';
      messageArea.style.color = 'red';
      return;
    }

    preguntaBlocks.forEach(block => {
      const nivel = block.querySelector('.nivelInput').value.trim();
      const title = block.querySelector('.preguntaTitulo').value.trim();
      const itemInputs = block.querySelectorAll('.preguntaItem');
      const items = [];

      itemInputs.forEach(input => {
        const itemValue = input.value.trim();
        if (itemValue !== '') items.push(itemValue);
      });

      if (nivel === '' || title === '' || items.length === 0) {
        alert('Todos los campos de cada nivel deben estar completos y tener al menos un item.');
        return;
      }

      preguntas[nivel] = { title, items };
    });

    // Recolectar categorías
    const listaCategoriasItems = document.querySelectorAll('#listaCategorias li span');
    const categorias = Array.from(listaCategoriasItems).map(span => span.textContent);

    if (categorias.length === 0) {
      alert('Debe agregar al menos una categoría.');
      return;
    }

    // Recolectar fuentes
    const listaFuentesItems = document.querySelectorAll('#listaFuentes li span');
    const fuentes = Array.from(listaFuentesItems).map(span => span.textContent);
    const userEmail = localStorage.getItem('userEmail');

    if (fuentes.length === 0) {
      alert('Debe agregar al menos una fuente.');
      return;
    }

    // Armar el objeto encuesta
    const encuesta = {
      titulo: tituloEncuesta,
      preguntas,
      categorias,
      fuentes,
      userEmail
    };

    console.log('Encuesta a guardar:', encuesta);
    alert('Encuesta creada.');

    // Enviar la información al webhook
    const webhookURL = 'https://stingray-poetic-likely.ngrok-free.app/webhook/d06834a2-8e59-46a2-a082-4426c6fb3136'; // Reemplazar con la URL real

    try {
      const response = await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encuesta, localStorage.getItem('userEmail'))
      });

      if (response.ok) {
        alert('Encuesta enviada correctamente.');
      } else {
        alert('Error al enviar la encuesta.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Hubo un problema al conectar con el servidor.');
    } 
  });
});