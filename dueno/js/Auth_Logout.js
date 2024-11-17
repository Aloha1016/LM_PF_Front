function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../../main.html';
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '../../main.html';
}

document.addEventListener('DOMContentLoaded', checkAuthentication);
