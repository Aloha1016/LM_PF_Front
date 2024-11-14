document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const correo = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:4000/api/dueno/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Guarda el token en el almacenamiento local
            localStorage.setItem('token', result.token);
            // Redirige a mainDueno.html
            window.location.href = './dueno/mainDueno.html';
        } else {
            alert(result.error || 'Error al iniciar sesión');
        }
    } catch (error) {
        alert('Ocurrió un error: ' + error.message);
    }
});
