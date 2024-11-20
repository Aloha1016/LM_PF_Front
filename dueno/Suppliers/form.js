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

// Manejar clic en el contenedor para abrir el input de archivos
imagePlaceholder.addEventListener("click", () => {
    imageInput.click();
});

// Manejar la selección de una imagen
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

// Activar explorador de archivos al hacer clic en "Browse image"
browseImageLink.addEventListener("click", (event) => {
    event.preventDefault();
    imageInput.click(); // Disparar clic en el input de archivo
});

// Enviar formulario para agregar un proveedor con imagen
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
            supplierTable.innerHTML += `
                <tr>
                    <td>${formData.get("nombreProveedor")}</td>
                    <td>${formData.get("producto")}</td>
                    <td>${formData.get("numeroContacto")}</td>
                    <td>${formData.get("correo")}</td>
                    <td class="status ${formData.get("Tipo") === "Acepta devolucion" ? "taking-return" : "not-taking-return"}">
                        ${formData.get("Tipo") === "Acepta devolucion" ? "Taking Return" : "Not Taking Return"}
                    </td>
                    <td>-</td>
                </tr>
            `;
            modal.style.display = "none";
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al crear el proveedor.");
    }
});

// Cargar proveedores existentes al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:4000/api/proveedor/proveedores");
        const proveedores = await response.json();

        if (response.ok) {
            proveedores.forEach((proveedor) => {
                supplierTable.innerHTML += `
                    <tr>
                        <td>${proveedor.nombreProveedor}</td>
                        <td>${proveedor.producto}</td>
                        <td>${proveedor.numeroContacto}</td>
                        <td>${proveedor.correo}</td>
                        <td class="status ${proveedor.Tipo === "Acepta devolucion" ? "taking-return" : "not-taking-return"}">
                            ${proveedor.Tipo === "Acepta devolucion" ? "Taking Return" : "Not Taking Return"}
                        </td>
                        <td>${proveedor.enCamino || "-"}</td>
                    </tr>
                `;
            });
        } else {
            alert(proveedores.error);
        }
    } catch (error) {
        console.error("Error al cargar los proveedores:", error);
    }
});
