document.addEventListener('DOMContentLoaded', initDashboard);

async function initDashboard() {
    try {
        const API_URL = 'https://known-moccasin-magical.ngrok-free.app/webhook/dashboard/anyway';
        let datosOriginales = [];
        let datosFiltrados = [];

        const filters = {
            fecha: document.getElementById('fechaFiltro'),
            sucursal: document.getElementById('sucursalFiltro'),
            vendedor: document.getElementById('vendedorFiltro'),
            canal: document.getElementById('canalFiltro')
        };

        const charts = {
            satisfaccion: null,
            vendedores: null
        };

        // Carga inicial con POST
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'anydash' })
        });
        datosOriginales = await response.json();
        datosFiltrados = [...datosOriginales];
        
        populateSelect('sucursalFiltro', datosOriginales, 'sucursal');
        populateSelect('vendedorFiltro', datosOriginales, 'vendedor');
        populateSelect('canalFiltro', datosOriginales, 'canal');

        charts.satisfaccion = createPieChart('satisfaccionChart', 'Nivel de Satisfacción');
        charts.vendedores = createBarChart('vendedoresChart', 'Registros por Vendedor');

        updateCharts(datosFiltrados);
        renderTable(datosFiltrados);

        Object.values(filters).forEach(filter => 
            filter.addEventListener('change', handleFilterChange)
        );

        function handleFilterChange() {
            const fechaSeleccionada = filters.fecha.value;
            const sucursal = filters.sucursal.value;
            const vendedor = filters.vendedor.value;
            const canal = filters.canal.value;

            datosFiltrados = datosOriginales.filter(item => {
                const fechaItem = new Date(item.fecha);
                const fechaFiltro = fechaSeleccionada ? new Date(fechaSeleccionada) : null;

                return (
                    (!fechaFiltro || 
                        (fechaItem.getFullYear() === fechaFiltro.getFullYear() &&
                        fechaItem.getMonth() === fechaFiltro.getMonth() &&
                        fechaItem.getDate() >= fechaFiltro.getDate() &&
                        fechaItem.getDate() <= fechaFiltro.getDate() + 7)) &&
                    (sucursal === '' || item.sucursal === sucursal) &&
                    (vendedor === '' || item.vendedor === vendedor) &&
                    (canal === '' || item.canal === canal)
                );
            });

            updateCharts(datosFiltrados);
            renderTable(datosFiltrados);
        }

        function updateCharts(data) {
            updateSatisfaccionChart(data);
            updateVendedoresChart(data);
        }

        function updateSatisfaccionChart(data) {
            const counts = {};
            data.forEach(item => {
                counts[item.calificacion] = (counts[item.calificacion] || 0) + 1;
            });

            charts.satisfaccion.data.labels = Object.keys(counts);
            charts.satisfaccion.data.datasets[0].data = Object.values(counts);
            charts.satisfaccion.update();
        }

        function updateVendedoresChart(data) {
            const counts = {};
            data.forEach(item => {
                counts[item.vendedor] = (counts[item.vendedor] || 0) + 1;
            });

            charts.vendedores.data.labels = Object.keys(counts);
            charts.vendedores.data.datasets[0].data = Object.values(counts);
            charts.vendedores.update();
        }

        function createPieChart(elementId, title) {
            return new Chart(document.getElementById(elementId), {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: ['#4CAF50', '#FFEB3B', '#FF9800', '#F44336']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: { display: true, text: title },
                        legend: { position: 'bottom' },
                        tooltip: { enabled: true }
                    }
                }
            });
        }

        function createBarChart(elementId, title) {
            return new Chart(document.getElementById(elementId), {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Registros',
                        data: [],
                        backgroundColor: '#673AB7'
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: { display: true, text: title }
                    }
                }
            });
        }

        function populateSelect(selectorId, data, field) {
            const select = document.getElementById(selectorId);
            const values = [...new Set(data.map(item => item[field]))];
            
            values.sort().forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        function renderTable(data) {
            const tbody = document.getElementById('tablaRegistros');
            tbody.innerHTML = data.map(item => `
                <tr>
                    <td>${formatDate(item.fecha)}</td>
                    <td>${item.detalle || 'N/A'}</td>
                    <td>${item.sucursal || 'N/A'}</td>
                    <td>${item.telefono || 'N/A'}</td>
                    <td>${item.vendedor}</td>
                    <td>${item.canal}</td>
                    <td>
                        <span class="badge ${getCalificationClass(item.calificacion)}">
                            ${item.calificacion}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteRegistro('${item.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }

        function getCalificationClass(calificacion) {
            const map = {
                'Buena': 'bg-success',
                'Normal': 'bg-info',
                'Mala': 'bg-danger'
            };
            return map[calificacion] || 'bg-secondary';
        }

        // Eliminar registro con POST
        window.deleteRegistro = async function(id) {
            if (!confirm('¿Seguro que quieres eliminar este registro?')) return;

            try {
                // Solicitud de eliminación con POST
                await fetch("https://known-moccasin-magical.ngrok-free.app/webhook/encuesta/anyway/delete", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: id,
                        accion: 'ELIMINAR'
                    })
                });
                
                // Actualización de datos con POST
                const refreshResponse = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: 'anydash' })
                });
                datosOriginales = await refreshResponse.json();
                datosFiltrados = [...datosOriginales];
                handleFilterChange();

            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }

    } catch (error) {
        console.error('Error al inicializar el dashboard:', error);
    }
}