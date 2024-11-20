const form = document.querySelector('.form-container form');
const modal = document.getElementById('productModal');
const addProductBtn = document.getElementById('addProductBtn');
const closeModal = document.querySelector('.close');
const tableBody = document.querySelector('table tbody');
const imageInput = document.getElementById('image-input');
const placeholder = document.getElementById('image-placeholder');

// Evento para manejar la selección de imagen
imageInput.addEventListener('change', function (event) {
    const file = event.target.files[0]; // Obtener el archivo seleccionado

    if (file) {
        const reader = new FileReader(); // Crear un lector de archivos

        reader.onload = function (e) {
            // Actualizar el placeholder con la imagen seleccionada
            placeholder.style.backgroundImage = `url(${e.target.result})`;
            placeholder.style.backgroundSize = 'cover';
            placeholder.style.backgroundPosition = 'center';
            placeholder.innerHTML = ''; // Eliminar texto dentro del placeholder
        };

        reader.readAsDataURL(file); // Leer el archivo como DataURL
    }

    // Restablecer el input para permitir seleccionar la misma imagen nuevamente
    imageInput.value = '';
});

// Evento para abrir el selector de archivos al hacer clic en el placeholder
placeholder.addEventListener('click', function () {
    imageInput.click(); // Simula un clic en el input
});

addProductBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Enviar datos del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form); // Recolectar los datos del formulario

    try {
        const response = await fetch('http://localhost:4000/api/producto/crearproducto', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            alert('Producto creado exitosamente');
            modal.style.display = 'none';
            form.reset();
            loadProducts(); // Actualizar tabla de productos
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (err) {
        alert('Error al conectar con el servidor');
        console.error(err);
    }
});

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:4000/api/producto/productos'); // Solicitar productos al backend
        if (response.ok) {
            const productos = await response.json();
            tableBody.innerHTML = ''; // Limpiar la tabla

            productos.forEach((producto) => {
                const row = `
                    <tr>
                        <td>${producto.nombre}</td>
                        <td>₹${producto.precioCompra}</td>
                        <td>${producto.cantidad}</td>
                        <td>${producto.valorUmbral}</td>
                        <td>${producto.fechaCaducidad}</td>
                        <td><span class="${producto.estado === 'Agotado' ? 'out-stock' : 'in-stock'}">${producto.estado}</span></td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (err) {
        alert('Error al conectar con el servidor');
        console.error(err);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', loadProducts);
