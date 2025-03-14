document.addEventListener('DOMContentLoaded', () => {
    // Se asume que después del login se almacena el email del usuario en localStorage
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
      console.warn('No se encontró el email del usuario. No se realizará la petición para obtener sucursales.');
      return;
    }
    
    const webhookUrl = 'https://stingray-poetic-likely.ngrok-free.app/webhook/219a2463-1b23-4034-bc9a-22b98aa296a7';
    
    // Se prepara el payload con el userEmail
    const payload = {
      userEmail: userEmail
    };
  
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la respuesta HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      let nombresSucursales;
      if (Array.isArray(data)) {
        nombresSucursales = data.map(sucursal => sucursal.nombre);
      } else {
        nombresSucursales = [data.nombre];
      }
      
      // Se crea un nuevo contenedor para mostrar la(s) sucursal(es) sin modificar el HTML actual
      const sucursalesSection = document.getElementById('sectionSucursales');
      if (!sucursalesSection) return;
  
      const branchContainer = document.createElement('div');
      branchContainer.id = 'fetchedBranches';
      
      const branchTitle = document.createElement('h3');
      branchTitle.textContent = 'Sucursales Existentes';
      branchContainer.appendChild(branchTitle);
      
      // Se crea una lista con los nombres de las sucursales
      const ul = document.createElement('ul');
      nombresSucursales.forEach(nombre => {
        const li = document.createElement('li');
        li.textContent = nombre;
        ul.appendChild(li);
      });
      branchContainer.appendChild(ul);
      
      // Se añade el nuevo contenedor al final de la sección de sucursales
      sucursalesSection.appendChild(branchContainer);
    })
    .catch(error => {
      console.error('Error al obtener las sucursales:', error);
    });
  });  