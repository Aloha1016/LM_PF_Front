const calculateSalesTotal = async () => {
    try {
        // Llamada al endpoint
        const response = await fetch("http://localhost:4000/api/orden/ordenesall");
        if (!response.ok) throw new Error("Error al obtener las órdenes");

        // Parsear la respuesta
        const data = await response.json();
        const orders = data.orders;

        // Filtrar las órdenes con los estados "Entregado", "En Camino" y "Tarde"
        const validOrders = orders.filter(order => {
            const estado = order.estado.toLowerCase();
            return estado === "confirmado" || estado === "en camino" || estado === "retrasado";
        });

        // Calcular el total de precioPedido de estas órdenes
        const totalSales = validOrders.reduce((total, order) => {
            return total + order.precioPedido;
        }, 0);

        // Actualizar los valores en el DOM
        console.log("Órdenes válidas:", validOrders.length);
        console.log("Total de Ventas:", totalSales);

        document.getElementById("sales").textContent = `$${totalSales.toFixed(2)}`;
    } catch (error) {
        console.error("Error calculando las ventas totales:", error);
        alert("Ocurrió un error al calcular las ventas totales");
    }
};

const countConfirmedOrders = async () => {
    try {
        // Llamada al endpoint
        const response = await fetch("http://localhost:4000/api/orden/ordenesall");
        if (!response.ok) throw new Error("Error al obtener las órdenes");

        // Parsear la respuesta
        const data = await response.json();
        const orders = data.orders;

        // Filtrar las órdenes con estado "Confirmado"
        const confirmedOrders = orders.filter(order => 
            order.estado.toLowerCase() === "confirmado" // Estado en minúsculas para evitar problemas
        );

        // Calcular el total de precioPedido
        const totalPrecioPedido = confirmedOrders.reduce((total, order) => {
            return total + order.precioPedido;
        }, 0);

        // Actualizar los valores en el DOM
        console.log("Total de precioPedido:", totalPrecioPedido);

        document.getElementById("revenue").textContent = `$${totalPrecioPedido.toFixed(2)}`;
    } catch (error) {
        console.error("Error contando las órdenes confirmadas:", error);
        alert("Ocurrió un error al contar las órdenes confirmadas y calcular el total");
    }
};

async function obtenerTotalProfit() {
    try {
        const response = await fetch('http://localhost:4000/api/proveedor/totalProfit');
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        document.getElementById('total-profit').textContent = `$${data.totalProfit.toFixed(2)}`;
    } catch (error) {
        console.error('Error al obtener las ganancias:', error);
    }
}

async function obtenerTotalProfitMonth() {
    try {
        const response = await fetch('http://localhost:4000/api/proveedor/totalProfitMonth');
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error del servidor: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        document.getElementById('mom-profit').textContent = `$${data.totalProfit.toFixed(2)}`;
    } catch (error) {
        console.error('Error al obtener las ganancias:', error);
    }
}

async function obtenerTotalProfitYear() {
    try {
        const response = await fetch('http://localhost:4000/api/proveedor/totalProfitYear');
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error del servidor: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        document.getElementById('yoy-profit').textContent = `$${data.totalProfit.toFixed(2)}`;
    } catch (error) {
        console.error('Error al obtener las ganancias:', error);
    }
}


async function obtenerCompraNeto() {
    try {
        const response = await fetch('http://localhost:4000/api/proveedor/totalOrdenesProveedor');
        if (!response.ok) {
            throw new Error('Error al obtener el total de órdenes a proveedores');
        }
        const data = await response.json();
        const total = data.totalOrdenesProveedor.toFixed(2);
        document.getElementById('pur-value').textContent = `$${total}`;
    } catch (error) {
        console.error('Error al obtener el total de órdenes a proveedores:', error);
    }
}

const calculateSalesTotalNeto = async () => {
    try {
        // Llamada al endpoint
        const response = await fetch("http://localhost:4000/api/orden/ordenesall");
        if (!response.ok) throw new Error("Error al obtener las órdenes");

        // Parsear la respuesta
        const data = await response.json();
        const orders = data.orders;

        // Calcular el total de precioPedido de todas las órdenes
        const totalSales = orders.reduce((total, order) => {
            return total + order.precioPedido;
        }, 0);

        // Actualizar los valores en el DOM
        console.log("Total de Ventas:", totalSales);

        document.getElementById("sal-value").textContent = `$${totalSales.toFixed(2)}`;
    } catch (error) {
        console.error("Error calculando las ventas totales:", error);
        alert("Ocurrió un error al calcular las ventas totales");
    }
};

// Función para cargar las categorías en la tabla principal
async function cargarCategoriasPrincipal(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const categoriesTableBody = document.getElementById('categories-table-body');

        // Limpiar la tabla antes de cargar nuevas filas
        categoriesTableBody.innerHTML = '';

        // Iterar sobre las categorías y crear las filas de la tabla principal
        data.categorias.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.categoria}</td>
                <td>$${category.volumen.toFixed(2)}</td>
                <td class="text-success">${category.incremento.toFixed(2)}%</td>
            `;
            categoriesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar las categorías más vendidas:', error);
    }
}

// Función para cargar las categorías en el modal
async function cargarCategoriasModal(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const modalTableBody = document.getElementById('VerTodo1').querySelector('tbody'); 

        // Limpiar la tabla del modal antes de cargar nuevas filas
        modalTableBody.innerHTML = '';

        // Iterar sobre las categorías y crear las filas del modal
        data.categorias.forEach(category => {
            const modalRow = document.createElement('tr');
            modalRow.innerHTML = `
                <td>${category.categoria}</td>
                <td>$${category.volumen.toFixed(2)}</td>
                <td class="text-success">${category.incremento.toFixed(2)}%</td>
            `;
            modalTableBody.appendChild(modalRow);
        });
    } catch (error) {
        console.error('Error al cargar las categorías más vendidas:', error);
    }
}

// Llamada para cargar las categorías principales
cargarCategoriasPrincipal('http://localhost:4000/api/orden/categorias-vendidas');

// Evento para abrir el modal y cargar categorías sin limitación
document.getElementById("view-all-1").addEventListener("click", () => {
    cargarCategoriasModal('http://localhost:4000/api/orden/categorias-vendidas-sinLim');
});

// Función para cargar los productos en la tabla principal
async function cargarProductosPrincipal(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const productTableBody = document.getElementById('product-table-body');

        // Limpiar la tabla antes de cargar nuevas filas
        productTableBody.innerHTML = '';

        // Iterar sobre los productos y crear las filas de la tabla principal
        data.productos.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.nombreProducto}</td>
                <td>${product.idProducto}</td>
                <td>${product.categoria}</td>
                <td>${product.cantidadRestante}</td>
                <td>$${product.volumen.toFixed(2)}</td>
                <td class="text-success">${product.incremento.toFixed(2)}%</td>
            `;
            productTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los productos más vendidos:', error);
    }
}

// Función para cargar los productos en el modal
async function cargarProductosModal(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const modalTableBody = document.getElementById('VerTodo2Body');

        // Limpiar la tabla del modal antes de cargar nuevas filas
        modalTableBody.innerHTML = '';

        // Iterar sobre los productos y crear las filas del modal
        data.productos.forEach(product => {
            const modalRow = document.createElement('tr');
            modalRow.innerHTML = `
                <td>${product.nombreProducto}</td>
                <td>${product.idProducto}</td>
                <td>${product.categoria}</td>
                <td>${product.cantidadRestante}</td>
                <td>$${product.volumen.toFixed(2)}</td>
                <td class="text-success">${product.incremento.toFixed(2)}%</td>
            `;
            modalTableBody.appendChild(modalRow);
        });
    } catch (error) {
        console.error('Error al cargar los productos más vendidos:', error);
    }
}

// Llamada para cargar los productos principales
cargarProductosPrincipal('http://localhost:4000/api/orden/productos-vendidos');

// Evento para abrir el modal y cargar productos sin limitación
document.getElementById("view-all-2").addEventListener("click", () => {
    cargarProductosModal('http://localhost:4000/api/orden/productos-vendidos-sinLim');
});

cargarCategoriasPrincipal();
cargarCategoriasModal();
obtenerTotalProfitYear();
obtenerTotalProfitMonth();
calculateSalesTotalNeto();
obtenerCompraNeto();
obtenerTotalProfit();
countConfirmedOrders();
calculateSalesTotal();

function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../../../main.html';
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '../../../main.html';
}

document.addEventListener('DOMContentLoaded', checkAuthentication);

document.addEventListener("DOMContentLoaded", async () => {
    const chartContainer = document.getElementById("chartCanvas");
    let chartInstance;

    const updateChart = async (endpoint, filterLabel) => {
        try {
            // Llama al endpoint correspondiente
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Error al obtener los datos del servidor');
            }

            const data = await response.json();
            const labels = data.labels || [];
            const revenue = data.revenue || [];
            const profit = data.profit || [];

            // Actualizar el texto del botón con el filtro seleccionado
            document.getElementById("dropdownMenuButton").textContent = filterLabel;

            // Si ya existe un gráfico, destruirlo antes de crear uno nuevo
            if (chartInstance) {
                chartInstance.destroy();
            }

            // Crear un nuevo gráfico
            const ctx = chartContainer.getContext('2d');
            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Ingresos',
                            data: revenue,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.1)',
                            borderWidth: 2,
                            tension: 0.3,
                            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                            pointRadius: 4
                        },
                        {
                            label: 'Ganancias',
                            data: profit,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.1)',
                            borderWidth: 2,
                            tension: 0.3,
                            pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                            pointRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `${context.dataset.label}: ${context.raw.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
                                }
                            }
                        },
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            title: { display: true, text: 'Tiempo', font: { size: 14 } }
                        },
                        y: {
                            grid: { display: false },
                            beginAtZero: true,
                            title: { display: true, text: 'Monto', font: { size: 14 } }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error al cargar la gráfica:', error.message);
        }
    };

    // Escuchar las selecciones del menú desplegable
    document.getElementById("opcion-diario").addEventListener("click", () => {
        updateChart('http://localhost:4000/api/proveedor/totalProfitDayPuntos', 'Diario');
    });

    document.getElementById("opcion-semanal").addEventListener("click", () => {
        updateChart('http://localhost:4000/api/proveedor/totalProfitWeekPuntos', 'Semanal');
    });

    document.getElementById("opcion-mensual").addEventListener("click", () => {
        updateChart('http://localhost:4000/api/proveedor/totalProfitMonthPuntos', 'Mensual');
    });

    document.getElementById("opcion-anual").addEventListener("click", () => {
        updateChart('http://localhost:4000/api/proveedor/totalProfitYearPuntos', 'Anual');
    });

    // Cargar la gráfica inicial (mensual por defecto)
    updateChart('http://localhost:4000/api/proveedor/totalProfitMonthPuntos', 'Mensual');
});
