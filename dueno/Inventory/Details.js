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