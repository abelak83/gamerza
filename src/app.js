const difficultyHints = {
  novice: "Подсказки доступны после каждого события.",
  engineer: "Подсказки ограничены, больше шумов в сигналах.",
  expert: "Минимум подсказок и сильное влияние дискретизации."
};

const toast = document.getElementById("toast");
const difficultySelect = document.getElementById("difficultySelect");
const difficultyHint = document.getElementById("difficultyHint");
const missionGrid = document.getElementById("missionGrid");
const moduleGrid = document.getElementById("moduleGrid");
const glossaryList = document.getElementById("glossaryList");
const startShift = document.getElementById("startShift");
const openTrainer = document.getElementById("openTrainer");
const filterButtons = document.querySelectorAll(".filter-bar button");
const overlay = document.getElementById("overlay");
const overlayTag = document.getElementById("overlayTag");
const overlayTitle = document.getElementById("overlayTitle");
const overlayStatus = document.getElementById("overlayStatus");
const overlaySignals = document.getElementById("overlaySignals");
const overlayHint = document.getElementById("overlayHint");
const overlayLog = document.getElementById("overlayLog");
const closeOverlay = document.getElementById("closeOverlay");
const applyAction = document.getElementById("applyAction");
const pauseAction = document.getElementById("pauseAction");
const rollbackAction = document.getElementById("rollbackAction");

let missions = [];
let logEntries = [];

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
};

const addLogEntry = (entry) => {
  logEntries = [entry, ...logEntries].slice(0, 6);
  overlayLog.innerHTML = logEntries.map((item) => `<li>${item}</li>`).join("");
};

const setOverlayStatus = (items) => {
  overlayStatus.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
};

const openOverlay = () => {
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
};

const closeOverlayView = () => {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
};

const renderMissions = (filter = "all") => {
  const currentDifficulty = difficultySelect.value;
  const filtered = filter === "all" ? missions : missions.filter((mission) => mission.block === filter);

  missionGrid.innerHTML = filtered
    .map((mission) => {
      const tip = mission.difficultyTips?.[currentDifficulty] ?? "";
      return `
        <article class="mission">
          <div class="label">Блок ${mission.block} • ${mission.id}</div>
          <h3>${mission.title}</h3>
          <p>${mission.objective}</p>
          <div class="mission__kpi">
            ${mission.kpi.map((item) => `<span class="tag">${item}</span>`).join("")}
          </div>
          <div class="mission__tags">
            ${mission.signals.map((item) => `<span class="tag">${item}</span>`).join("")}
          </div>
          <p class="mission__note">${tip}</p>
        </article>
      `;
    })
    .join("");
};

const renderModules = (modules) => {
  moduleGrid.innerHTML = modules
    .map(
      (module) => `
        <article class="module">
          <div class="label">${module.code}</div>
          <h3>${module.name}</h3>
          <p>${module.effect}</p>
          <p class="muted">Риск: ${module.risk}</p>
          <p class="muted">Условия: ${module.conditions}</p>
          <ul class="module__levels">
            ${module.levels.map((level) => `<li>• ${level}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
};

const renderGlossary = (glossary) => {
  glossaryList.innerHTML = glossary
    .map(
      (item) => `
        <div class="glossary-item">
          <div class="label">${item.term}</div>
          <p>${item.definition}</p>
        </div>
      `
    )
    .join("");
};

const loadData = async () => {
  const [missionsResponse, modulesResponse, glossaryResponse] = await Promise.all([
    fetch("./data/missions.json"),
    fetch("./data/modules.json"),
    fetch("./data/glossary.json")
  ]);

  missions = await missionsResponse.json();
  const modules = await modulesResponse.json();
  const glossary = await glossaryResponse.json();

  renderMissions();
  renderModules(modules);
  renderGlossary(glossary);
};

startShift.addEventListener("click", () => {
  overlayTag.textContent = "Смена";
  overlayTitle.textContent = "Сценарий смены: АВР и АПВ";
  setOverlayStatus([
    "Предаварийный признак: рост тока на фидере №3.",
    "В резерве доступен источник №2.",
    "Критические потребители: узел 1 и 4."
  ]);
  overlaySignals.textContent = "U=10.1 кВ, I=420 А, f=49.9 Гц";
  overlayHint.textContent = "Оцените устойчивость повреждения перед включением АПВ.";
  logEntries = [];
  addLogEntry("Смена началась. Проверьте уставки АПВ и готовность резерва.");
  openOverlay();
});

openTrainer.addEventListener("click", () => {
  overlayTag.textContent = "Тренажёр";
  overlayTitle.textContent = "Сигналы: аналоговые и дискретные";
  setOverlayStatus([
    "Серия из 10 быстрых кейсов.",
    "Подсказка доступна после 3 ошибок.",
    "Комбо увеличивает очки надёжности."
  ]);
  overlaySignals.textContent = "U(t) — синус, дискретный лог — импульсы.";
  overlayHint.textContent = "Выберите тип сигнала и ключевой параметр.";
  logEntries = [];
  addLogEntry("Тренажёр готов. Первый кейс: выделите аналоговый сигнал.");
  openOverlay();
});

difficultySelect.addEventListener("change", (event) => {
  const value = event.target.value;
  difficultyHint.textContent = difficultyHints[value];
  renderMissions(document.querySelector(".filter-bar .active")?.dataset.filter ?? "all");
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderMissions(button.dataset.filter);
  });
});

closeOverlay.addEventListener("click", closeOverlayView);

applyAction.addEventListener("click", () => {
  addLogEntry("Принято решение: включить АВР, АПВ оставить в ожидании.");
  showToast("Решение применено. KPI пересчитаны.");
});

pauseAction.addEventListener("click", () => {
  addLogEntry("Шаг симуляции: событие подтверждено, состояние обновлено.");
});

rollbackAction.addEventListener("click", () => {
  addLogEntry("Откат к контрольной точке. Настройки автоматики сброшены.");
});

loadData().catch(() => {
  missionGrid.innerHTML = "<p>Не удалось загрузить данные миссий.</p>";
});
