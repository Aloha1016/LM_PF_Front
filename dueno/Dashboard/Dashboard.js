// Modal para Existencias mas vendidas
// Datos simulados para la tabla
const topSellingData = [
    { name: 'Surf Excel', sold: 30, remaining: 12, price: '$ 100' },
    { name: 'Rin', sold: 21, remaining: 15, price: '$ 207' },
    { name: 'Parle G', sold: 19, remaining: 17, price: '$ 105' },
    { name: 'Tide', sold: 25, remaining: 10, price: '$ 120' },
    { name: 'Ariel', sold: 18, remaining: 20, price: '$ 150' },
    { name: 'Nirma', sold: 22, remaining: 8, price: '$ 85' },
    { name: 'Colgate', sold: 35, remaining: 15, price: '$ 90' },
    { name: 'Pepsodent', sold: 12, remaining: 18, price: '$ 75' },
    { name: 'Dettol', sold: 40, remaining: 5, price: '$ 200' },
    { name: 'Savlon', sold: 28, remaining: 12, price: '$ 180' },
    { name: 'Lux', sold: 15, remaining: 25, price: '$ 50' },
    { name: 'Dove', sold: 10, remaining: 30, price: '$ 60' }
];

let currentPage = 1;
const rowsPerPage = 10;

// Función para abrir el modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    loadTableData();
}

// Función para cerrar el modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Función para cargar los datos de la tabla con paginación
function loadTableData() {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = topSellingData.slice(startIndex, endIndex);

    const tableBody = document.getElementById('modalTableBody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    paginatedData.forEach(item => {
        const row = `
            <tr>
                <td>${item.name}</td>
                <td>${item.sold}</td>
                <td>${item.remaining}</td>
                <td>${item.price}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    document.getElementById('currentPage').innerText = `Página ${currentPage}`;
}

// Función para ir a la página anterior
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadTableData();
    }
}

// Función para ir a la página siguiente
function nextPage() {
    if (currentPage * rowsPerPage < topSellingData.length) {
        currentPage++;
        loadTableData();
    }
}


//Modal para Existencias con Baja Disponibilidad
// Datos simulados para la tabla
const lowStockData = [
    { image: 'tata-salt.jpg', name: 'Tata Salt', remaining: '10 Paquetes', status: 'Bajo' },
    { image: 'lays.jpg', name: 'Lays', remaining: '15 Paquetes', status: 'Bajo' },
    { image: 'lays.jpg', name: 'Lays', remaining: '15 Paquetes', status: 'Bajo' },
    { image: 'pepsodent.jpg', name: 'Pepsodent', remaining: '12 Paquetes', status: 'Bajo' },
    { image: 'detergent.jpg', name: 'Detergent', remaining: '8 Paquetes', status: 'Bajo' },
    { image: 'soap.jpg', name: 'Soap', remaining: '5 Paquetes', status: 'Bajo' },
    { image: 'milk.jpg', name: 'Milk', remaining: '20 Paquetes', status: 'Bajo' },
    { image: 'bread.jpg', name: 'Bread', remaining: '18 Paquetes', status: 'Bajo' },
    { image: 'cheese.jpg', name: 'Cheese', remaining: '25 Paquetes', status: 'Bajo' },
    { image: 'butter.jpg', name: 'Butter', remaining: '15 Paquetes', status: 'Bajo' }
];

let currentPageLowStock = 1;
const rowsPerPageLowStock = 6;

// Función para abrir el modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    loadLowStockTable();
}

// Función para cerrar el modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Función para cargar los datos de la tabla con paginación
function loadLowStockTable() {
    const startIndex = (currentPageLowStock - 1) * rowsPerPageLowStock;
    const endIndex = startIndex + rowsPerPageLowStock;
    const paginatedData = lowStockData.slice(startIndex, endIndex);

    const tableBody = document.getElementById('lowStockTableBody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    paginatedData.forEach(item => {
        const row = `
            <tr>
                <td><img src="${item.image}" alt="${item.name}" class="product-image"></td>
                <td>${item.name}</td>
                <td><span class="remaining-quantity">${item.remaining}</span></td>
                <td><span class="low-stock-label">${item.status}</span></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    document.getElementById('currentPageLowStock').innerText = `Página ${currentPageLowStock}`;
}

// Función para ir a la página anterior
function prevPageLowStock() {
    if (currentPageLowStock > 1) {
        currentPageLowStock--;
        loadLowStockTable();
    }
}

// Función para ir a la página siguiente
function nextPageLowStock() {
    if (currentPageLowStock * rowsPerPageLowStock < lowStockData.length) {
        currentPageLowStock++;
        loadLowStockTable();
    }
}