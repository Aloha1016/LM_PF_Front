document.getElementById('createDuenoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:4000/api/dueno/creardueno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, correo, password })
        });        

        const result = await response.json();

        if (response.ok) {
            alert('Cuenta creada exitosamente');
            window.location.href = 'main.html'; // Redirige a la página de inicio de sesión
        } else {
            alert(result.error || 'Error al crear la cuenta');
        }
    } catch (error) {
        alert('Ocurrió un error: ' + error.message);
    }
});