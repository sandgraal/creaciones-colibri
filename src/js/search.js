const searchRoot = document.querySelector("[data-search-root]");

if (searchRoot && typeof window.Fuse !== "undefined") {
  const searchInput = searchRoot.querySelector("[data-search-input]");
  const resultsContainer = searchRoot.querySelector("[data-search-results]");
  const clearButton = searchRoot.querySelector("[data-search-clear]");
  const endpoint = searchRoot.dataset.searchEndpoint || "/search.json";

  if (!searchInput || !resultsContainer) {
    return;
  }

  fetch(endpoint)
    .then(response => response.json())
    .then(products => {
      const fuse = new window.Fuse(products, {
        keys: ["name", "category", "shortDescription", "description", "dietary", "benefits"],
        threshold: 0.3,
        ignoreLocation: true
      });

      const renderResults = entries => {
        resultsContainer.innerHTML = "";
        if (!entries.length) {
          resultsContainer.innerHTML = "<p class='search-empty'>No products match your search yet. Try another ingredient, benefit, or flavor.</p>";
          return;
        }

        const list = document.createElement("div");
        list.classList.add("search-results-list");
        entries.forEach(({ item }) => {
          const card = document.createElement("article");
          card.className = "search-result-card";
          card.innerHTML = `
            <a href="${item.url}" class="search-result-card__link">
              <div class="search-result-card__image">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="search-result-card__content">
                <h3>${item.name}</h3>
                <p>${item.shortDescription}</p>
                <span class="search-result-card__meta">${item.category}</span>
              </div>
            </a>
          `;
          list.appendChild(card);
        });
        resultsContainer.appendChild(list);
      };

      const handleSearch = () => {
        const value = searchInput.value.trim();
        if (!value) {
          resultsContainer.innerHTML = "";
          return;
        }
        const matches = fuse.search(value).slice(0, 8);
        renderResults(matches);
      };

      searchInput.addEventListener("input", handleSearch);

      clearButton?.addEventListener("click", () => {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
        searchInput.focus();
      });
    })
    .catch(() => {
      resultsContainer.innerHTML = "<p class='search-error'>Search is unavailable right now. Please try again later.</p>";
    });
}
