const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  registerMessage.textContent = "";
  registerMessage.style.color = "#c74b4b";

  if (!username || !email || !password || !confirmPassword) {
    registerMessage.textContent = "Completa todos los campos.";
    return;
  }

  if (!email.includes("@")) {
    registerMessage.textContent = "Ingresa un correo válido.";
    return;
  }

  if (password.length < 6) {
    registerMessage.textContent = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }

  if (password !== confirmPassword) {
    registerMessage.textContent = "Las contraseñas no coinciden.";
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioExistente = usuarios.find(usuario => usuario.email === email);

  if (usuarioExistente) {
    registerMessage.textContent = "Ese correo ya está registrado.";
    return;
  }

  const nuevoUsuario = {
    username,
    email,
    password
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  registerMessage.style.color = "#8fd39d";
  registerMessage.textContent = "Cuenta creada con éxito. Redirigiendo al login...";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1200);
});