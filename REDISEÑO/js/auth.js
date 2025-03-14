// Variables globales para el control de login
let intentos = 0;
const maxIntentos = 5;
const esperaMs = 30000; // 30 segundos

const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const errorMessage = document.getElementById('error-message');

// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        document.getElementById('login-container').style.display = "none";
        document.getElementById('app').style.display = "block";
    }
});

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Bloquear si se superó el máximo de intentos
    if (intentos >= maxIntentos) return;

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // URL del webhook
    const baseUrl = "https://stingray-poetic-likely.ngrok-free.app/webhook/fd298640-e9d9-4c7a-acc8-0aec7c865520";

    // Realizar petición al servidor
    fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario: email, pass: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "getInside") {
            // Acceso concedido
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            document.getElementById('login-container').style.display = "none";
            document.getElementById('app').style.display = "block";
        } else {
            // Acceso denegado
            intentos++;
            errorMessage.textContent = `Acceso no autorizado. Intento ${intentos} de ${maxIntentos}.`;
            manejarIntentos();
        }
    })
    .catch(error => {
        // Manejar errores de conexión o JSON inválido
        intentos++;
        errorMessage.textContent = `Error en la conexión. Intento ${intentos} de ${maxIntentos}.`;
        manejarIntentos();
    });
});

function manejarIntentos() {
    if (intentos >= maxIntentos) {
        loginButton.disabled = true;
        errorMessage.textContent = `Número máximo de intentos alcanzado. Espera 30 segundos.`;
        setTimeout(() => {
            intentos = 0;
            loginButton.disabled = false;
            errorMessage.textContent = "";
        }, esperaMs);
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    document.getElementById('login-container').style.display = "block";
    document.getElementById('app').style.display = "none";
}