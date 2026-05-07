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
    ...(equipmentData.focus || []),
    ...(equipmentData.helmets || [])
  ];

  return allItems.filter(item => {
    const id = Number(item.id);

    if (slot === "arma_1_mano") {
      return id >= 10000 && id < 20000;
    }

    if (slot === "arma_2_manos") {
      return id >= 20000 && id < 30000;
    }

    if (slot === "foco") {
      return id >= 30000 && id < 40000;
    }

    if (slot === "escudo" || slot === "escudo_ligero") {
      return id >= 40000 && id < 50000;
    }

    if (slot === "armadura_ligera") {
      return id >= 50000 && id < 60000;
    }

    if (slot === "armadura_intermedia") {
      return id >= 60000 && id < 70000;
    }

    if (slot === "armadura_pesada") {
      return id >= 70000 && id < 80000;
    }

    if (slot === "casco_ligero") {
      return id >= 80000 && id < 90000;
    }

    if (slot === "casco_pesado") {
      return id >= 90000 && id < 100000;
    }

    return item.slot_type === slot;
  });
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