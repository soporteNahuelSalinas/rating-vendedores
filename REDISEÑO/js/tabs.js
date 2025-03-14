document.addEventListener('DOMContentLoaded', () => {
    const tabSucursales = document.getElementById('tabSucursales');
    const tabVendedores = document.getElementById('tabVendedores');
    const sectionSucursales = document.getElementById('sectionSucursales');
    const sectionVendedores = document.getElementById('sectionVendedores');
  
    // Listener para la pestaña de Vendedores (ya existente en vendors.js)
    tabVendedores.addEventListener('click', () => {
      tabVendedores.classList.add('active');
      tabSucursales.classList.remove('active');
      tabEncuestas.classList.remove('active');
  
      sectionVendedores.style.display = 'block';
      sectionSucursales.style.display = 'none';
      sectionEncuestas.style.display = 'none';
    });
  
    // Listener para la pestaña de Sucursales
    tabSucursales.addEventListener('click', () => {
      tabSucursales.classList.add('active');
      tabVendedores.classList.remove('active');
      tabEncuestas.classList.remove('active');
  
      sectionSucursales.style.display = 'block';
      sectionVendedores.style.display = 'none';
      sectionEncuestas.style.display = 'none';
    });
  });  