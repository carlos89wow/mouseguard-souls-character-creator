const tableBody = document.getElementById("equipmentTableBody");
const slotTitle = document.getElementById("slotTitle");
const backBtn = document.getElementById("backBtn");

let equipmentData = {};
let slot = null;
let slotIndex = null;

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

function getParams() {
  const params = new URLSearchParams(window.location.search);
  slot = params.get("slot");
  slotIndex = params.get("slotIndex");
  slotTitle.textContent = `Elegir equipo: ${formatSlotName(slot)}`;
}

function getItemsBySlotLoose(slot) {
  const allItems = [
    ...(equipmentData.weapons || []),
    ...(equipmentData.armors || []),
    ...(equipmentData.shields || []),
    ...(equipmentData.focus || [])
  ];

  const slotGroups = {
    arma_2_manos: ["arma_2_manos", "arma_1_mano", "arma_distancia", "baston", "guantelete_piro", "guantelete_nigro"],
    arma_1_mano: ["arma_1_mano", "arma_2_manos", "arma_distancia", "baston", "guantelete_piro", "guantelete_nigro"],
    arma_distancia: ["arma_distancia", "arco", "arma_1_mano"],
    arco: ["arco", "arma_distancia"],
    armadura_ligera: ["armadura_ligera", "armadura_intermedia", "armadura_pesada"],
    armadura_intermedia: ["armadura_intermedia", "armadura_ligera", "armadura_pesada"],
    armadura_pesada: ["armadura_pesada", "armadura_intermedia", "armadura_ligera"],
    escudo: ["escudo", "escudo_ligero"],
    escudo_ligero: ["escudo_ligero", "escudo"],
    simbolo_sagrado: ["simbolo_sagrado"],
    baston: ["baston", "arma_2_manos", "arma_1_mano"],
    guantelete_piro: ["guantelete_piro"],
    guantelete_nigro: ["guantelete_nigro"]
  };

  const allowedSlots = slotGroups[slot] || [slot];
  return allItems.filter(item => allowedSlots.includes(item.slot_type));
}

async function loadEquipment() {
  const response = await fetch("equipo.json");
  equipmentData = await response.json();
  renderTable();
}

function renderTable() {
  const items = getItemsBySlotLoose(slot);

  tableBody.innerHTML = items.map(item => `
    <tr>
      <td>${item.name || "-"}</td>
      <td>${item.hands ?? "-"}</td>
      <td>${item.stat ?? "-"}</td>
      <td>${item.weight ?? "-"}</td>
      <td>${item.damage ?? "n/a"}</td>
      <td>${Array.isArray(item.mastery) ? item.mastery.join(" / ") : "n/a"}</td>
      <td>${item.price ?? "-"}</td>
      <td>
        <button class="pickItem" data-name="${item.name}">
          Elegir
        </button>
      </td>
    </tr>
  `).join("");

  document.querySelectorAll(".pickItem").forEach(btn => {
    btn.addEventListener("click", () => {
      const itemName = btn.dataset.name;
      const item = items.find(i => i.name === itemName);

      localStorage.setItem(`equipment_${slot}_${slotIndex}`, JSON.stringify(item));
      window.location.href = "crear-personaje.html";
    });
  });
}

backBtn.addEventListener("click", () => {
  window.location.href = "crear-personaje.html";
});

getParams();
loadEquipment();