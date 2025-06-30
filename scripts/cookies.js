/* Configuration */
const JSON_URL = "../data/cookies.json";
const START_COUNT = 12;

let allCookies = [];  // flat list (each item keeps .category)
let categories = [];  // e.g., ['babyShower','christmas', …]
let activeCat = "all";  // current category filter
let currentPool = [];  // currently displayed cookies

const searchInput = document.getElementById("cookie-search");
const showMoreBtn = document.getElementById("show-more-btn");

/* Load & Prepare Data */
document.addEventListener("DOMContentLoaded", () => {
  fetch(JSON_URL)
    .then((r) => r.json())
    .then((data) => {
      allCookies = Object.entries(data.cookies).flatMap(([cat, arr]) =>
        arr.map((item) => ({ ...item, category: cat }))
      );

      categories = Object.keys(data.cookies);
      buildFilterButtons(categories);

      shuffle(allCookies);
      currentPool = allCookies;
      renderCookies(allCookies.slice(0, START_COUNT));
      toggleShowMore();
    })
    .catch((err) => console.error("Cookie-JSON error:", err));
});

/* Filter Buttons */
function buildFilterButtons(cats) {
  const wrap = document.getElementById("filter-wrap");

  let html = `<button class="btn btn-primary btn-sm filter-btn active" data-cat="all">
                All&nbsp;(${allCookies.length})
              </button>`;

  html += cats.map(c => `
    <button class="btn btn-primary btn-sm filter-btn" data-cat="${c}">
      ${niceLabel(c)}&nbsp;(${allCookies.filter(x => x.category === c).length})
    </button>
  `).join('');

  wrap.innerHTML = html;

  wrap.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.cat, btn));
  });
}

function applyFilter(cat, clickedBtn) {
  activeCat = cat;
  wrapActive(clickedBtn);

  currentPool =
    cat === "all" ? allCookies : allCookies.filter(c => c.category === cat);

  renderCookies(currentPool.slice(0, START_COUNT));
  toggleShowMore(currentPool.length);
  resetSearch();
}

function wrapActive(btn) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function niceLabel(str) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, m => m.toUpperCase());
}

/* Cookie Grid Rendering */
function renderCookies(list) {
  const grid = document.getElementById("cookies-container");

  grid.innerHTML = list.map(c => `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="box text-center cursor-pointer" data-img="${c.img}" data-desc="">
        <div class="img-box">
          <img src="${c.img}" alt="${c.description}">
        </div>
      </div>
    </div>
  `).join("");

  attachModalEvents();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* Modal Setup */
function attachModalEvents() {
  const modalEl = document.getElementById("cookieModal");
  const cookieModal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const modalImg = document.getElementById("modalImg");
  const modalDesc = document.getElementById("modalDesc");

  document.querySelectorAll("#cookies-container .box").forEach(box => {
    box.addEventListener("click", () => {
      modalImg.src = box.dataset.img;
      modalDesc.textContent = box.dataset.desc || "";
      modalDesc.classList.toggle("d-none", !box.dataset.desc);
      cookieModal.show();
    });
  });
}

/* Live Search */
let debounceTimer = null;

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runSearch, 150);
});

function runSearch() {
  const q = searchInput.value.trim().toLowerCase();
  const base = currentPool;

  if (!q) {
    renderCookies(base.slice(0, START_COUNT));
    toggleShowMore(base.length);
    return;
  }

  const result = base.filter(c =>
    c.description.toLowerCase().includes(q) ||
    c.img.toLowerCase().includes(q)
  );

  renderCookies(result);
  showMoreBtn.classList.add("d-none");
}

function resetSearch() {
  searchInput.value = "";
}

/* Show More Button */
showMoreBtn.addEventListener("click", () => {
  renderCookies(currentPool);   
  showMoreBtn.classList.add("d-none");
});


function toggleShowMore(poolSize = allCookies.length) {
  if (poolSize > START_COUNT) {
    showMoreBtn.classList.remove("d-none");
  } else {
    showMoreBtn.classList.add("d-none");
  }
}
