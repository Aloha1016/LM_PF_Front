const form = document.querySelector('.form-container form');
const modal = document.getElementById('productModal');
const addProductBtn = document.getElementById('addProductBtn');
const closeModal = document.querySelector('.close');
const tableBody = document.querySelector('table tbody');
const productForm = document.getElementById('productForm');
const discardButton = document.querySelector('.discard');
const imagePlaceholder = document.getElementById('image-placeholder');
const fileInput = document.querySelector('input[name="imagen"]'); // El input de tipo file

// Mostrar el selector de archivos cuando se haga clic en el placeholder
imagePlaceholder.addEventListener('click', () => {
    fileInput.click(); // Esto abre el selector de archivos
});

// Actualizar el placeholder con la imagen seleccionada
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        // Evento cuando el archivo se carga correctamente
        reader.onload = function(e) {
            // Crear un nuevo elemento de imagen
            const image = new Image();
            image.src = e.target.result; // Asignar la URL de la imagen leída

            // Limpiar el contenido actual del placeholder
            imagePlaceholder.innerHTML = ''; 

            // Mostrar la imagen
            imagePlaceholder.appendChild(image);

            // Establecer un tamaño adecuado para la imagen, si es necesario
            image.style.maxWidth = '100%'; // Ajusta el tamaño de la imagen si lo necesitas
        };

        // Leer la imagen como un Data URL (esto convierte la imagen en un string base64)
        reader.readAsDataURL(file);
    } else {
        imagePlaceholder.textContent = 'No file selected';
    }
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

productForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previene que la página se recargue

    // Crear un objeto FormData con los datos del formulario
    const formData = new FormData(productForm);

    try {
        // Enviar los datos al backend
        const response = await fetch('http://localhost:4000/api/producto/crearproducto', { // Usamos ruta relativa
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            alert('Producto creado exitosamente');
            console.log('Resultado del servidor:', result);

            // Limpiar el formulario después de enviarlo
            productForm.reset();

            // Recargar la página para ver los cambios
            location.reload();  // Esto actualiza la página automáticamente
        } else {
            const error = await response.json();
            alert(`Error al crear el producto: ${error.error}`);
        }
    } catch (err) {
        alert(`Ocurrió un error: ${err.message}`);
        console.error('Error al enviar el formulario:', err);
    }
});

// Manejar el botón "Descartar"
discardButton.addEventListener('click', () => {
    productForm.reset();
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
                        <td><span class="${
                            producto.estado === 'Agotado'
                                ? 'out-stock'
                                : producto.estado === 'Poca disponibilidad'
                                ? 'low-stock'
                                : 'in-stock'
                        }">${producto.estado}</span></td>
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
