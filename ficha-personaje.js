const backDashboardBtn = document.getElementById("backDashboardBtn");

const sheetSubtitle = document.getElementById("sheetSubtitle");
const sheetPortrait = document.getElementById("sheetPortrait");
const sheetName = document.getElementById("sheetName");
const sheetClass = document.getElementById("sheetClass");
const sheetOrigin = document.getElementById("sheetOrigin");
const sheetBuild = document.getElementById("sheetBuild");
const sheetLevel = document.getElementById("sheetLevel");
const sheetHP = document.getElementById("sheetHP");
const sheetMP = document.getElementById("sheetMP");
const sheetStats = document.getElementById("sheetStats");
const sheetEquipment = document.getElementById("sheetEquipment");

function formatEquipmentKey(key) {
  const cleanKey = key.replace(/_\d+$/, "");

  const slotNames = {
    arma_2_manos: "Arma a 2 manos",
    arma_1_mano: "Arma a 1 mano",
    arma_distancia: "Arma a distancia",
    arco: "Arco",
    baston: "Bastón",
    simbolo_sagrado: "Símbolo sagrado",
    guantelete_piro: "Guantelete piromántico",
    guantelete_nigro: "Guantelete nigromántico",
    armadura_pesada: "Armadura pesada",
    armadura_intermedia: "Armadura intermedia",
    armadura_ligera: "Armadura ligera",
    escudo: "Escudo",
    escudo_ligero: "Escudo ligero",
    casco_ligero: "Casco ligero",
    casco_pesado: "Casco pesado"
  };

  return slotNames[cleanKey] || cleanKey;
}

function loadCharacterSheet() {
  const selectedId = Number(localStorage.getItem("selectedCharacterId"));
  const personajes = JSON.parse(localStorage.getItem("personajes")) || [];

  const personaje = personajes.find((p) => p.id === selectedId);

  if (!personaje) {
    sheetSubtitle.textContent = "No se encontró el personaje.";
    return;
  }

  document.title = `Mouseguard Souls - ${personaje.name}`;
  sheetSubtitle.textContent = `Registro de ${personaje.name}`;
  sheetPortrait.textContent = personaje.appearance || "?";
  sheetName.textContent = personaje.name || "Sin nombre";
  sheetClass.textContent = personaje.class || "-";
  sheetOrigin.textContent = personaje.origin || "-";
  sheetBuild.textContent = personaje.build || "-";
  sheetLevel.textContent = personaje.level || 1;
  sheetHP.textContent = personaje.hp || 0;
  sheetMP.textContent = personaje.mp || 0;

  const stats = personaje.stats || {};
  sheetStats.innerHTML = `
    <div class="sheet-stat-box"><span>Fue</span><strong>${stats.Fue ?? 1}</strong></div>
    <div class="sheet-stat-box"><span>Agi</span><strong>${stats.Agi ?? 1}</strong></div>
    <div class="sheet-stat-box"><span>Cue</span><strong>${stats.Cue ?? 1}</strong></div>
    <div class="sheet-stat-box"><span>Mag</span><strong>${stats.Mag ?? 1}</strong></div>
    <div class="sheet-stat-box"><span>Esp</span><strong>${stats.Esp ?? 1}</strong></div>
    <div class="sheet-stat-box"><span>Vol</span><strong>${stats.Vol ?? 1}</strong></div>
  `;

  const equipment = personaje.equipment || {};
  const equipmentEntries = Object.entries(equipment);

  if (equipmentEntries.length === 0) {
    sheetEquipment.innerHTML = `<li>Sin equipo registrado.</li>`;
  } else {
    sheetEquipment.innerHTML = equipmentEntries
      .map(([key, item]) => `<li><strong>${formatEquipmentKey(key)}:</strong> ${item.name}</li>`)
      .join("");
  }
}

backDashboardBtn.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

loadCharacterSheet();