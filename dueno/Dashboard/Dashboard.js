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

async function obtenerTotalProfit() {
    try {
        const response = await fetch('http://localhost:4000/api/proveedor/totalProfitToday');
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        document.getElementById('total-profit').textContent = `$${data.totalProfit.toFixed(2)}`;
    } catch (error) {
        console.error('Error al obtener las ganancias:', error);
    }
}

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

const calculateSalesTotalToday = async () => {
    try {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const response = await fetch("http://localhost:4000/api/orden/ordenesall");
        if (!response.ok) throw new Error("Error al obtener las órdenes");

        const data = await response.json();
        const orders = data.orders;

        const validOrders = orders.filter(order => {
            const orderDateStr = new Date(order.fechaEntrega).toISOString().split('T')[0]; 
            const estado = order.estado.toLowerCase();

            return (
                orderDateStr === todayStr &&
                (estado === "confirmado" || estado === "en camino" || estado === "retrasado")
            );
        });

        const totalSales = validOrders.reduce((total, order) => {
            return total + order.precioPedido;
        }, 0);

        console.log("Órdenes válidas hoy:", validOrders.length);
        console.log("Total de Ventas de Hoy:", totalSales);

        document.getElementById("sales-today").textContent = `$${totalSales.toFixed(2)}`;
    } catch (error) {
        console.error("Error calculando las ventas totales de hoy:", error);
        alert("Ocurrió un error al calcular las ventas totales de hoy");
    }
};

async function obtenerSumaCantidades() {
    try {
      const response = await fetch('http://localhost:4000/api/producto/sumar-cantidades');
      
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('La suma total de cantidades es:', data.totalCantidad);
  
      // Actualizar el contenido del elemento con id "existe"
      const existeElement = document.getElementById('existe');
      if (existeElement) {
        existeElement.textContent = data.totalCantidad;
      } else {
        console.error('No se encontró el elemento con id "existe".');
      }
  
      return data.totalCantidad;
    } catch (error) {
      console.error('Error al obtener la suma de las cantidades:', error.message);
  
      // En caso de error, actualizar el texto del elemento como indicador
      const existeElement = document.getElementById('existe');
      if (existeElement) {
        existeElement.textContent = 'Error';
      }
    }
}
  
async function obtenerCantidadEnEspera() {
    try {
        const response = await fetch('http://localhost:4000/api/proveedor/sumarCantidadEnEspera'); 
        if (!response.ok) {
            throw new Error('Error al obtener las órdenes');
        }
        const data = await response.json();
        const totalCantidad = data.totalCantidad || 0;
        document.getElementById("recibir").innerText = totalCantidad;
    } catch (error) {
        document.getElementById("recibir").innerText = 'Error';
        console.error("Error al obtener las órdenes:", error);
    }
}

async function cantidadProveedores() {
    try {
        const response = await fetch('http://localhost:4000/api/proveedor/totalproveedores');
        if (!response.ok) {
            throw new Error('Error al obtener el número de proveedores');
        }
        const data = await response.json();
        const totalProveedores = data.totalProveedores || 0;
        document.getElementById('proveedores').innerText = totalProveedores;
    } catch (error) {
        document.getElementById("proveedores").innerText = 'Error';
        console.error("Error al obtener las órdenes:", error);
    }
}

async function cantidadCategoriasUnicas() {
    try {
        const response = await fetch('http://localhost:4000/api/producto/contarCategoriasUnicas');
        if (!response.ok) {
            throw new Error('Error al obtener el número de categorías');
        }
        const data = await response.json();
        const cantidadCategorias = data.cantidadCategoriasUnicas || 0;
        document.getElementById('categorias').innerText = cantidadCategorias;
    } catch (error) {
        document.getElementById("categorias").innerText = 'Error';
        console.error("Error al obtener las categorías únicas:", error);
    }
}

async function cantidadOrdenesCompra() {
    try {
        const response = await fetch('http://localhost:4000/api/proveedor/totalordenescompradas');
        if (!response.ok) {
            throw new Error('Error al obtener el número de compras');
        }
        const data = await response.json();
        const totalCompras = data.totalOrdenesCompra || 0;
        document.getElementById('compras').innerText = totalCompras;
    } catch (error) {
        document.getElementById("compras").innerText = 'Error';
        console.error("Error al obtener las órdenes:", error);
    }
}

async function costoCompra() {
    try {
        const response = await fetch('http://localhost:4000/api/proveedor/sumarprecioordenes');
        if (!response.ok) {
            throw new Error('Error al sumar las compras');
        }
        const data = await response.json();
        const costoCompra = data.totalPrecioPedido || 0;
        document.getElementById("costo").textContent = `$${costoCompra.toFixed(2)}`;
    } catch (error) {
        document.getElementById("costo").innerText = 'Error';
        console.error("Error al calcular la suma de las compras:", error);
    }
}

async function ordenesCanceladas() {
    try {
        const response = await fetch('http://localhost:4000/api/proveedor/contarordenescanceladas');
        if (!response.ok) {
            throw new Error('Error al obtener el número de ordenes canceladas');
        }
        const data = await response.json();
        const ordenesCanceladas = data.totalCanceladas || 0;
        document.getElementById('canceladas').innerText = ordenesCanceladas;
    } catch (error) {
        document.getElementById("canceladas").innerText = 'Error';
        console.error("Error al obtener las órdenes canceladas:", error);
    }
}

async function costoCompraDevueltas() {
    try {
        const response = await fetch('http://localhost:4000/api/proveedor/sumarprecioordenesdevueltas');
        if (!response.ok) {
            throw new Error('Error al sumar las compras devueltas');
        }
        const data = await response.json();
        const costoCompraRegresadas = data.totalPrecioPedidoRegresadas || 0;
        document.getElementById("devoluciones").textContent = `$${costoCompraRegresadas.toFixed(2)}`;
    } catch (error) {
        document.getElementById("devoluciones").innerText = 'Error';
        console.error("Error al calcular la suma de las compras:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch('http://localhost:4000/api/orden/productos-mas-vendidos');
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Error al obtener los datos:', data.error);
        return;
      }
  
      const tbody = document.getElementById("top-selling-tbody");
      tbody.innerHTML = "";
  
      data.topProducts.forEach((product) => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${product.nombre || ""}</td>
          <td>${product.cantidadVendida || ""}</td>
          <td>${product.cantidadRestante || ""}</td>
          <td>${product.precio ? `$ ${product.precio.toFixed(2)}` : ""}</td>
        `;
  
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    }
});  

costoCompraDevueltas();
ordenesCanceladas();
costoCompra();
cantidadOrdenesCompra();
cantidadCategoriasUnicas();
cantidadProveedores();
obtenerCantidadEnEspera();
obtenerSumaCantidades();
calculateSalesTotalToday();
countConfirmedOrders();
obtenerTotalProfit();
calculateSalesTotal();

async function fetchTopSellingProducts() {
    try {
        const response = await fetch('http://localhost:4000/api/orden/productos-mas-vendidos-sinLim');
        const data = await response.json();

        if (response.ok) {
            const tbody = document.getElementById('modal-top-selling-tbody');
            tbody.innerHTML = ''; // Limpiar contenido previo

            data.topProducts.forEach((product) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.nombre || 'N/A'}</td>
                    <td>${product.cantidadVendida || 'N/A'}</td>
                    <td>${product.cantidadRestante || 'N/A'}</td>
                    <td>${product.precio.toFixed(2) || 'N/A'}</td>
                `;
                tbody.appendChild(row);
            });
        } else {
            console.error('Error al obtener los productos más vendidos:', data.error);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';

    if (modalId === 'topSellingModal') {
        fetchTopSellingProducts();
    } else if ( modalId === 'lowStockModal' ) {
        openLowStockModal();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

async function cargarProductos() {
    try {
      const response = await fetch('http://localhost:4000/api/producto/lowproductos');
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }
      const productos = await response.json();
  
      const tableBody = document.querySelector('.low-stock-table tbody');
      tableBody.innerHTML = ''; // Limpiar la tabla
  
      productos.forEach(producto => {
        const row = `
          <tr>
            <td><img src="${producto.imagenUrl}" alt="${producto.nombre}" class="product-image"></td>
            <td>
              <p class="product-name">${producto.nombre}</p>
              <p class="remaining-quantity">Cantidad Restante: ${producto.cantidad} ${producto.unidad}</p>
            </td>
            <td><span class="low-stock-label">Bajo</span></td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    } catch (error) {
      console.error('Error al cargar los productos:', error.message);
    }
  }
  
  cargarProductos();  

  async function openLowStockModal() {
    console.log('openLowStockModal llamada');  // Verificar si la función es llamada
    try {
        const response = await fetch('http://localhost:4000/api/producto/lowproductos-sinLim');
        const data = await response.json();
        console.log(data); // Verificar los datos recibidos
        if (response.ok) {
            const modalBody = document.getElementById('modal-low-stock-tbody');
            modalBody.innerHTML = ''; // Limpiar el contenido anterior

            // Llenar el modal con los productos obtenidos
            data.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${product.imagenUrl}" alt="${product.nombre}" class="product-image"></td>
                    <td>${product.nombre}</td>
                    <td>${product.cantidad} ${product.unidad}</td>
                `;
                modalBody.appendChild(row);
            });

            // Abrir el modal
            document.getElementById('lowStockModal').style.display = 'block';
        } else {
            console.error('No se pudo obtener los productos');
        }
    } catch (error) {
        console.error('Error al obtener productos de baja disponibilidad:', error);
    }
}

// Función para cerrar el modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
    const ctx = document.getElementById('orderChart').getContext('2d');

    try {
        // Llamar al endpoint para obtener datos
        const response = await fetch('http://localhost:4000/api/proveedor/puntos');
        const data = await response.json();

        // Crear la gráfica con Chart.js
        new Chart(ctx, {
            type: 'bar', // Tipo de gráfica
            data: {
                labels: data.labels, // Nombres de los meses
                datasets: [
                    {
                        label: 'Compras',
                        data: data.compra, // Valores de compras
                        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Color para las barras de compras
                        borderColor: 'rgba(54, 162, 235, 1)', // Borde de las barras de compras
                        borderWidth: 1
                    },
                    {
                        label: 'Ventas',
                        data: data.venta, // Valores de ventas
                        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Color para las barras de ventas
                        borderColor: 'rgba(75, 192, 192, 1)', // Borde de las barras de ventas
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Resumen de Ventas y Compras (Por Mes)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true // Empieza desde cero en el eje Y
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al cargar los datos para la gráfica:', error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    // Obtener el contexto del canvas
    const ctx = document.getElementById('orderSummary').getContext('2d');

    try {
        // Hacer una solicitud al endpoint para obtener los datos
        const response = await fetch('http://localhost:4000/api/orden/ordenes/estadisticas');
        if (!response.ok) throw new Error('Error al obtener datos de estadísticas.');

        const data = await response.json();

        // Crear la gráfica de líneas con Chart.js
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels, // Etiquetas de los meses
                datasets: [
                    {
                        label: 'En Camino',
                        data: data['En Camino'], // Datos para "En Camino"
                        borderColor: 'rgba(255, 99, 132, 1)', // Color de la línea
                        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Color de relleno
                        fill: true, // Activar relleno
                    },
                    {
                        label: 'Confirmado',
                        data: data['Confirmado'], // Datos para "Confirmado"
                        borderColor: 'rgba(54, 162, 235, 1)', // Color de la línea
                        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de relleno
                        fill: true, // Activar relleno
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Meses',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Total de Ingresos',
                        },
                        beginAtZero: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error('Error al renderizar la gráfica:', error);
    }
});

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
