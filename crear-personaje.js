const backDashboardBtn = document.getElementById("backDashboardBtn");
const prevStepBtn = document.getElementById("prevStepBtn");
const nextStepBtn = document.getElementById("nextStepBtn");
const optionsContainer = document.getElementById("optionsContainer");
const infoContainer = document.getElementById("infoContainer");
const progressSteps = document.querySelectorAll(".progress-step");
const resetCreatorBtn = document.getElementById("resetCreatorBtn");

let currentStep = 0;
let originsData = [];
let classesData = [];
let equipmentData = {};

const characterDraft = {
  name: "",
  origin: null,
  class: null,
  build: null,
  equipment: {},
  stats: {
    Fue: 1,
    Agi: 1,
    Cue: 1,
    Mag: 1,
    Esp: 1,
    Vol: 1
  },
  freePoints: 2,
  originBonusStat: null
};

async function loadData() {
  try {
    const originsResponse = await fetch("origenes.json");
    originsData = await originsResponse.json();

    const classesResponse = await fetch("clases.json");
    classesData = await classesResponse.json();

    const equipmentResponse = await fetch("equipo.json");
    equipmentData = await equipmentResponse.json();

    restoreCreatorState();
    renderStep();
  } catch (error) {
    console.error("Error cargando los archivos JSON:", error);
    optionsContainer.innerHTML = `<p>No se pudieron cargar los datos del creador.</p>`;
  }
}

function updateProgressBar() {
  progressSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
    step.classList.toggle("completed", index < currentStep);
  });
}

function renderStep() {
  updateProgressBar();

  if (currentStep === 0) {
    renderIntroStep();
    prevStepBtn.style.display = "none";
    nextStepBtn.textContent = "Comenzar";
    return;
  }

  prevStepBtn.style.display = "inline-flex";

  if (currentStep === 1) {
    renderOriginStep();
    nextStepBtn.textContent = "Elegir origen";
    return;
  }

  if (currentStep === 2) {
    renderClassStep();
    nextStepBtn.textContent = "Elegir clase";
    return;
  }

  if (currentStep === 3) {
    renderStatsStep();
    nextStepBtn.textContent = "Continuar al equipo";
    return;
  }

  if (currentStep === 4) {
    renderEquipmentStep();
    nextStepBtn.textContent = "Continuar al resumen";
    return;
  }

  if (currentStep === 5) {
    renderSummaryStep();
    nextStepBtn.textContent = "Crear personaje";
    return;
  }
}

function renderIntroStep() {
  optionsContainer.innerHTML = `
    <div class="creator-intro">
      <h2>Bienvenido al creador de personajes</h2>
      <p>
        Aquí comenzarás el viaje de un nuevo ratón aventurero.
        Primero elegirás su origen, luego su clase y al final
        revisarás un resumen de todo lo que has forjado.
      </p>
    </div>
  `;

  infoContainer.innerHTML = `
    <div class="creator-info-box">
      <h3>Origen</h3>
      <p>
        El origen define de dónde proviene tu personaje, cómo fue criado,
        qué entorno moldeó su cuerpo y su mente, qué stat mejora y cuáles
        son sus habilidades iniciales.
      </p>

      <h3>Clase</h3>
      <p>
        La clase determina el estilo de combate, el HP inicial, la habilidad
        única del personaje y el equipo con el que comenzará su aventura.
      </p>

      <h3>Resumen</h3>
      <p>
        Al final del proceso podrás revisar todas tus elecciones antes de
        crear el personaje definitivamente.
      </p>
    </div>
  `;
}

function renderOriginStep() {
  optionsContainer.innerHTML = `
    <div class="selection-list">
      ${originsData
        .map(
          (origin, index) => `
            <button 
              class="selection-card ${
                characterDraft.origin?.name === origin.name ? "selected" : ""
              }" 
              data-origin-index="${index}"
            >
              ${origin.name}
            </button>
          `
        )
        .join("")}
    </div>
  `;

  // Si aún no hay origen seleccionado, asigna el primero por defecto
  if (!characterDraft.origin && originsData.length > 0) {
    characterDraft.origin = originsData[0];
    characterDraft.originBonusStat = getOriginBonusStat(characterDraft.origin);
  }

  renderOriginInfo(characterDraft.origin);

  const originButtons = document.querySelectorAll("[data-origin-index]");

  originButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const originIndex = Number(button.dataset.originIndex);

      characterDraft.origin = originsData[originIndex];

      // aquí se guarda el stat bonus del origen
      characterDraft.originBonusStat = getOriginBonusStat(characterDraft.origin);

      saveCreatorState();

      renderOriginStep();
    });
  });
}

function renderOriginInfo(origin) {
  infoContainer.innerHTML = `
    <div class="creator-info-box">
      <h3>${origin.name}</h3>
      <p>${origin.description}</p>

      <h3>Mejora de atributo</h3>
      <p>${origin.stat_bonus}</p>

      <h3>Skills iniciales</h3>
      <ul>
        ${origin.skills.map(skill => `<li>${skill}</li>`).join("")}
      </ul>
    </div>
  `;
}

function renderClassStep() {
  if (!characterDraft.class && classesData.length > 0) {
    characterDraft.class = classesData[0];
  }

  if (
    characterDraft.class &&
    characterDraft.class.build_options &&
    !characterDraft.build
  ) {
    characterDraft.build = characterDraft.class.build_options[0];
  }

  optionsContainer.innerHTML = `
    <div class="selection-list">
      <h2>Clase</h2>
      ${classesData
      .map(
        (clase, index) => `
            <button class="selection-card ${characterDraft.class?.name === clase.name ? "selected" : ""}" data-class-index="${index}">
              ${clase.name}
            </button>
          `
      )
      .join("")}

      ${characterDraft.class?.build_options
      ? `
            <div class="build-section">
              <h2>Build inicial</h2>
              <div class="selection-list">
                ${characterDraft.class.build_options
        .map(
          (build, index) => `
                      <button class="selection-card ${characterDraft.build?.name === build.name ? "selected" : ""}" data-build-index="${index}">
                        ${build.name}
                      </button>
                    `
        )
        .join("")}
              </div>
            </div>
          `
      : ""
    }
    </div>
  `;

  renderClassInfo(characterDraft.class, characterDraft.build);

  const classButtons = document.querySelectorAll("[data-class-index]");
  classButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const classIndex = Number(button.dataset.classIndex);
      characterDraft.class = classesData[classIndex];
      characterDraft.build = characterDraft.class.build_options
        ? characterDraft.class.build_options[0]
        : null;
      renderClassStep();
    });
  });

  const buildButtons = document.querySelectorAll("[data-build-index]");
  buildButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const buildIndex = Number(button.dataset.buildIndex);
      characterDraft.build = characterDraft.class.build_options[buildIndex];
      renderClassStep();
    });
  });
}

function renderStatsStep() {
  const finalStats = getAllFinalStats();

  optionsContainer.innerHTML = `
    <div class="creator-placeholder">
      <h2>Distribución de atributos</h2>
      <p>Puntos disponibles: <strong>${characterDraft.freePoints}</strong></p>

      <div class="stats-grid">
        ${Object.keys(characterDraft.stats).map(stat => `
          <div class="stat-card">
            <h3>${stat}</h3>
            <p>Base: ${characterDraft.stats[stat]}</p>
            <p>Final: ${finalStats[stat]}</p>

            <div class="stat-actions">
              <button class="stat-btn" data-action="minus" data-stat="${stat}">-</button>
              <button class="stat-btn" data-action="plus" data-stat="${stat}">+</button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  infoContainer.innerHTML = `
    <div class="creator-info-box">
      <h3>Reglas de atributos</h3>
      <p>Todos los atributos comienzan en 1.</p>
      <p>Tienes <strong>2 puntos libres</strong> para repartir.</p>
      <p>El origen otorga <strong>+1 adicional</strong> a un atributo y no consume puntos.</p>

      <h3>Bonus del origen</h3>
      <p>${characterDraft.originBonusStat ? `${characterDraft.originBonusStat} +1` : "Sin bonus"}</p>

      <h3>Valores finales</h3>
      <ul>
        <li><strong>Fue:</strong> ${finalStats.Fue}</li>
        <li><strong>Agi:</strong> ${finalStats.Agi}</li>
        <li><strong>Cue:</strong> ${finalStats.Cue}</li>
        <li><strong>Mag:</strong> ${finalStats.Mag}</li>
        <li><strong>Esp:</strong> ${finalStats.Esp}</li>
        <li><strong>Vol:</strong> ${finalStats.Vol}</li>
      </ul>
    </div>
  `;

  const statButtons = document.querySelectorAll(".stat-btn");

  statButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const stat = button.dataset.stat;
      const action = button.dataset.action;

      if (action === "plus" && characterDraft.freePoints > 0) {
        characterDraft.stats[stat]++;
        characterDraft.freePoints--;
      }

      if (action === "minus" && characterDraft.stats[stat] > 1) {
        characterDraft.stats[stat]--;
        characterDraft.freePoints++;
      }

      saveCreatorState();
      renderStatsStep();
    });
  });
}
function renderClassInfo(clase, build) {
  infoContainer.innerHTML = `
    <div class="creator-info-box">
      <h3>${clase.name}</h3>
      <p>${clase.description}</p>

      <h3>HP inicial</h3>
      <p>${clase.hp_initial}</p>

      <h3>MP inicial</h3>
      <p>${clase.mp_initial}</p>

      <h3>Habilidad única</h3>
      <p>${clase.unique_ability}</p>

      ${
        build
          ? `
            <h3>${build.name}</h3>
            <p>${build.description}</p>

            <h3>Slots de equipo inicial</h3>
            <ul>
              ${build.slots.map(slot => `<li>${formatSlotName(slot)}</li>`).join("")}
            </ul>
          `
          : ""
      }

      ${
        clase.magic_schools
          ? `
            <h3>Escuelas disponibles</h3>
            <ul>
              ${clase.magic_schools.map(school => `<li>${school}</li>`).join("")}
            </ul>
          `
          : ""
      }
    </div>
  `;
}
function formatSlotName(slot) {
  const slotNames = {
    arma_2_manos: "1 arma a 2 manos",
    arma_1_mano: "1 arma a 1 mano",
    arma_distancia: "1 arma a distancia",
    arco: "Arco",
    baston: "Bastón",
    simbolo_sagrado: "Símbolo sagrado",
    guantelete_piro: "Guantelete piromántico",
    guantelete_nigro: "Guantelete nigromántico",
    armadura_pesada: "Armadura pesada",
    armadura_intermedia: "Armadura intermedia",
    armadura_ligera: "Armadura ligera",
    escudo: "Escudo",
    escudo_ligero: "Escudo ligero"
  };

  return slotNames[slot] || slot;
}
function getItemsBySlotLoose(slot) {
  const allItems = [
    ...(equipmentData.weapons || []),
    ...(equipmentData.armors || []),
    ...(equipmentData.shields || []),
    ...(equipmentData.focus || []),
    ...(equipmentData.helmets || [])
  ];

  return allItems.filter(item => {
    const id = Number(item.id);

    switch (slot) {
      case "arma_1_mano":
        return id >= 10000 && id < 20000;

      case "arma_2_manos":
        return id >= 20000 && id < 30000;

      case "baston":
      case "simbolo_sagrado":
      case "guantelete_piro":
      case "guantelete_nigro":
        return id >= 30000 && id < 40000;

      case "escudo":
      case "escudo_ligero":
        return id >= 40000 && id < 50000;

      case "armadura_ligera":
        return id >= 50000 && id < 60000;

      case "armadura_intermedia":
        return id >= 60000 && id < 70000;

      case "armadura_pesada":
        return id >= 70000 && id < 80000;

      case "casco_ligero":
        return id >= 80000 && id < 90000;

      case "casco_pesado":
        return id >= 90000 && id < 100000;

      case "arco":
      case "arma_distancia":
        return id >= 10000 && id < 30000;

      default:
        return false;
    }
  });
}
function formatEquipmentKey(key) {
  const cleanKey = key.replace(/_\d+$/, "");
  return formatSlotName(cleanKey);
}
function getOriginBonusStat(origin) {
  if (!origin || !origin.stat_bonus) return null;

  if (origin.stat_bonus.includes("Fue")) return "Fue";
  if (origin.stat_bonus.includes("Agi")) return "Agi";
  if (origin.stat_bonus.includes("Cue")) return "Cue";
  if (origin.stat_bonus.includes("Mag")) return "Mag";
  if (origin.stat_bonus.includes("Esp")) return "Esp";
  if (origin.stat_bonus.includes("Vol")) return "Vol";

  return null;
}

function getFinalStatValue(statName) {
  const baseValue = characterDraft.stats[statName] || 1;
  const bonus = characterDraft.originBonusStat === statName ? 1 : 0;
  return baseValue + bonus;
}

function getAllFinalStats() {
  return {
    Fue: getFinalStatValue("Fue"),
    Agi: getFinalStatValue("Agi"),
    Cue: getFinalStatValue("Cue"),
    Mag: getFinalStatValue("Mag"),
    Esp: getFinalStatValue("Esp"),
    Vol: getFinalStatValue("Vol")
  };
}
function renderSummaryStep() {
  const finalStats = getAllFinalStats();

  optionsContainer.innerHTML = `
    <div class="creator-placeholder">
      <h2>Resumen del personaje</h2>
      <p>Revisa tus elecciones y escribe el nombre final de tu aventurero.</p>

      <div class="form-group" style="margin-top: 20px;">
        <label for="characterName">Nombre del personaje</label>
        <input
          type="text"
          id="characterName"
          placeholder="Escribe el nombre de tu personaje"
          value="${characterDraft.name || ""}"
        >
      </div>
    </div>
  `;

  infoContainer.innerHTML = `
    <div class="creator-info-box">
      <h3>Origen elegido</h3>
      <p>${characterDraft.origin ? characterDraft.origin.name : "No elegido"}</p>

      <h3>Clase elegida</h3>
      <p>${characterDraft.class ? characterDraft.class.name : "No elegida"}</p>

      <h3>Build elegida</h3>
      <p>${characterDraft.build ? characterDraft.build.name : "No elegida"}</p>

      <h3>HP / MP inicial</h3>
      <p>HP: ${characterDraft.class ? characterDraft.class.hp_initial : "-"} | MP: ${characterDraft.class ? characterDraft.class.mp_initial : "-"}</p>

      <h3>Atributos finales</h3>
      <ul>
        <li><strong>Fue:</strong> ${finalStats.Fue}</li>
        <li><strong>Agi:</strong> ${finalStats.Agi}</li>
        <li><strong>Cue:</strong> ${finalStats.Cue}</li>
        <li><strong>Mag:</strong> ${finalStats.Mag}</li>
        <li><strong>Esp:</strong> ${finalStats.Esp}</li>
        <li><strong>Vol:</strong> ${finalStats.Vol}</li>
      </ul>

      <h3>Equipo seleccionado</h3>
      <ul>
        ${
          Object.keys(characterDraft.equipment).length > 0
            ? Object.entries(characterDraft.equipment)
                .map(([key, item]) => `<li><strong>${formatEquipmentKey(key)}:</strong> ${item.name}</li>`)
                .join("")
            : "<li>No elegido</li>"
        }
      </ul>
    </div>
  `;

  const characterNameInput = document.getElementById("characterName");

  characterNameInput.addEventListener("input", (event) => {
    characterDraft.name = event.target.value;
    saveCreatorState();
  });
}

function renderEquipmentStep() {
  loadSelectedEquipment();

  const buildSlots = characterDraft.build?.slots || [];

  optionsContainer.innerHTML = `
    <div class="selection-list">
      <h2>Selección de equipo</h2>
      <p>
        Elige cada pieza de equipo desde el selector completo.
      </p>

      ${buildSlots.map((slot, index) => `
        <div class="equipment-slot-block">
          <h3>${formatSlotName(slot)}</h3>
          <button class="btn-pick-item" onclick="openEquipmentSelector('${slot}', ${index})">
            Elegir equipo
          </button>
        </div>
      `).join("")}
    </div>
  `;

  infoContainer.innerHTML = `
    <div class="creator-info-box">
      <h3>Clase actual</h3>
      <p>${characterDraft.class ? characterDraft.class.name : "No elegida"}</p>

      <h3>Build actual</h3>
      <p>${characterDraft.build ? characterDraft.build.name : "No definida"}</p>

      <h3>Equipo seleccionado</h3>
      <ul>
        ${Object.keys(characterDraft.equipment).length > 0
      ? Object.entries(characterDraft.equipment)
        .map(([key, item]) => `<li><strong>${formatEquipmentKey(key)}:</strong> ${item.name}</li>`)
        .join("")
      : "<li>Aún no has elegido equipo.</li>"
    }
      </ul>
    </div>
  `;
}
function openEquipmentSelector(slot, slotIndex) {
  saveCreatorState();
  window.location.href = `selector-equipo.html?slot=${slot}&slotIndex=${slotIndex}`;
}
function loadSelectedEquipment() {

  const buildSlots = characterDraft.build?.slots || [];

  buildSlots.forEach((slot, index) => {

    const saved = localStorage.getItem(`equipment_${slot}_${index}`);

    if (saved) {

      characterDraft.equipment[`${slot}_${index}`] = JSON.parse(saved);

    }

  });

}
function saveCreatorState() {
  localStorage.setItem("characterDraft", JSON.stringify({
    name: characterDraft.name,
    origin: characterDraft.origin,
    class: characterDraft.class,
    build: characterDraft.build,
    equipment: characterDraft.equipment,
    stats: characterDraft.stats,
    freePoints: characterDraft.freePoints,
    originBonusStat: characterDraft.originBonusStat
  }));

  localStorage.setItem("creatorStep", String(currentStep));
}

function restoreCreatorState() {
  const savedDraft = localStorage.getItem("characterDraft");
  const savedStep = localStorage.getItem("creatorStep");

  if (savedDraft) {
    const parsedDraft = JSON.parse(savedDraft);

    characterDraft.name = parsedDraft.name || "";
    characterDraft.origin = parsedDraft.origin || null;
    characterDraft.class = parsedDraft.class || null;
    characterDraft.build = parsedDraft.build || null;
    characterDraft.equipment = parsedDraft.equipment || {};

    characterDraft.stats = parsedDraft.stats || {
      Fue: 1,
      Agi: 1,
      Cue: 1,
      Mag: 1,
      Esp: 1,
      Vol: 1
    };

    characterDraft.freePoints = parsedDraft.freePoints ?? 2;
    characterDraft.originBonusStat = parsedDraft.originBonusStat || null;
  }

  if (savedStep !== null) {
    currentStep = Number(savedStep);
  }
}
function saveCharacter() {
  const finalName = (characterDraft.name || "").trim();

  if (!finalName) {
    alert("Debes escribir un nombre para tu personaje.");
    return;
  }

  const finalStats = getAllFinalStats();
  const personajesGuardados = JSON.parse(localStorage.getItem("personajes")) || [];

  const newCharacter = {
    id: Date.now(),
    name: finalName,
    class: characterDraft.class?.name || "",
    level: 1,
    origin: characterDraft.origin?.name || "",
    appearance: finalName.charAt(0).toUpperCase(),
    build: characterDraft.build?.name || "",
    hp: characterDraft.class?.hp_initial || 0,
    mp: characterDraft.class?.mp_initial || 0,
    stats: finalStats,
    equipment: characterDraft.equipment || {}
  };

  personajesGuardados.push(newCharacter);
  localStorage.setItem("personajes", JSON.stringify(personajesGuardados));

  localStorage.removeItem("characterDraft");
  localStorage.removeItem("creatorStep");

  const buildSlots = characterDraft.build?.slots || [];
  buildSlots.forEach((slot, index) => {
    localStorage.removeItem(`equipment_${slot}_${index}`);
  });

  window.location.href = "dashboard.html";
}
  backDashboardBtn.addEventListener("click", () => {

    localStorage.removeItem("characterDraft");
    localStorage.removeItem("creatorStep");

    window.location.href = "dashboard.html";

  });

  resetCreatorBtn.addEventListener("click", () => {

    resetCreator();

  });

  prevStepBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      saveCreatorState();
      renderStep();
    }
  });

  nextStepBtn.addEventListener("click", () => {
    if (currentStep === 0) {
      currentStep = 1;
      saveCreatorState();
      renderStep();
      return;
    }

    if (currentStep === 1) {
      if (!characterDraft.origin) {
        alert("Debes elegir un origen.");
        return;
      }

      currentStep = 2;
      saveCreatorState();
      renderStep();
      return;
    }

    if (currentStep === 2) {
      if (!characterDraft.class || !characterDraft.build) {
        alert("Debes elegir una clase y una build.");
        return;
      }

      currentStep = 3;
      saveCreatorState();
      renderStep();
      return;
    }

    if (currentStep === 3) {
      currentStep = 4;
      saveCreatorState();
      renderStep();
      return;
    }

    if (currentStep === 4) {
      currentStep = 5;
      saveCreatorState();
      renderStep();
      return;
    }

    if (currentStep === 5) {
      saveCharacter();
    }
  });
loadData();