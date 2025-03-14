document.addEventListener('DOMContentLoaded', () => {
  const tabVendedores = document.getElementById('tabVendedores');

  if (!tabVendedores) return;

  tabVendedores.addEventListener('click', () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.warn('No se encontró el email del usuario. No se realizará la petición para obtener vendedores.');
      return;
    }
    
    const vendorsWebhookUrl = 'https://stingray-poetic-likely.ngrok-free.app/webhook/8ef55d1c-dd4d-4926-af0f-9cf1f5c00f1b';
    const payload = { userEmail };

    fetch(vendorsWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la respuesta HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const vendedores = Array.isArray(data) ? data : [data];
      const ul = document.getElementById('listaVendedores');
      if (!ul) return;
      ul.innerHTML = '';

      vendedores.forEach(vendedor => {
        const li = document.createElement('li');
        li.textContent = vendedor.nombre;
        ul.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error al obtener los vendedores:', error);
    });
  });
});