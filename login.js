const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  loginMessage.textContent = "";
  loginMessage.style.color = "#c74b4b";

  if (email === "" || password === "") {
    loginMessage.textContent = "Completa todos los campos.";
    return;
  }

  if (!email.includes("@")) {
    loginMessage.textContent = "Ingresa un correo válido.";
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioValido = usuarios.find(
    usuario => usuario.email === email && usuario.password === password
  );

  if (!usuarioValido) {
    loginMessage.textContent = "Correo o contraseña incorrectos.";
    return;
  }

  localStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido));

  loginMessage.style.color = "#8fd39d";
  loginMessage.textContent = "Acceso concedido. Entrando...";

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
});