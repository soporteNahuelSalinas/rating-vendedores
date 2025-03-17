async function fetchVendorsByUser(userEmail) {
    try {
        const response = await fetch('https://stingray-poetic-likely.ngrok-free.app/webhook/0aaa1ca5-b39e-4459-b637-dced2735e77d', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail: userEmail }) // Enviar solo el userEmail
        });

        if (!response.ok) {
            throw new Error('Error en la conexión al servidor');
        }

        const branches = await response.json();
        return branches; // Devolver la lista de sucursales
    } catch (error) {
        console.error('Error al obtener las sucursales:', error);
        throw error; // Re-lanzar el error para manejo posterior
    }
}

async function fetchBranchesByVendor(userEmail) {
    try {
        const response = await fetch('https://stingray-poetic-likely.ngrok-free.app/webhook/27576cc3-1067-4edc-a24d-5d9eeaf93f8e', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail: userEmail }) // Enviar solo el userEmail
        });

        if (!response.ok) {
            throw new Error('Error en la conexión al servidor');
        }

        const vendors = await response.json();
        return vendors; // Devolver la lista de vendedores asociados
    } catch (error) {
        console.error('Error al obtener los vendedores:', error);
        throw error; // Re-lanzar el error para manejo posterior
    }
}

async function fetchSurveysByUser(userEmail) {
    try {
        const response = await fetch('https://stingray-poetic-likely.ngrok-free.app/webhook/bdbad3d1-ee1e-49df-8de4-e7c4ae16e45f', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail: userEmail }) // Enviar solo el userEmail
        });

        if (!response.ok) {
            throw new Error('Error en la conexión al servidor');
        }

        const surveys = await response.json();
        return surveys; // Devolver la lista de encuestas
    } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        throw error; // Re-lanzar el error para manejo posterior
    }
}

function populateVendors(branches) {
    const vendorSelect = document.getElementById('vendorSelect');
    vendorSelect.innerHTML = '<option value="">Seleccione un vendedor</option>'; // Resetear opciones

    branches.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch.id; // Suponiendo que cada sucursal tiene un id
        option.textContent = branch.nombre; // Y un nombre
        vendorSelect.appendChild(option);
    });
}

// Lógica para manejar la entrada de nombre de usuario
document.getElementById('submitUser').addEventListener('click', async () => {
    const userName = document.getElementById('userName').value.trim();
    if (!userName) {
        document.getElementById('messageArea').textContent = 'Por favor, ingresa un nombre válido.';
        return;
    }

    try {
        const branches = await fetchVendorsByUser(userName);
        populateVendors(branches); // Llenar vendedores en el select

        // Mostrar la sección de selección de vendedor
        document.getElementById('vendorSelectionSection').classList.remove('hidden');
        document.getElementById('messageArea').textContent = ''; // Limpiar mensajes
    } catch (error) {
        document.getElementById('messageArea').textContent = 'Hubo un problema al obtener los datos.';
    }
});

// Manejo de la selección de vendedor
document.getElementById('submitVendor').addEventListener('click', async () => {
    const vendorSelect = document.getElementById('vendorSelect');
    const selectedVendorId = vendorSelect.value;

    if (!selectedVendorId) {
        document.getElementById('messageArea').textContent = 'Por favor, selecciona un vendedor.';
        return;
    }

    const userEmail = document.getElementById('userName').value.trim();
    localStorage.setItem('idVendedor', selectedVendorId);

    // Ahora obtenemos las sucursales asociadas al vendedor seleccionado
    try {
        const vendors = await fetchBranchesByVendor(userEmail); // Pasar solo el userEmail
        populateBranches(vendors); // Llenar sucursales en el select

        // Mostrar la sección de selección de sucursal
        document.getElementById('branchSelectionSection').classList.remove('hidden');
        document.getElementById('messageArea').textContent = ''; // Limpiar mensajes
    } catch (error) {
        document.getElementById('messageArea').textContent = 'Hubo un problema al obtener las sucursales.';
    }
});

// Función para llenar las sucursales en el select
function populateBranches(vendors) {
    const branchSelect = document.getElementById('branchSelect');
    branchSelect.innerHTML = '<option value="">Seleccione una sucursal</option>'; // Resetear opciones

    vendors.forEach(vendor => {
        const option = document.createElement('option');
        option.value = vendor.id; // Asegúrate de que estás usando el ID correcto
        option.textContent = vendor.nombre; // Usa el nombre de la sucursal
        branchSelect.appendChild(option);
    });
}

// Manejo de la selección de sucursal
document.getElementById('submitBranch').addEventListener('click', async () => {
    const branchSelect = document.getElementById('branchSelect');
    const selectedBranchId = branchSelect.value; // Asegúrate de que sea el ID de la sucursal

    if (!selectedBranchId) {
        document.getElementById('messageArea').textContent = 'Por favor, selecciona una sucursal.';
        return;
    }

    // Almacenar el id de la sucursal
    localStorage.setItem('idSucursalVendedor', selectedBranchId); // Almacena el id de la sucursal

    // Obtener el nombre de la sucursal seleccionada
    const selectedBranchName = branchSelect.options[branchSelect.selectedIndex].text; // Obtener el nombre de la sucursal seleccionada
    localStorage.setItem('nombreSucursalVendedor', selectedBranchName); // Almacenar el nombre de la sucursal

    const userEmail = document.getElementById('userName').value.trim();

    // Obtener las encuestas para el usuario seleccionado
    try {
        const surveys = await fetchSurveysByUser(userEmail); // Obtener las encuestas
        populateSurveys(surveys); // Llenar encuestas en el select

        // Mostrar la sección de selección de encuesta
        document.getElementById('surveySelectionSection').classList.remove('hidden');
        document.getElementById('messageArea').textContent = ''; // Limpiar mensajes
    } catch (error) {
        document.getElementById('messageArea').textContent = 'Hubo un problema al obtener las encuestas.';
    }
});


// Función para llenar las encuestas en el select
function populateSurveys(surveys) {
    const surveySelect = document.getElementById('surveySelect');
    surveySelect.innerHTML = '<option value="">Seleccione una encuesta</option>'; // Resetear opciones

    surveys.forEach(survey => {
        const option = document.createElement('option');
        option.value = survey.id; // Almacenar el id de la encuesta
        option.textContent = survey.nombre; // Y el nombre de la encuesta
        surveySelect.appendChild(option);
    });
}

// Manejo de la selección de encuesta
document.getElementById('submitSurvey').addEventListener('click', () => {
    const surveySelect = document.getElementById('surveySelect');
    const selectedSurveyId = surveySelect.value;

    if (!selectedSurveyId) {
        document.getElementById('messageArea').textContent = 'Por favor, selecciona una encuesta.';
        return;
    }

    localStorage.setItem('idEncuesta', selectedSurveyId); // Almacenar el id de la encuesta

    // Aquí puedes implementar lo que quieras hacer después de seleccionar la encuesta
    document.getElementById('messageArea').textContent = 'Gracias por calificar!';
});