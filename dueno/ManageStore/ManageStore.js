document.querySelector("#Producto .btn-primary").addEventListener("click", async () => {
    const formData = new FormData();

    const imageInput = document.getElementById("imageInput");
    const nombreTienda = document.getElementById("productName").value;
    const ciudad = document.getElementById("ciudad").value;
    const codigoPostal = document.getElementById("codigoPostal").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    const idTienda = document.getElementById("idtienda").value;

    if (imageInput.files[0]) {
        formData.append("imagen", imageInput.files[0]);
    }
    formData.append("nombreTienda", nombreTienda);
    formData.append("ciudad", ciudad);
    formData.append("codigoPostal", codigoPostal);
    formData.append("direccion", direccion);
    formData.append("telefono", telefono);
    formData.append("idTienda", idTienda);

    try {
        const response = await fetch("http://localhost:4000/api/tienda/creartienda", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            alert("Tienda creada exitosamente");
            cargarTiendas(); // Recargar las tiendas
        } else {
            alert(`Error al crear la tienda: ${data.error}`);
        }
    } catch (error) {
        console.error("Error al crear tienda:", error);
    }
});

async function cargarTiendas() {
    try {
        const response = await fetch("http://localhost:4000/api/tienda/tiendas");
        const tiendas = await response.json();

        const container = document.querySelector(".container .row:nth-child(2)");
        container.innerHTML = ""; // Limpia el contenedor antes de agregar nuevas tiendas

        tiendas.forEach((tienda) => {
            const tiendaHTML = `
                <div class="col-12">
                    <div class="card rounded border-0 shadow-sm mb-4">
                        <div class="row g-0 align-items-center">
                            <div class="col-md-4">
                                <img src="${tienda.imagenProUrl}" class="img-fluid rounded-start" alt="Imagen de la tienda">
                            </div>
                            <div class="col-md-8 d-flex justify-content-between align-items-center">
                                <div class="card-body">
                                    <h5 class="card-title fw-bold">${tienda.nombreTienda}</h5>
                                    <div class="store-details p-3 bg-light rounded">
                                        <p class="card-text"><strong>Nombre:</strong> ${tienda.nombreTienda}</p>
                                        <p class="card-text"><strong>Dirección:</strong> ${tienda.direccion}</p>
                                        <p class="card-text"><strong>Ciudad:</strong> ${tienda.ciudad}</p>
                                        <p class="card-text"><strong>Teléfono:</strong> ${tienda.telefono}</p>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button class="btn btn-outline-primary btn-sm mx-4 btn-edit" 
                                        data-id="${tienda.idTienda}" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#EditProducto">
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            container.insertAdjacentHTML("beforeend", tiendaHTML);
        });

        // Agregar eventos a los botones de editar
        document.querySelectorAll(".btn-edit").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                cargarDatosEditar(e.target.getAttribute("data-id"));
            });
        });
    } catch (error) {
        console.error("Error al cargar tiendas:", error);
    }
}

cargarTiendas();

async function cargarDatosEditar(idTienda) {
    try {
        const response = await fetch(`http://localhost:4000/api/tienda/tienda/${idTienda}`);
        const tienda = await response.json();

        if (response.ok) {
            document.getElementById("productNameEdit").value = tienda.nombreTienda;
            document.getElementById("ciudadEdit").value = tienda.ciudad;
            document.getElementById("codigoPostalEdit").value = tienda.codigoPostal;
            document.getElementById("direccionEdit").value = tienda.direccion;
            document.getElementById("telefonoEdit").value = tienda.telefono;
            document.getElementById("imageEdit").dataset.id = idTienda;
        } else {
            alert(`Error al cargar la tienda: ${tienda.error}`);
        }
    } catch (error) {
        console.error("Error al cargar datos de edición:", error);
    }
}

document.querySelector("#EditProducto .btn-primary").addEventListener("click", async () => {
    const idTienda = document.getElementById("imageEdit").dataset.id;
    const formData = new FormData();
    const imageInput = document.getElementById("imageEdit");
    const nombreTienda = document.getElementById("productNameEdit").value;
    const ciudad = document.getElementById("ciudadEdit").value;
    const codigoPostal = document.getElementById("codigoPostalEdit").value;
    const direccion = document.getElementById("direccionEdit").value;
    const telefono = document.getElementById("telefonoEdit").value;

    if (imageInput.files[0]) {
        formData.append("imagen", imageInput.files[0]);
    }
    formData.append("nombreTienda", nombreTienda);
    formData.append("ciudad", ciudad);
    formData.append("codigoPostal", codigoPostal);
    formData.append("direccion", direccion);
    formData.append("telefono", telefono);

    try {
        const response = await fetch(`http://localhost:4000/api/tienda/actualizartienda/${idTienda}`, {
            method: "PUT",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            alert("Tienda actualizada exitosamente");
            cargarTiendas(); // Recargar las tiendas

            // Cerrar el modal de edición de tienda
            const modal = new bootstrap.Modal(document.getElementById('EditProducto'));
            modal.hide();
        } else {
            alert(`Error al actualizar la tienda: ${data.error}`);
        }
    } catch (error) {
        console.error("Error al actualizar tienda:", error);
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
