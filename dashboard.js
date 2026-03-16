const welcomeMessage = document.getElementById("welcomeMessage");
const charactersGrid = document.getElementById("charactersGrid");
const logoutBtn = document.getElementById("logoutBtn");
const createCharacterBtn = document.getElementById("createCharacterBtn");

const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

if (!usuarioActivo) {
  window.location.href = "index.html";
}

welcomeMessage.textContent = `Bienvenido, ${usuarioActivo.username}`;

function renderCharacters() {
  const personajesGuardados = JSON.parse(localStorage.getItem("personajes")) || [];
  charactersGrid.innerHTML = "";

  if (personajesGuardados.length === 0) {
    charactersGrid.innerHTML = `
      <article class="character-card">
        <div class="character-info">
          <h3>Sin personajes</h3>
          <p>Aún no has creado ningún aventurero.</p>
        </div>
      </article>
    `;
    return;
  }

  personajesGuardados.forEach((personaje) => {
    const card = document.createElement("article");
    card.classList.add("character-card");

    card.innerHTML = `
      <div class="character-portrait">${personaje.appearance || "?"}</div>

      <div class="character-info">
        <h3>${personaje.name || "Sin nombre"}</h3>
        <p><strong>Clase:</strong> ${personaje.class || "-"}</p>
        <p><strong>Nivel:</strong> ${personaje.level || 1}</p>
        <p><strong>Origen:</strong> ${personaje.origin || "-"}</p>
      </div>

      <div class="character-actions">
        <button class="btn-action" data-id="${personaje.id}" data-action="view">Ver</button>
        <button class="btn-action" data-id="${personaje.id}" data-action="edit">Editar</button>
        <button class="btn-action danger" data-id="${personaje.id}" data-action="delete">Eliminar</button>
      </div>
    `;

    charactersGrid.appendChild(card);
  });

  const actionButtons = document.querySelectorAll(".btn-action");

  actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const id = Number(button.dataset.id);

        if (action === "delete") {
        deleteCharacter(id);
        } else if (action === "view") {
        localStorage.setItem("selectedCharacterId", String(id));
        window.location.href = "ficha-personaje.html";
        } else if (action === "edit") {
        alert("Luego conectamos la edición del personaje.");
        }
    });
  });
}

function deleteCharacter(id) {
  const personajesGuardados = JSON.parse(localStorage.getItem("personajes")) || [];
  const actualizados = personajesGuardados.filter((personaje) => personaje.id !== id);

  localStorage.setItem("personajes", JSON.stringify(actualizados));
  renderCharacters();
}

createCharacterBtn.addEventListener("click", () => {
  localStorage.removeItem("characterDraft");
  localStorage.removeItem("creatorStep");

  const allKeys = Object.keys(localStorage);
  allKeys.forEach((key) => {
    if (key.startsWith("equipment_")) {
      localStorage.removeItem(key);
    }
  });

  window.location.href = "crear-personaje.html";
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "index.html";
});

renderCharacters();