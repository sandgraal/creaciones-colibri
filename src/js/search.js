const searchRoot = document.querySelector("[data-search-root]");

if (searchRoot && typeof window.Fuse !== "undefined") {
  const searchInput = searchRoot.querySelector("[data-search-input]");
  const resultsContainer = searchRoot.querySelector("[data-search-results]");
  const clearButton = searchRoot.querySelector("[data-search-clear]");
  const filterInputs = Array.from(searchRoot.querySelectorAll("[data-filter-checkbox]"));
  const endpoint = searchRoot.dataset.searchEndpoint || "/search.json";
  const emptyMessage = searchRoot.dataset.searchEmpty ||
    "No products match your criteria right now. Try adjusting filters or search terms.";
  const errorMessage = searchRoot.dataset.searchError ||
    "Search is unavailable right now. Please try again later.";
  const clearLabel = searchRoot.dataset.searchClearLabel;

  if (!searchInput || !resultsContainer) {
    return;
  }

  if (clearButton && clearLabel) {
    clearButton.textContent = clearLabel;
  }

  const setBusy = isBusy => {
    if (resultsContainer) {
      resultsContainer.setAttribute("aria-busy", isBusy ? "true" : "false");
    }
  };

  const hasFiltersSelected = filters =>
    Object.values(filters).some(values => values.length > 0);

  const getSelectedFilters = () => {
    return filterInputs.reduce(
      (acc, input) => {
        if (input.checked) {
          const type = input.dataset.filterType;
          if (type && Array.isArray(acc[type])) {
            acc[type].push(input.value);
          }
        }
        return acc;
      },
      { category: [], dietary: [], benefits: [] }
    );
  };

  const applyFilters = (items, filters) =>
    items.filter(item => {
      if (filters.category.length && !filters.category.includes(item.category)) {
        return false;
      }

      if (
        filters.dietary.length &&
        !filters.dietary.every(tag => Array.isArray(item.dietary) && item.dietary.includes(tag))
      ) {
        return false;
      }

      if (
        filters.benefits.length &&
        !filters.benefits.every(tag => Array.isArray(item.benefits) && item.benefits.includes(tag))
      ) {
        return false;
      }

      return true;
    });

  const createLabelsMarkup = labels => {
    if (!Array.isArray(labels) || !labels.length) {
      return "";
    }

    return `
      <ul class="search-result-card__labels">
        ${labels.map(label => `<li class="search-result-card__label">${label}</li>`).join("")}
      </ul>
    `.trim();
  };

  const renderResults = items => {
    setBusy(true);
    resultsContainer.innerHTML = "";

    if (!items.length) {
      const emptyState = document.createElement("p");
      emptyState.className = "search-empty";
      emptyState.textContent = emptyMessage;
      resultsContainer.appendChild(emptyState);
      setBusy(false);
      return;
    }

    const list = document.createElement("div");
    list.classList.add("search-results-list");

    items.forEach(item => {
      const card = document.createElement("article");
      card.className = "search-result-card";
      const labelsMarkup = createLabelsMarkup(item.labels);
      card.innerHTML = `
          <a href="${item.url}" class="search-result-card__link">
            <div class="search-result-card__image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="search-result-card__content">
              ${labelsMarkup}
              <h3>${item.name}</h3>
              <p>${item.shortDescription}</p>
              <span class="search-result-card__meta">${item.category}</span>
            </div>
          </a>
      `;
      list.appendChild(card);
    });

    resultsContainer.appendChild(list);
    setBusy(false);
  };

  const updateResults = (products, fuse) => {
    const query = searchInput.value.trim();
    const filters = getSelectedFilters();
    const hasQuery = Boolean(query);
    const hasFilters = hasFiltersSelected(filters);

    if (!hasQuery && !hasFilters) {
      resultsContainer.innerHTML = "";
      setBusy(false);
      return;
    }

    const baseItems = hasQuery ? fuse.search(query).map(result => result.item) : products;
    const filteredItems = applyFilters(baseItems, filters);
    renderResults(filteredItems.slice(0, 12));
  };

  setBusy(true);

  fetch(endpoint)
    .then(response => response.json())
    .then(rawProducts => {
      const products = rawProducts.map(product => {
        const includedText = Array.isArray(product.includedProducts)
          ? product.includedProducts
              .map(entry => [entry.name, entry.note].filter(Boolean).join(" "))
              .join(" ")
          : "";
        const extrasText = Array.isArray(product.bundleExtras)
          ? product.bundleExtras.join(" ")
          : "";
        const subscriptionText = product.subscription
          ? [
              product.subscription.frequency,
              product.subscription.summary,
              Array.isArray(product.subscription.perks)
                ? product.subscription.perks.join(" ")
                : "",
              product.subscription.renewalNote
            ]
              .filter(Boolean)
              .join(" ")
          : "";
        const labelsText = Array.isArray(product.labels)
          ? product.labels.join(" ")
          : "";
        const shippingText = product.shippingNote || "";

        return {
          ...product,
          searchKeywords: [
            includedText,
            extrasText,
            subscriptionText,
            labelsText,
            shippingText
          ]
            .filter(Boolean)
            .join(" ")
            .trim()
        };
      });

      const fuse = new window.Fuse(products, {
        keys: [
          "name",
          "category",
          "shortDescription",
          "description",
          "dietary",
          "benefits",
          "searchKeywords"
        ],
        threshold: 0.3,
        ignoreLocation: true
      });

      const handleUpdate = () => updateResults(products, fuse);

      searchInput.addEventListener("input", handleUpdate);
      filterInputs.forEach(input => input.addEventListener("change", handleUpdate));

      clearButton?.addEventListener("click", () => {
        searchInput.value = "";
        handleUpdate();
        searchInput.focus();
      });

      setBusy(false);
    })
    .catch(() => {
      resultsContainer.innerHTML = "";
      const errorState = document.createElement("p");
      errorState.className = "search-error";
      errorState.textContent = errorMessage;
      resultsContainer.appendChild(errorState);
      setBusy(false);
    });
}
