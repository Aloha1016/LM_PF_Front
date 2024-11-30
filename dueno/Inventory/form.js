// Elementos del DOM
const form = document.querySelector('.form-container form');
const modal = document.getElementById('productModal');
const addProductBtn = document.getElementById('addProductBtn');
const closeModal = document.querySelector('.close');
const tableBody = document.querySelector('table tbody');
const productForm = document.getElementById('productForm');
const discardButton = document.querySelector('.discard');
const imagePlaceholder = document.getElementById('image-placeholder');
const fileInput = document.querySelector('input[name="imagen"]');

// Mostrar selector de archivos al hacer clic en el placeholder
imagePlaceholder.addEventListener('click', () => fileInput.click());

// Actualizar el placeholder con la imagen seleccionada
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const image = new Image();
            image.src = e.target.result;
            imagePlaceholder.innerHTML = ''; // Limpiar contenido actual
            imagePlaceholder.appendChild(image); // Mostrar la nueva imagen
            image.style.maxWidth = '100%'; // Ajustar el tamaño
        };
        reader.readAsDataURL(file); // Leer imagen como Data URL
    } else {
        imagePlaceholder.textContent = 'No file selected';
    }
});

// Abrir y cerrar el modal de productos
addProductBtn.addEventListener('click', () => (modal.style.display = 'flex'));
closeModal.addEventListener('click', () => (modal.style.display = 'none'));
window.addEventListener('click', (event) => {
    if (event.target === modal) modal.style.display = 'none';
});

// Enviar formulario de productos
productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(productForm);
    try {
        const response = await fetch('http://localhost:4000/api/producto/crearproducto', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            alert('Producto creado exitosamente');
            productForm.reset();
            location.reload();
        } else {
            const error = await response.json();
            alert(`Error al crear el producto: ${error.error}`);
        }
    } catch (err) {
        alert(`Ocurrió un error: ${err.message}`);
    }
});

// Limpiar formulario con botón "Descartar"
discardButton.addEventListener('click', () => productForm.reset());

function renderProducts(productos) {
    tableBody.innerHTML = '';
    productos.forEach((producto) => {
        const row = `
            <tr>
                <td>
                    <a href="./Details.html?productId=${producto.productId}" class="product-link">${producto.nombre}</a>
                </td>
                <td>$${producto.precioCompra.toFixed(2)}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.valorUmbral}</td>
                <td>${producto.fechaCaducidad}</td>
                <td>
                    <span class="${
                        producto.estado === 'Agotado'
                            ? 'out-stock'
                            : producto.estado === 'Poca disponibilidad'
                            ? 'low-stock'
                            : 'in-stock'
                    }">${producto.estado}</span>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Actualizar paginación
function updatePagination(page, totalPages) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = `
        <button ${page === 1 ? 'disabled' : ''} onclick="loadPage(${page - 1})">Anterior</button>
        <span>Página ${page} de ${totalPages}</span>
        <button ${page === totalPages ? 'disabled' : ''} onclick="loadPage(${page + 1})">Siguiente</button>
    `;
}

// Cargar una página específica
async function loadPage(page) {
    const params = new URLSearchParams(new FormData(document.getElementById('filtersForm')));
    params.set('page', page);
    try {
        const response = await fetch(`http://localhost:4000/api/producto/productos?${params.toString()}`);
        if (response.ok) {
            const { productos, page, totalPages } = await response.json();
            renderProducts(productos);
            updatePagination(page, totalPages);
        } else {
            console.error('Error al cargar los productos:', response.statusText);
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
}

// Mostrar filtros en un modal
document.addEventListener('DOMContentLoaded', () => {
    const filtersModal = document.getElementById('filtersModal');
    const openFiltersButton = document.getElementById('openFiltersBtn');
    const closeFiltersButton = filtersModal.querySelector('.close');
    const discardFiltersButton = filtersModal.querySelector('.discard');

    openFiltersButton.addEventListener('click', () => (filtersModal.style.display = 'flex'));
    closeFiltersButton.addEventListener('click', () => (filtersModal.style.display = 'none'));
    discardFiltersButton.addEventListener('click', () => (filtersModal.style.display = 'none'));

    window.addEventListener('click', (event) => {
        if (event.target === filtersModal) filtersModal.style.display = 'none';
    });
});

// Manejar la aplicación de filtros
document.getElementById('filtersForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar recarga de página
    
    // Capturar los parámetros del formulario
    const params = new URLSearchParams(new FormData(event.target));
    
    try {
        // Llamar al servidor con los filtros
        const response = await fetch(`http://localhost:4000/api/producto/productos?${params.toString()}`);
        if (response.ok) {
            const { productos, page, totalPages } = await response.json();
            renderProducts(productos); // Actualizar productos en la tabla
            updatePagination(page, totalPages); // Actualizar paginación
            document.getElementById('filtersModal').style.display = 'none'; // Cerrar el modal de filtros
        } else {
            console.error('Error al aplicar los filtros:', response.statusText);
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
});

const discardFiltersButton = document.querySelector('.discard');
discardFiltersButton.addEventListener('click', () => {
    document.getElementById('filtersForm').reset(); // Restablecer formulario
    loadPage(1); // Recargar productos sin filtros
    document.getElementById('filtersModal').style.display = 'none'; // Cerrar el modal
});

document.getElementById('descarga').addEventListener('click', async function () {
    try {
        // Obtener los productos desde la API
        const response = await fetch('http://localhost:4000/api/producto/productosall');
        if (!response.ok) {
            throw new Error('No se pudieron obtener los productos');
        }

        const productos = await response.json();

        // Crear el documento PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Agregar título al PDF
        doc.setFontSize(18);
        doc.text('Productos', 20, 20);

        // Preparar las filas de la tabla para el PDF
        const tableRows = productos.map(producto => [
            producto.nombre,
            `$${producto.precioCompra.toFixed(2)}`, // Formato de precio
            producto.cantidad,
            producto.valorUmbral,
            producto.fechaCaducidad,
            producto.estado,
        ]);

        // Agregar las filas al PDF usando autoTable
        doc.autoTable({
            head: [['Nombre', 'Precio de Compra', 'Cantidad', 'Valor Umbral', 'Fecha de Caducidad', 'Estado']],
            body: tableRows,
            startY: 30
        });

        // Descargar el archivo PDF
        doc.save('productos.pdf');
    } catch (error) {
        console.error('Error al generar el PDF:', error);
    }
});

// Inicializar la página con la primera carga de productos
document.addEventListener('DOMContentLoaded', () => loadPage(1));

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

async function obtenerCantidadEconomica() {
    try {
        const response = await fetch('http://localhost:4000/api/producto/calcular-total-dinero');
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        document.getElementById('existeEco').textContent = `$${data.totalDinero.toFixed(2)}`;
    } catch (error) {
        console.error('Error al obtener las ganancias:', error);
    }
}

async function cantidadSieteDias() {
    try {
        const response = await fetch('http://localhost:4000/api/orden/cantidad-vendida-7dias');
        if (!response.ok) {
            throw new Error('Error al obtener suma de compras');
        }
        const data = await response.json();
        const cantidadVentas = data.totalCantidad || 0;
        document.getElementById('ventasP').innerText = cantidadVentas;
    } catch (error) {
        document.getElementById("ventasP").innerText = 'Error';
        console.error("Error al obtener las categorías únicas:", error);
    }
}

async function obtenerIngresosSieteDiaz() {
    try {
        const response = await fetch('http://localhost:4000/api/orden/suma-precioPedido-7dias');
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        document.getElementById('ingresosP').textContent = `$${data.totalPrecioPedido.toFixed(2)}`;
    } catch (error) {
        console.error('Error al obtener las ganancias:', error);
    }
}

async function productosAgotados() {
    try {
        const response = await fetch('http://localhost:4000/api/producto/productosAgotados');
        if (!response.ok) {
            throw new Error('Error al obtener los productos Agotados');
        }
        const data = await response.json();
        const cantidadAgotados = data.productosAgotados || 0;
        document.getElementById('Agotados').innerText = cantidadAgotados;
    } catch (error) {
        document.getElementById("Agotados").innerText = 'Error';
        console.error("Error al obtener las categorías únicas:", error);
    }
}

async function productosPD() {
    try {
        const response = await fetch('http://localhost:4000/api/producto/productosPD');
        if (!response.ok) {
            throw new Error('Error al obtener los productos Agotados');
        }
        const data = await response.json();
        const cantidadPD = data.productosPD || 0;
        document.getElementById('PD').innerText = cantidadPD;
    } catch (error) {
        document.getElementById("PD").innerText = 'Error';
        console.error("Error al obtener las categorías únicas:", error);
    }
}

productosPD();
productosAgotados();
obtenerIngresosSieteDiaz();
cantidadSieteDias();
obtenerCantidadEconomica();
obtenerSumaCantidades();
cantidadCategoriasUnicas();
