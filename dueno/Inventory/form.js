const modal = document.getElementById("productModal")
const addProductBtn = document.getElementById("addProductBtn")
const closeModal = document.querySelector(".close")
const closeModal2 = document.querySelector(".discard")

addProductBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

closeModal2.addEventListener("click", () => {
    modal.style.display = "none"
})
