const modal = document.getElementById("supplierModal");
const addProductBtn = document.getElementById("addProductBtn");
const closeModal = document.querySelector(".close");

addProductBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});