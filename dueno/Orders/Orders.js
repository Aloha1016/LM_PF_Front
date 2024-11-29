document.querySelector('#Producto .btn-primary').addEventListener('click', async () => {
    const nombreProducto = document.getElementById('productName').value;
    const productoId = document.getElementById('productId').value;
    const categoria = document.getElementById('category').value;
    const precioPedido = parseFloat(document.getElementById('orderValue').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const unidad = document.getElementById('unidad').value;
    const precioPieza = parseFloat(document.getElementById('precioPieza').value);
    const fechaEntrega = document.getElementById('deliveryDate').value;

    try {
        const response = await fetch('http://localhost:4000/api/orden/crearorden', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombreProducto,
                productoId,
                categoria,
                precioPedido,
                cantidad,
                unidad,
                precioPieza,
                fechaEntrega,
            }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.alerta ? result.alerta : 'Orden creada exitosamente');
            location.reload(); // Refresca la tabla de órdenes
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error creando la orden:', error);
        alert('Ocurrió un error inesperado');
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

const apiUrl = 'http://localhost:4000/api/orden/ordenes';
let currentPage = 1;
let totalPages = 1;
let filters = { estado: '', sortField: 'fechaEntrega', sortOrder: 'asc' };

const loadOrders = async (page = 1) => {
    try {
        const params = new URLSearchParams({
            page,
            limit: 6,
            ...filters,
        });

        const response = await fetch(`${apiUrl}?${params}`);
        if (!response.ok) {
            throw new Error('Error al cargar las órdenes');
        }

        const data = await response.json();
        updateOrdersTable(data.orders);
        updatePagination(data.page, data.totalPages);
    } catch (error) {
        console.error(error);
    }
};

const updateOrdersTable = (orders) => {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';

    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron órdenes</td></tr>';
        return;
    }

    orders.forEach(order => {
        const row = `
            <tr class="text-center">
                <td>${order.nombreProducto}</td>
                <td>$${order.precioPedido.toFixed(2)}</td>
                <td>${order.cantidad}</td>
                <td>${order.ordenId}</td>
                <td>${new Date(order.fechaEntrega).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</td>
                <td><span class="status ${order.estado.toLowerCase().replace(' ', '-')}">${order.estado}</span></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
};

const updatePagination = (page, total) => {
    currentPage = page;
    totalPages = total;

    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('prevButton').disabled = currentPage === 1;
    document.getElementById('nextButton').disabled = currentPage === totalPages;
};

// Manejo de eventos de paginación
document.getElementById('prevButton').addEventListener('click', () => {
    if (currentPage > 1) loadOrders(currentPage - 1);
});

document.getElementById('nextButton').addEventListener('click', () => {
    if (currentPage < totalPages) loadOrders(currentPage + 1);
});

// Manejo de filtros
document.getElementById('filtersForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const estado = document.getElementById('filterType').value;
    const sortField = document.getElementById('sortField').value;
    const sortOrder = document.getElementById('sortOrder').value;
    console.log('Estado recibido:', estado);
    filters = { estado, sortField, sortOrder };
    loadOrders(1);
});

document.getElementById("openFiltersModal").addEventListener("click", function () {
    const modal = new bootstrap.Modal(document.getElementById("filtersModal"));
    modal.show();
});

// Cargar órdenes iniciales
loadOrders();

document.querySelector('.historial').addEventListener('click', async () => {
    try {
        let allOrders = [];
        let currentPage = 1;
        let totalPages = 1;

        // Obtener las órdenes de todas las páginas
        while (currentPage <= totalPages) {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 6, // O cualquier número que establezca el límite de órdenes por página
                ...filters,
            });

            const response = await fetch(`http://localhost:4000/api/orden/ordenesall`);
            const data = await response.json();

            if (!response.ok) {
                alert('Error al obtener las órdenes');
                return;
            }

            // Combina las órdenes de esta página con las anteriores
            allOrders = [...allOrders, ...data.orders];
            totalPages = data.totalPages; // Actualiza el total de páginas
            currentPage++; // Pasa a la siguiente página
        }

        // Ordenar las órdenes por fecha de entrega de manera decreciente
        const orders = allOrders.sort((a, b) => new Date(b.fechaEntrega) - new Date(a.fechaEntrega));

        // Agrupar las órdenes por mes y año
        const groupedOrders = orders.reduce((acc, order) => {
            const orderDate = new Date(order.fechaEntrega);
            const monthYear = `${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`;
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(order);
            return acc;
        }, {});

        // Crear el PDF con jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Agregar título al PDF
        doc.setFontSize(18);
        doc.text('Historial de Órdenes', 14, 20);

        // Establecer estilo para la lista
        doc.setFontSize(12);
        let yPosition = 30;
        const pageHeight = doc.internal.pageSize.height; // Altura de la página

        // Agregar las órdenes agrupadas por mes
        for (const [monthYear, ordersInMonth] of Object.entries(groupedOrders)) {
            // Título del mes
            doc.setFontSize(14);
            doc.text(`${monthYear}`, 14, yPosition);
            yPosition += 10;

            // Detalles de las órdenes por fila
            doc.setFontSize(12);
            ordersInMonth.forEach(order => {
                const orderDetailsLine1 = [
                    `Producto: ${order.nombreProducto}`,
                    `Precio: $${order.precioPedido.toFixed(2)}`,
                    `Cantidad: ${order.cantidad}`,
                    `ID: ${order.ordenId}`,
                    `Entrega: ${new Date(order.fechaEntrega).toLocaleDateString()}`
                ].join(' | ');

                const orderDetailsLine2 = `Estado: ${order.estado}`;

                // Si estamos cerca del final de la página, agrega una nueva página
                if (yPosition + 30 > pageHeight) {
                    doc.addPage();
                    yPosition = 20; // Reiniciar posición en la nueva página
                }

                // Imprimir detalles en dos líneas
                doc.text(orderDetailsLine1, 14, yPosition);
                yPosition += 10; // Espaciado entre la primera y segunda línea
                doc.text(orderDetailsLine2, 14, yPosition);
                yPosition += 10; // Espaciado después de la segunda línea

                // Dibujar una línea debajo del registro
                doc.setDrawColor(200, 200, 200); // Color gris suave para la línea
                doc.line(14, yPosition, 200, yPosition); // Línea horizontal que separa registros
                yPosition += 5; // Espacio adicional después de la línea
            });

            yPosition += 10; // Espacio extra entre meses
        }

        // Descargar el PDF
        doc.save('historial_ordenes.pdf');
    } catch (error) {
        console.error('Error generando el PDF:', error);
        alert('Ocurrió un error al generar el PDF');
    }
});

const countOrdersLast7Days = async () => {
    try {
        // Llamada al endpoint
        const response = await fetch("http://localhost:4000/api/orden/ordenesall");
        if (!response.ok) throw new Error("Error al obtener las órdenes");

        // Parsear la respuesta
        const data = await response.json();
        const orders = data.orders;

        // Calcular el rango de los últimos 7 días
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Filtrar las órdenes
        const ordersLast7Days = orders.filter(order => {
            const orderDate = new Date(order.fechaEntrega);
            return orderDate >= sevenDaysAgo && orderDate <= today;
        });

        // Actualizar el contador en el DOM
        console.log(ordersLast7Days.length);
        document.getElementById("tot-orders").textContent = ordersLast7Days.length;
    } catch (error) {
        console.error("Error contando las órdenes de los últimos 7 días:", error);
        alert("Ocurrió un error al contar las órdenes recientes");
    }
};

const countOrdersLast7DaysConfirmed = async () => {
    try {
        // Llamada al endpoint
        const response = await fetch("http://localhost:4000/api/orden/ordenesall");
        if (!response.ok) throw new Error("Error al obtener las órdenes");

        // Parsear la respuesta
        const data = await response.json();
        const orders = data.orders;

        // Calcular el rango de los últimos 7 días
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Filtrar las órdenes (últimos 7 días y estado "Confirmado")
        const confirmedOrdersLast7Days = orders.filter(order => {
            const orderDate = new Date(order.fechaEntrega);
            return orderDate >= sevenDaysAgo && 
                   orderDate <= today && 
                   order.estado.toLowerCase() === "confirmado"; // Estado en minúsculas para evitar problemas
        });

        // Calcular el total de precioPedido
        const totalPrecioPedido = confirmedOrdersLast7Days.reduce((total, order) => {
            return total + order.precioPedido;
        }, 0);

        // Actualizar los valores en el DOM
        console.log("Órdenes confirmadas en los últimos 7 días:", confirmedOrdersLast7Days.length);
        console.log("Total de precioPedido:", totalPrecioPedido);

        document.getElementById("tot-received").textContent = confirmedOrdersLast7Days.length;
        document.getElementById("cost-received").textContent = `$${totalPrecioPedido.toFixed(2)}`;
    } catch (error) {
        console.error("Error contando las órdenes confirmadas de los últimos 7 días:", error);
        alert("Ocurrió un error al contar las órdenes recientes y calcular el total");
    }
};

const countOrdersLast7DaysReturned = async () => {
    try {
        // Llamada al endpoint
        const response = await fetch("http://localhost:4000/api/orden/ordenesall");
        if (!response.ok) throw new Error("Error al obtener las órdenes");

        // Parsear la respuesta
        const data = await response.json();
        const orders = data.orders;

        // Calcular el rango de los últimos 7 días
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Filtrar las órdenes (últimos 7 días y estado "devuelto")
        const ReturnedconfirmedOrdersLast7Days = orders.filter(order => {
            const orderDate = new Date(order.fechaEntrega);
            return orderDate >= sevenDaysAgo && 
                   orderDate <= today && 
                   order.estado.toLowerCase() === "devuelto"; // Estado en minúsculas para evitar problemas
        });

        // Calcular el total de precioPedido
        const totalPrecioPedido = ReturnedconfirmedOrdersLast7Days.reduce((total, order) => {
            return total + order.precioPedido;
        }, 0);

        // Actualizar los valores en el DOM
        console.log("Órdenes confirmadas en los últimos 7 días:", ReturnedconfirmedOrdersLast7Days.length);
        console.log("Total de precioPedido:", totalPrecioPedido);

        document.getElementById("tot-returned").textContent = ReturnedconfirmedOrdersLast7Days.length;
        document.getElementById("cost-returned").textContent = `$${totalPrecioPedido.toFixed(2)}`;
    } catch (error) {
        console.error("Error contando las órdenes confirmadas de los últimos 7 días:", error);
        alert("Ocurrió un error al contar las órdenes recientes y calcular el total");
    }
};

const countOrdersOnTheWay = async () => {
    try {
        // Llamada al endpoint
        const response = await fetch("http://localhost:4000/api/orden/ordenesall");
        if (!response.ok) throw new Error("Error al obtener las órdenes");

        // Parsear la respuesta
        const data = await response.json();
        const orders = data.orders;

        // Filtrar las órdenes con estado "En Camino"
        const onTheWayOrders = orders.filter(order => {
            return order.estado.toLowerCase() === "en camino"; // Estado en minúsculas para evitar problemas
        });

        // Calcular el total de precioPedido de las órdenes "En Camino"
        const totalPrecioPedido = onTheWayOrders.reduce((total, order) => {
            return total + order.precioPedido;
        }, 0);

        // Actualizar los valores en el DOM
        console.log("Órdenes 'En Camino':", onTheWayOrders.length);
        console.log("Total de precioPedido 'En Camino':", totalPrecioPedido);

        document.getElementById("ord-on-way").textContent = onTheWayOrders.length;
        document.getElementById("cost-on-way").textContent = `$${totalPrecioPedido.toFixed(2)}`;
    } catch (error) {
        console.error("Error contando las órdenes 'En Camino':", error);
        alert("Ocurrió un error al contar las órdenes 'En Camino' y calcular el total");
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    await countOrdersLast7Days();
    await countOrdersLast7DaysConfirmed();
    await countOrdersLast7DaysReturned();
    await countOrdersOnTheWay();
});
