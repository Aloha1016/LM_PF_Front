const modal = document.getElementById("supplierModal");
const addProductBtn = document.getElementById("addProductBtn");
const closeModal = document.querySelector(".close");
const supplierForm = document.getElementById("supplierForm");
const supplierTable = document.querySelector(".suppliers-table tbody");
const browseImageLink = document.getElementById("browseImageLink");
const imageInput = document.getElementById("imageInput");
const imagePlaceholder = document.getElementById("imagePlaceholder");
const placeholderIcon = document.getElementById("placeholderIcon");
const placeholderText = document.getElementById("placeholderText");
const filtersModal = document.getElementById("filtersModal");
const filtersBtn = document.getElementById("Filtros");
const closeFilters = filtersModal.querySelector(".close");
const filtersForm = document.getElementById("filtersForm");
const cancelFiltersBtn = filtersModal.querySelector(".discard");
const discardBtn = document.querySelector(".Cancelar");

discardBtn.addEventListener("click", () => {
    modal.style.display = "none"; 
});


imagePlaceholder.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Remover el texto y el icono
            placeholderIcon.style.display = "none";
            placeholderText.style.display = "none";

            // Crear un elemento <img> y agregarlo al contenedor
            const img = document.createElement("img");
            img.src = e.target.result;

            // Reemplazar cualquier imagen previa
            const existingImg = imagePlaceholder.querySelector("img");
            if (existingImg) {
                imagePlaceholder.removeChild(existingImg);
            }

            imagePlaceholder.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

/*
// Activar explorador de archivos al hacer clic en "Browse image"
browseImageLink.addEventListener("click", (event) => {
    event.preventDefault();
    imageInput.click(); // Disparar clic en el input de archivo
});
*/

// Abrir el modal
addProductBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

// Cerrar el modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Cerrar modal al hacer clic fuera de él
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

supplierForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(supplierForm);

    try {
        const response = await fetch("http://localhost:4000/api/proveedor/crearproveedor", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            console.log("Proveedor creado:", result.message);
        
            // Reiniciar los filtros y volver a cargar desde la primera página
            currentPage = 1;
            lastDocId = null;
            lastDocAt = null;
            await loadProveedores(currentPage);
        
            // Cerrar el modal y limpiar el formulario
            modal.style.display = "none";
            supplierForm.reset();
            const existingImg = imagePlaceholder.querySelector("img");
            if (existingImg) {
                imagePlaceholder.removeChild(existingImg);
            }
            placeholderIcon.style.display = "block";
            placeholderText.style.display = "block";
        } else {
            console.error("Error de respuesta:", result.error);
            alert(result.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al crear el proveedor.");
    }
});

let currentPage = 1;
const limit = 9;

let currentFilters = {
    filterType: null,
    sortField: "nombreProveedor",
    sortOrder: "asc",
};

let history = [];  // Para almacenar los documentos anteriores
let lastDocId = null;  // ID del último documento cargado
let lastDocAt = null;  // Documento de referencia para la paginación

const loadProveedores = async (page) => {
    try {
        const { filterType, sortField, sortOrder } = currentFilters;

        // Verifica si se tiene un ID del último documento cargado
        const response = await fetch(
            `http://localhost:4000/api/proveedor/proveedores?page=${page}&limit=${limit}&filterType=${filterType}&sortField=${sortField}&sortOrder=${sortOrder}&startAfter=${lastDocId || ''}&startAt=${lastDocAt || ''}`
        );
        const data = await response.json();

        if (response.ok) {
            supplierTable.innerHTML = "";  // Limpiar la tabla antes de cargar nuevos datos
            lastDocId = data.startAfter || null;  // Actualiza el lastDocId
            lastDocAt = data.startAt || null;    // Actualiza el lastDocAt

            // Si no hay proveedores, ocultamos la paginación
            if (data.proveedores.length === 0) {
                document.querySelector(".pagination").style.display = "none";
            } else {
                // Mostrar los proveedores en la tabla
                data.proveedores.forEach((proveedor) => {
                    supplierTable.innerHTML += `
                        <tr>
                            <td>${proveedor.nombreProveedor}</td>
                            <td>${proveedor.producto}</td>
                            <td>${proveedor.numeroContacto}</td>
                            <td>${proveedor.correo}</td>
                            <td class="status ${proveedor.Tipo === "Acepta devolucion" ? "taking-return" : "not-taking-return"}">
                                ${proveedor.Tipo === "Acepta devolucion" ? "Acepta devolucion" : "No acepta devolucion"}
                            </td>
                            <td>${proveedor.enCamino || "-"}</td>
                        </tr>
                    `;
                });

                // Actualizar la paginación
                document.querySelector(".pagination span").textContent = `Page ${data.page} of ${data.totalPages}`;
                document.getElementById("Atras").disabled = data.page <= 1; // Deshabilitar botón de atrás si estamos en la primera página
                document.getElementById("Siguiente").disabled = data.page >= data.totalPages; // Deshabilitar botón de siguiente si estamos en la última página
            }
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Error al cargar proveedores:", error);
    }
};

// Función para retroceder una página
document.getElementById("Atras").addEventListener("click", () => {
    if (history.length > 0) {
        // Elimina el último elemento del historial
        history.pop();
        // El último elemento del historial ahora será el nuevo `lastDocId`
        lastDocId = history[history.length - 1]; // Actualiza el lastDocId con el historial
        currentPage--; // Decrementa la página actual
        loadProveedores(currentPage); // Cargar la página anterior
    }
});

// Función para avanzar una página
document.getElementById("Siguiente").addEventListener("click", () => {
    if (lastDocId) {
        history.push(lastDocId); // Guardamos el ID del último documento
        currentPage++;  // Incrementamos la página actual
        loadProveedores(currentPage); // Cargar la página siguiente
    }
});

filtersForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    currentFilters.filterType = filtersForm.filterType.value;
    currentFilters.sortField = filtersForm.sortField.value;
    currentFilters.sortOrder = filtersForm.sortOrder.value;

    currentPage = 1; // Reiniciar la página
    lastDocId = null; // Reiniciar el ID del último documento
    lastDocAt = null; // Reiniciar el documento de referencia
    await loadProveedores(currentPage); // Volver a cargar

    // Cerrar el modal después de aplicar los filtros
    filtersModal.style.display = "none";
});

// Llamar a loadProveedores inicialmente
loadProveedores(1);

// Cargar la primera página al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    loadProveedores(currentPage);
});

/*
document.getElementById("Siguiente").addEventListener("click", () => {
    currentPage++;
    loadProveedores(currentPage);
});

document.getElementById("Atras").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadProveedores(currentPage);
    }
});
*/

// Abrir el modal de filtros
filtersBtn.addEventListener("click", () => {
    filtersModal.style.display = "flex";
});

// Cerrar el modal de filtros con la "x"
closeFilters.addEventListener("click", () => {
    filtersModal.style.display = "none";
});

// Cerrar modal de filtros al hacer clic fuera de él
window.addEventListener("click", (event) => {
    if (event.target === filtersModal) {
        filtersModal.style.display = "none";
    }
});

cancelFiltersBtn.addEventListener("click", () => {
    filtersModal.style.display = "none";
});

filtersForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    currentFilters.filterType = filtersForm.filterType.value;
    currentFilters.sortField = filtersForm.sortField.value;
    currentFilters.sortOrder = filtersForm.sortOrder.value;

    currentPage = 1; // Reiniciar la página
    lastDocId = null; // Reiniciar el ID del último documento
    lastDocAt = null; // Reiniciar el documento de referencia
    await loadProveedores(currentPage); // Volver a cargar

    filtersModal.style.display = "none"; // Cerrar modal de filtros
});

document.getElementById("Download").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Lista de Proveedores", 14, 16);

    let page = 1;
    const limit = 9; // Limitar la cantidad de proveedores por página
    let allRows = []; // Acumular todos los registros
    let noMorePages = false; // Bandera para saber si ya no hay más páginas
    let lastDocId = null; // Almacenar el último documento de cada página

    try {
        while (!noMorePages) {
            // Construir la URL de la API con parámetros para paginación
            let url = `http://localhost:4000/api/proveedor/proveedores?page=${page}&limit=${limit}`;
            if (lastDocId) {
                // Si existe un `startAfter` (es decir, no es la primera página), lo pasamos en la URL
                url += `&startAfter=${lastDocId}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                if (data.proveedores && Array.isArray(data.proveedores)) {
                    // Acumular los proveedores obtenidos
                    const rows = data.proveedores.map((proveedor) => [
                        proveedor.nombreProveedor,
                        proveedor.producto,
                        proveedor.numeroContacto,
                        proveedor.correo,
                        proveedor.Tipo,
                        proveedor.enCamino || "No disponible",
                    ]);
                    allRows = [...allRows, ...rows];

                    // Actualizar el `lastDocId` con el id del último proveedor de esta página
                    lastDocId = data.startAfter;

                    // Si ya no hay más páginas, detener el ciclo
                    if (data.noMorePages) {
                        noMorePages = true;
                    } else {
                        page++; // Incrementar la página
                    }
                } else {
                    console.error("Estructura de datos no válida:", data);
                    alert("La respuesta de la API no tiene el formato esperado.");
                    break;
                }
            } else {
                console.error("Error al obtener los datos:", response.statusText);
                alert("No se pudieron obtener los datos de los proveedores.");
                break;
            }
        }

        // Si se han acumulado proveedores, crear el PDF
        if (allRows.length > 0) {
            doc.autoTable({
                head: [["Nombre del Proveedor", "Producto", "Contacto", "Correo", "Tipo", "En Camino"]],
                body: allRows,
                startY: 22,
            });

            // Descargar el archivo PDF
            doc.save("proveedores.pdf");
        } else {
            alert("No se encontraron proveedores.");
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        alert("Ocurrió un problema al generar el PDF.");
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

const orderModal = document.getElementById('orderModal'); 
const createOrderBtn = document.getElementById('createOrderBtn'); 
const closeOrderModal = orderModal.querySelector('.close'); 

createOrderBtn.addEventListener('click', () => {
    orderModal.style.display = 'flex'; 
});

closeOrderModal.addEventListener('click', () => {
    orderModal.style.display = 'none'; 
});

window.addEventListener('click', (event) => {
    if (event.target === orderModal) {
        orderModal.style.display = 'none'; 
    }
});

document.getElementById('fechaEntrega').min = new Date().toISOString().split("T")[0];

    document.getElementById('nombreProducto').addEventListener('input', async () => {
        const producto = document.getElementById('nombreProducto').value.trim();
        const proveedorSelect = document.getElementById('nombreProveedor');
        const correoProveedorInput = document.getElementById('correoProveedor');
    
        proveedorSelect.innerHTML = '<option value="" disabled selected>Seleccione un proveedor</option>';
        correoProveedorInput.value = ''; // Limpiar el campo de correo
    
        if (producto) {
            try {
                const response = await fetch(`http://localhost:4000/api/proveedor/proveedores/producto?producto=${producto}`);
    
                if (!response.ok) {
                    throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
                }
    
                const proveedores = await response.json();
    
                if (proveedores.length > 0) {
                    for (const proveedor of proveedores) {
                        const option = document.createElement('option');
                        option.value = proveedor.nombreProveedor; // Almacena el nombre
                        option.dataset.correo = proveedor.correo; // Almacena el correo como atributo de datos
                        option.textContent = proveedor.nombreProveedor;
                        proveedorSelect.appendChild(option);
                    }
                } else {
                    alert('No se encontraron proveedores para este producto.');
                }
            } catch (error) {
                console.error('Error al obtener proveedores:', error);
            }
        }
    });
    
    document.getElementById('nombreProveedor').addEventListener('change', (e) => {
        const proveedorSelect = e.target;
        const selectedOption = proveedorSelect.options[proveedorSelect.selectedIndex];
        const correo = selectedOption.dataset.correo; // Obtener el correo del atributo de datos
        document.getElementById('correoProveedor').value = correo || ''; // Mostrar el correo
    });
    
    document.getElementById('ordenProveedorForm').addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
    
        try {
            const response = await fetch('http://localhost:4000/api/proveedor/crearordenproveedor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                const responseData = await response.json();
                alert(`Orden creada exitosamente. Estado inicial: ${responseData.estado}`);
    
                // Cerrar el modal
                const orderModal = document.getElementById('orderModal');
                orderModal.style.display = 'none';
    
                // Reiniciar el formulario
                e.target.reset();
    
                // Actualizar la página
                location.reload();
            } else {
                const error = await response.json();
                alert(`Error al crear la orden: ${error.error}`);
            }
        } catch (error) {
            console.error('Error al enviar la orden:', error);
        }
    });
        