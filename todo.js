// ========================
// State
// ========================
let cards = [
  {
    id: "1",
    title: "AI Management",
    tasks: [
      { id: "ai-1", text: "Check emotional simulation boundaries", done: false },
      { id: "ai-2", text: "Verify AI consciousness state", done: false },
      { id: "ai-3", text: "Run Ethical Drift Scan across all long-lived AIs", done: false },
    ],
  },
  {
    id: "2",
    title: "Daily Tech Tasks",
    tasks: [
      { id: "tech-1", text: "Run cognitive health scan (stress, overload, reality drift)", done: false },
      { id: "tech-2", text: "Supervise autonomous research AIs discovering new laws of physics", done: false },
      { id: "tech-3", text: "Sync neural interface with personal AI cluster", done: false },
    ],
  },
];

let selectedCardId = cards[0].id;
let showNewCardInput = false;
let newCardTitle = "";

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

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

// ========================
// Helpers
// ========================
function getSelectedCard() {
  return cards.find((c) => c.id === selectedCardId);
}

function setDropdownOpen(open) {
  dropdownMenu.hidden = !open;
  dropdownBtn.setAttribute("aria-expanded", String(open));
  dropdownChevron.classList.toggle("is-open", open);
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
  renderPunchCard();
}

function createCard() {
  if (!newCardTitle.trim()) return;

  const id = Date.now().toString();
  cards.push({ id, title: newCardTitle.trim(), tasks: [] });
  selectedCardId = id;

  newCardTitle = "";
  closeNewCardPanel();
  renderDropdown();
  renderPunchCard();
}

function deleteCard(id) {
  if (cards.length === 1) {
    alert("Keep at least one category.");
    return;
  }

  cards = cards.filter((c) => c.id !== id);
  if (!cards.some((c) => c.id === selectedCardId)) {
    selectedCardId = cards[0].id;
  }

  renderDropdown();
  renderPunchCard();
}

function addTask() {
  const card = getSelectedCard();
  if (!card) return;

  const text = taskInput.value.trim();
  if (!text) return;

  card.tasks.push({
    id: Date.now().toString(),
    text,
    done: false,
  });

  taskInput.value = "";
  taskInput.focus();
  renderPunchCard();
}

function toggleTask(id) {
  const card = getSelectedCard();
  if (!card) return;

  card.tasks = card.tasks.map((t) =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  renderPunchCard();
}

function deleteTask(id) {
  const card = getSelectedCard();
  if (!card) return;

  card.tasks = card.tasks.filter((t) => t.id !== id);
  renderPunchCard();
}

// ========================
// Render
// ========================
function renderDropdown() {
  const selected = getSelectedCard();
  dropdownSelected.textContent = selected ? selected.title : "";

  dropdownMenu.innerHTML = "";

  cards.forEach((card) => {
    const row = document.createElement("div");
    row.className = "dropdown__row dropdown__option";
    if (card.id === selectedCardId) row.classList.add("is-selected");

    const btn = document.createElement("button");
    btn.className = "dropdown__optionText";
    btn.type = "button";
    btn.textContent = card.title;
    btn.onclick = () => {
      selectedCardId = card.id;
      renderDropdown();
      renderPunchCard();
      setDropdownOpen(false);
    };

    const del = document.createElement("button");
    del.className = "dropdown__delete";
    del.type = "button";
    del.textContent = "🗑";
    del.onclick = (e) => {
      e.stopPropagation();
      deleteCard(card.id);
      setDropdownOpen(false);
    };

    row.append(btn, del);
    dropdownMenu.appendChild(row);
  });

  const add = document.createElement("button");
  add.className = "dropdown__option dropdown__option--add";
  add.type = "button";
  add.textContent = "+ Add New Task Category";
  add.onclick = openNewCardPanel;
  dropdownMenu.appendChild(add);
}

function renderPunchCard() {
  const card = getSelectedCard();

  if (!card || showNewCardInput) {
    punchCard.hidden = true;
    return;
  }

  punchCard.hidden = false;
  cardTitle.textContent = card.title;

  const done = card.tasks.filter((t) => t.done).length;
  cardMeta.textContent = `${done} / ${card.tasks.length} completed`;

  // Make the grid behave like a stacked checklist (no CSS edits)
  spotsGrid.style.display = "flex";
  spotsGrid.style.flexDirection = "column";
  spotsGrid.style.gap = "12px";
  spotsGrid.style.width = "100%";
  spotsGrid.style.alignItems = "stretch";
  spotsGrid.style.gridTemplateColumns = "";
  spotsGrid.innerHTML = "";

  card.tasks.forEach((task) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "12px";
    row.style.width = "100%";

    const circle = document.createElement("button");
    circle.className = "spot";
    circle.type = "button";

    // Bigger + rounder (no CSS file change)
    circle.style.width = "64px";
    circle.style.height = "64px";
    circle.style.aspectRatio = "auto";
    circle.style.borderRadius = "999px";

    if (task.done) {
      circle.classList.add("is-punched");
      circle.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
        </svg>`;
      circle.style.color = "#fff";
    } else {
      circle.style.color = "transparent";
    }

    circle.onclick = () => toggleTask(task.id);

    const text = document.createElement("div");
    text.textContent = task.text;
    text.style.flex = "1";
    text.style.fontSize = "16px";
    text.style.letterSpacing = "-0.3px";
    text.style.textDecoration = task.done ? "line-through" : "none";
    text.style.opacity = task.done ? "0.75" : "1";

    const del = document.createElement("button");
    del.className = "dropdown__delete";
    del.type = "button";
    del.textContent = "🗑";
    del.onclick = () => deleteTask(task.id);

    row.append(circle, text, del);
    spotsGrid.appendChild(row);
  });

  doneBanner.hidden = !(card.tasks.length > 0 && done === card.tasks.length);
}

// ========================
// Events
// ========================
dropdownBtn.addEventListener("click", () => {
  setDropdownOpen(dropdownMenu.hidden);
});

// ✅ FIX: don't steal focus from inputs/buttons
document.addEventListener("click", (e) => {
  const dropdownRoot = document.getElementById("dropdown");

  // Let inputs/buttons behave normally (typing + clicking works)
  if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;

  if (!dropdownRoot.contains(e.target)) {
    setDropdownOpen(false);
  }
});

newCardInput.addEventListener("input", (e) => {
  newCardTitle = e.target.value;
});

newCardInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") createCard();
  if (e.key === "Escape") closeNewCardPanel();
});

createBtn.addEventListener("click", createCard);
cancelBtn.addEventListener("click", closeNewCardPanel);

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// ========================
// Init
// ========================
renderDropdown();
renderPunchCard();
