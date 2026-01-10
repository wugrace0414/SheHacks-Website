// ========================
// State (mirrors App.tsx)
// ========================
let cards = [
  { id: "1", title: "Tried A New Recipe" },
  { id: "2", title: "Read A Cozy Book" },
  { id: "3", title: "Hosted A Dinner Party" },
];

let selectedCardId = cards[0].id;
let showNewCardInput = false;
let newCardTitle = "";

// PunchCard internal state (mirrors PunchCard.tsx useState)
// NOTE: This matches the original behavior: punches persist even when switching titles.
const totalSpots = 10;
let punched = Array(totalSpots).fill(false);

// ========================
// DOM
// ========================
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownSelected = document.getElementById("dropdownSelected");
const dropdownChevron = document.getElementById("dropdownChevron");

const newCardPanel = document.getElementById("newCardPanel");
const newCardInput = document.getElementById("newCardInput");
const createBtn = document.getElementById("createBtn");
const cancelBtn = document.getElementById("cancelBtn");

const punchCard = document.getElementById("punchCard");
const cardTitle = document.getElementById("cardTitle");
const cardMeta = document.getElementById("cardMeta");
const spotsGrid = document.getElementById("spotsGrid");
const doneBanner = document.getElementById("doneBanner");

// ========================
// Helpers
// ========================
function getSelectedCard() {
  return cards.find((c) => c.id === selectedCardId) || null;
}

function punchedCount() {
  return punched.filter(Boolean).length;
}

function setDropdownOpen(isOpen) {
  dropdownMenu.hidden = !isOpen;
  dropdownBtn.setAttribute("aria-expanded", String(isOpen));
  dropdownChevron.classList.toggle("is-open", isOpen);
}

function openNewCardPanel() {
  showNewCardInput = true;
  newCardPanel.hidden = false;
  punchCard.hidden = true;
  setDropdownOpen(false);

  newCardInput.value = "";
  newCardTitle = "";
  newCardInput.focus();
}

function closeNewCardPanel() {
  showNewCardInput = false;
  newCardPanel.hidden = true;
  renderPunchCard(); // show card again
}

function createCard() {
  const title = newCardTitle.trim();
  if (!title) return;

  const newCard = { id: String(Date.now()), title };
  cards = [...cards, newCard];
  selectedCardId = newCard.id;

  newCardTitle = "";
  closeNewCardPanel();
  renderDropdown();
  renderPunchCard();
}

function cancelNewCard() {
  newCardTitle = "";
  closeNewCardPanel();
}

function togglePunch(index) {
  punched[index] = !punched[index];
  renderPunchCard();
}

// ========================
// Render
// ========================
function renderDropdown() {
  const selected = getSelectedCard();
  dropdownSelected.textContent = selected ? selected.title : "";

  dropdownMenu.innerHTML = "";

  for (const card of cards) {
    // Row container
    const row = document.createElement("div");
    row.className = "dropdown__row dropdown__option";
    if (selected && card.id === selectedCardId) row.classList.add("is-selected");

    // Select button (left side)
    const selectBtn = document.createElement("button");
    selectBtn.type = "button";
    selectBtn.className = "dropdown__optionText";
    selectBtn.textContent = card.title;

    selectBtn.addEventListener("click", () => {
      selectedCardId = card.id;
      setDropdownOpen(false);

      showNewCardInput = false;
      newCardPanel.hidden = true;

      renderDropdown();
      renderPunchCard();
    });

    // Delete button (right side)
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "dropdown__delete";
    delBtn.title = "Delete punch card";
    delBtn.setAttribute("aria-label", `Delete ${card.title}`);
    delBtn.textContent = "🗑";

    // Important: stop click from also selecting the card
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteCard(card.id);
    });

    row.appendChild(selectBtn);
    row.appendChild(delBtn);
    dropdownMenu.appendChild(row);
  }

  // Add new
  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "dropdown__option dropdown__option--add";
  addBtn.textContent = "+ Add New Punch Card";
  addBtn.addEventListener("click", openNewCardPanel);
  dropdownMenu.appendChild(addBtn);
}


function renderPunchCard() {
  const selected = getSelectedCard();

  if (!selected || showNewCardInput) {
    punchCard.hidden = true;
    return;
  }

  punchCard.hidden = false;
  cardTitle.textContent = selected.title;
  cardMeta.textContent = `${punchedCount()} / ${totalSpots} completed`;

  // spots
  spotsGrid.innerHTML = "";
  for (let i = 0; i < totalSpots; i++) {
    const spot = document.createElement("button");
    spot.type = "button";
    spot.className = "spot";
    spot.setAttribute("aria-label", `Spot ${i + 1}`);

    if (punched[i]) {
      spot.classList.add("is-punched");
      spot.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
        </svg>
      `;
      // Make checkmark white like your React version (via currentColor)
      spot.style.color = "#ffffff";
    } else {
      spot.style.color = "transparent";
    }

    spot.addEventListener("click", () => togglePunch(i));
    spotsGrid.appendChild(spot);
  }

  // completed banner
  doneBanner.hidden = punchedCount() !== totalSpots;
}

// ========================
// Events
// ========================
dropdownBtn.addEventListener("click", () => {
  const willOpen = dropdownMenu.hidden; // if hidden, we will open
  setDropdownOpen(willOpen);
});

// Click outside to close dropdown
document.addEventListener("click", (e) => {
  const dropdownRoot = document.getElementById("dropdown");
  if (!dropdownRoot.contains(e.target)) {
    setDropdownOpen(false);
  }
});

newCardInput.addEventListener("input", (e) => {
  newCardTitle = e.target.value;
});

newCardInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") createCard();   // matches App.tsx onKeyDown Enter
  if (e.key === "Escape") cancelNewCard(); // matches App.tsx onKeyDown Escape
});

createBtn.addEventListener("click", createCard);
cancelBtn.addEventListener("click", cancelNewCard);

// ========================
// Init
// ========================
renderDropdown();
renderPunchCard();

function deleteCard(cardId) {
  if (cards.length <= 1) {
    alert("You must keep at least one punch card.");
    return;
  }

  const cardToDelete = cards.find(c => c.id === cardId);
  const ok = confirm(`Delete "${cardToDelete?.title ?? "this card"}"?`);
  if (!ok) return;

  // remove it
  cards = cards.filter(c => c.id !== cardId);

  // if we deleted the currently selected card, select the first remaining one
  if (selectedCardId === cardId) {
    selectedCardId = cards[0].id;
  }

  setDropdownOpen(false);
  renderDropdown();
  renderPunchCard();
}
