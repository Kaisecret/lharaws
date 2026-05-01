document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "categories" || !window.CYNTHIAS_SITE) return;

  const { catalog, categoryMeta, categoryOrder, createProductCard, getCategoryProducts, initReveals } =
    window.CYNTHIAS_SITE;

  const filterTarget = document.getElementById("category-filters");
  const sectionsTarget = document.getElementById("category-sections");
  const summaryTarget = document.getElementById("category-summary");

  if (!filterTarget || !sectionsTarget) return;

  const groups = categoryOrder
    .map((categoryKey) => ({
      categoryKey,
      items: getCategoryProducts(categoryKey)
    }))
    .filter((group) => group.items.length);

  function renderSummary(categoryKey) {
    if (!summaryTarget) return;

    if (categoryKey === "all") {
      summaryTarget.textContent = `${catalog.length} styles arranged across every store category.`;
      return;
    }

    const meta = categoryMeta[categoryKey];
    const count = getCategoryProducts(categoryKey).length;
    summaryTarget.textContent = `${count} styles are now shown in ${meta.title}.`;
  }

  filterTarget.innerHTML = `
    <button class="filter-chip active" type="button" data-filter="all" aria-pressed="true">All Styles</button>
    ${groups
      .map(
        (group) => `
          <button class="filter-chip" type="button" data-filter="${group.categoryKey}" aria-pressed="false">
            ${categoryMeta[group.categoryKey].title}
          </button>
        `
      )
      .join("")}
  `;

  sectionsTarget.innerHTML = groups
    .map((group) => {
      const meta = categoryMeta[group.categoryKey];

      return `
        <section class="category-showcase" data-category-section="${group.categoryKey}" id="${meta.anchor}">
          <div class="section-heading">
            <div>
              <span class="eyebrow">Category Edit</span>
              <h2>${meta.title}</h2>
              <p>${meta.description}</p>
            </div>
            <div class="section-count">${group.items.length} Styles</div>
          </div>
          <div class="row g-4">
            ${group.items.map((product) => createProductCard(product, { mode: "category" })).join("")}
          </div>
        </section>
      `;
    })
    .join("");

  renderSummary("all");
  initReveals();

  filterTarget.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    const categoryKey = button.dataset.filter;

    filterTarget.querySelectorAll("[data-filter]").forEach((chip) => {
      const active = chip.dataset.filter === categoryKey;
      chip.classList.toggle("active", active);
      chip.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-category-section]").forEach((section) => {
      const visible = categoryKey === "all" || section.dataset.categorySection === categoryKey;
      section.classList.toggle("hidden", !visible);
    });

    renderSummary(categoryKey);

    if (categoryKey !== "all") {
      const section = document.querySelector(`[data-category-section="${categoryKey}"]`);
      if (section) {
        window.setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    }
  });
});
