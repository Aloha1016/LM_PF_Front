window.adjustmentsChart = null;

if (window.adjustmentsChart instanceof Chart) {
    window.adjustmentsChart.destroy();
}

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-btn");
    const indicator = document.querySelector(".tab-indicator");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            // Eliminar clase activa de todas las pestañas
            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // Añadir clase activa a la pestaña seleccionada
            tab.classList.add("active");
            tabContents[index].classList.add("active");

            // Animar la línea indicadora
            const tabWidth = tab.offsetWidth;
            const tabLeft = tab.offsetLeft;

            indicator.style.width = `${tabWidth}px`;
            indicator.style.left = `${tabLeft}px`;
        });
    });

    // Inicializar la posición del indicador en la pestaña activa por defecto
    const activeTab = document.querySelector(".tab-btn.active");
    if (activeTab) {
        const tabWidth = activeTab.offsetWidth;
        const tabLeft = activeTab.offsetLeft;
        indicator.style.width = `${tabWidth}px`;
        indicator.style.left = `${tabLeft}px`;
    }
});

// Obtener el productId de los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');

// Función para obtener detalles del producto
async function loadProductDetails() {
    try {
        const response = await fetch(`http://localhost:4000/api/producto/producto/${productId}`);
        const producto = await response.json();
        if (response.ok) {
            // Actualiza el DOM con los nuevos datos
            document.querySelector("#nombreProducto").textContent = producto.nombre;
            document.querySelector("#productoId").textContent = producto.productId;
            document.querySelector("#categoria").textContent = producto.categoria;
            document.querySelector("#cantidad").textContent = producto.cantidad;
            document.querySelector("#fechaCaducidad2").textContent = producto.fechaCaducidad;
            document.querySelector("#precioCompra2").textContent = producto.precioCompra;
            document.querySelector("#valorUmbral2").textContent = producto.valorUmbral;
            document.querySelector("#estado").textContent = producto.estado;
            document.querySelector("#imagenProducto").src = producto.imagenUrl || 'https://via.placeholder.com/150';
            document.querySelector("#nombreProveedor").textContent = producto.nombreProveedor;
            document.querySelector("#numeroContacto").textContent = producto.numeroContacto;
            document.querySelector("#cantidadProveedor").textContent = producto.cantidadProveedor;
        } else {
            console.error('Error al cargar los detalles del producto:', response.statusText);
        }        
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
}

if (!productId) {
    console.error('productId no encontrado en la URL');
} else {
    loadProductDetails(productId);
}

document.addEventListener("DOMContentLoaded", async () => {
    const productId = urlParams.get('productId');
    try {
        const response = await fetch(`http://localhost:4000/api/producto/productoTienda/${productId}`);
        const producto = await response.json();
        console.log(producto); // Inspecciona la respuesta aquí.
        
        if (producto.cantidadesTiendas) {
            const tablaBody = document.querySelector(".stock-table tbody");
            tablaBody.innerHTML = "";

            producto.cantidadesTiendas.forEach(({ tienda, cantidad }) => {
                const fila = document.createElement("tr");

                const celdaTienda = document.createElement("td");
                celdaTienda.textContent = tienda;

                const celdaCantidad = document.createElement("td");
                const spanCantidad = document.createElement("span");
                spanCantidad.textContent = cantidad;
                celdaCantidad.appendChild(spanCantidad);

                fila.appendChild(celdaTienda);
                fila.appendChild(celdaCantidad);
                tablaBody.appendChild(fila);
            });
        } else {
            console.error("No se encontró el campo 'cantidadesTiendas'");
        }
    } catch (error) {
        console.error("Error al obtener los datos del producto:", error);
    }
});

document.querySelector("#downloadBtn").addEventListener("click", () => {
    // Crear una instancia de jsPDF usando el nuevo método de importación
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Encabezado estilizado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Detalles del Producto", 105, 15, { align: "center" });
    
    // Línea decorativa bajo el título
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 20, 190, 20);

    // Configurar el estilo general
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Información del producto (sección 1)
    doc.text("Información General:", 20, 30);
    doc.line(20, 32, 190, 32);
    doc.text(`Nombre del Producto: ${document.querySelector("#nombreProducto").textContent}`, 20, 40);
    doc.text(`Producto ID: ${document.querySelector("#productoId").textContent}`, 20, 50);
    doc.text(`Categoría: ${document.querySelector("#categoria").textContent}`, 20, 60);

    // Información adicional (sección 2)
    doc.text("Detalles Adicionales:", 20, 70);
    doc.line(20, 72, 190, 72);
    doc.text(`Precio de Compra: ${document.querySelector("#precioCompra").textContent}`, 20, 80);
    doc.text(`Cantidad: ${document.querySelector("#cantidad").textContent}`, 20, 90);
    doc.text(`Fecha de Caducidad: ${document.querySelector("#fechaCaducidad").textContent}`, 20, 100);
    doc.text(`Valor Umbral: ${document.querySelector("#valorUmbral").textContent}`, 20, 110);

    // Información del proveedor (sección 3)
    doc.text("Información del Proveedor:", 20, 120);
    doc.line(20, 122, 190, 122);
    doc.text(`Nombre del Proveedor: ${document.querySelector("#nombreProveedor").textContent}`, 20, 130);
    doc.text(`Número de Contacto: ${document.querySelector("#numeroContacto").textContent}`, 20, 140);
    doc.text(`Cantidad en Proveedor: ${document.querySelector("#cantidadProveedor").textContent}`, 20, 150);

    // Pie de página con una nota adicional
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Documento generado automáticamente. Verifique los datos antes de su uso.", 105, 290, { align: "center" });

    // Descargar el PDF
    doc.save('detalles_producto.pdf');
});


document.getElementById('updateProductForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener los valores del formulario
    const fechaCaducidad = document.getElementById('fechaCaducidad').value;
    const precioCompra = document.getElementById('precioCompra').value;
    const valorUmbral = document.getElementById('valorUmbral').value;

    // Obtener el `productId` de algún lugar, por ejemplo, una variable global o elemento del DOM
    const productId = document.getElementById('productoId').innerText; // Asegúrate de que este ID exista

    // Preparar los datos para enviar
    const updatedData = {
        fechaCaducidad,
        precioCompra,
        valorUmbral
    };

    try {
        // Realizar la solicitud PUT al servidor
        const response = await fetch(`http://localhost:4000/api/producto/actualizarproducto/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Producto actualizado exitosamente');
            await loadProductDetails(); // Recargar datos del servidor
            document.getElementById('productModal').style.display = 'none'; // Cerrar modal
        } else {
            throw new Error(result.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert('Error al actualizar el producto. Por favor, inténtalo nuevamente.');
    }
});

// Seleccionar el botón "Editar" y el modal
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const closeModal = document.querySelector('.close');

// Abrir el modal al hacer clic en el botón "Editar"
addProductBtn.addEventListener('click', () => {
    productModal.style.display = 'block';
});

// Cerrar el modal al hacer clic en la "X"
closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

// Cerrar el modal al hacer clic fuera de su contenido
window.addEventListener('click', (event) => {
    if (event.target === productModal) {
        productModal.style.display = 'none';
    }
});

  document.addEventListener("DOMContentLoaded", async () => {
    const productId = urlParams.get('productId');
    if (!productId) {
      console.error('productId no encontrado en la URL');
      return;
    }
  
    await loadProductDetails(productId);
    await loadSupplierOrders(productId);
    await loadSupplierOrdersSales(productId);
    await loadAdjustments(productId);
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

tabs.forEach((tab, index) => {
    tab.addEventListener("click", async () => {
        // Eliminar clase activa de todas las pestañas
        tabs.forEach(t => t.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));

        // Añadir clase activa a la pestaña seleccionada
        tab.classList.add("active");
        tabContents[index].classList.add("active");

        // Animar la línea indicadora
        const tabWidth = tab.offsetWidth;
        const tabLeft = tab.offsetLeft;
        indicator.style.width = `${tabWidth}px`;
        indicator.style.left = `${tabLeft}px`;

        // Cargar contenido dinámico
        const dataTarget = tab.getAttribute("data-target");
        const productId = urlParams.get("productId");

        if (dataTarget === "Adjustments") {
            if (productId) {
                console.log("Cargando ajustes...");
                await loadAdjustments(productId);
            } else {
                console.error("productId no encontrado en la URL para 'Adjustments'.");
            }
        }
    });
});

async function loadSupplierOrders(productId) {
    try {
      const response = await fetch(`http://localhost:4000/api/producto/producto/${productId}/ordenes`);
      const data = await response.json();
  
      if (response.ok) {
        const tablaBody = document.querySelector("#purchases tbody");
        tablaBody.innerHTML = "";
  
        data.ordenes.forEach(orden => {
          const fila = document.createElement("tr");
  
          fila.innerHTML = `
            <td>${orden.nombreProducto}</td>
            <td>${orden.categoria}</td>
            <td>${orden.nombreProveedor}</td>
            <td>${orden.correoProveedor}</td>
            <td>${orden.fechaEntrega}</td>
            <td>${orden.estado}</td>
          `;

          tablaBody.appendChild(fila);
        });
      } else {
        console.error('Error al cargar las órdenes a proveedores:', data.error);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  }
  
  async function loadSupplierOrdersSales(productId) {
    try {
        console.log(`Fetching orders for product ID: ${productId}`);
        const response = await fetch(`http://localhost:4000/api/producto/ordenes/${productId}/ordenesCliente`);
        const data = await response.json();
  
        console.log("Response data:", data);
  
        if (response.ok) {
            const tablaBody = document.querySelector("#history tbody");
            tablaBody.innerHTML = ""; // Limpiar la tabla antes de llenarla
  
            data.ordenClientes.forEach(orden => {
                console.log("Order details:", orden);
  
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${orden.nombreProducto}</td>
                    <td>${orden.categoria}</td>
                    <td>${orden.unidad}</td>
                    <td>${orden.cantidad}</td>
                    <td>${orden.precioPedido}</td>
                    <td>${orden.fechaEntrega}</td>
                    <td>${orden.estado}</td>
                `;
                tablaBody.appendChild(fila);
            });
        } else {
            console.error('Error al cargar las órdenes del producto:', data.error);
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
  }
  
  async function loadAdjustments(productId) {
    try {
        const response = await fetch(`http://localhost:4000/api/producto/ordenesPuntos/${productId}/ordenesClienteP`);
        const data = await response.json();

        console.log("Data received for adjustments:", data);

        if (response.ok) {
            renderChart(data.labels, data.precioPedido);
        } else {
            console.error('Error al cargar ajustes:', data.error);
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
}

document.getElementById('adjustments').style.display = 'block';

function renderChart(labels, data) {
    console.log("Labels:", labels);
    console.log("Data:", data);

    const ctx = document.getElementById('adjustmentsChart').getContext('2d');

    // Verificar y destruir el gráfico existente
    if (window.adjustmentsChart instanceof Chart) {
        window.adjustmentsChart.destroy();
    }

    // Crear un nuevo gráfico
    window.adjustmentsChart = new Chart(ctx, {
        type: 'line', // Tipo de gráfico
        data: {
            labels: labels, // Etiquetas de los últimos 30 días
            datasets: [
                {
                    label: 'Ventas en los últimos 30 días',
                    data: data, // Datos del precioPedido
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Historial de Ventas del Producto',
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                },
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}
