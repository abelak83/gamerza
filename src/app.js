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

let missions = [];

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
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
  showToast("Смена началась: отслеживайте сигнализацию и KPI.");
});

openTrainer.addEventListener("click", () => {
  showToast("Тренажёр сигналов готов: серия из 10 быстрых кейсов.");
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

loadData().catch(() => {
  missionGrid.innerHTML = "<p>Не удалось загрузить данные миссий.</p>";
});
