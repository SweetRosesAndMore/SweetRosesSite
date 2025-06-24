/* =========================================================
   Sweet Roses & More  •  Cookie Library
   ========================================================= */

/* ---- CONFIG ---- */
const JSON_URL    = "../data/cookies.json";  // relative to cookieLibrary.html
const START_COUNT = 12;                      // 4 × 3 teaser grid
/* ---------------- */

let allCookies = [];   // flattened master list


function shuffle(array){
  for(let i=array.length-1; i>0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* 1 ─ Fetch & flatten by category */
document.addEventListener("DOMContentLoaded", () => {
  fetch(JSON_URL)
    .then(r => r.json())
    .then(data => {
      allCookies = Object.entries(data.cookies).flatMap(
        ([category, arr]) => arr.map(item => ({ ...item, category }))
      );

      shuffle(allCookies);

      renderCookies(allCookies.slice(0, START_COUNT));
      toggleShowMore();
    })
    .catch(err => console.error("Cookie-JSON error:", err));
});

/* 2 ─ Render cards */
function renderCookies(list) {
  const grid = document.getElementById("cookies-container");

  grid.innerHTML = list.map(c => `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="box text-center cursor-pointer"
           data-img="${c.img}"
            data-desc="">
        <div class="img-box">
          <img src="${c.img}" alt="Cookie">
        </div>
      </div>
    </div>
  `).join("");

  attachModalEvents();          // 🔸 add click listeners each time we re-render
}


/* 3 ─ LIVE SEARCH (description + image path) */
const searchInput  = document.getElementById('cookie-search');
const showMoreBtn  = document.getElementById('show-more-btn');

let debounceTimer  = null;

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runSearch, 150);   // 150 ms debounce
});

function runSearch() {
  const q = searchInput.value.trim().toLowerCase();

  /* empty box → restore teaser view + show-more btn */
  if (!q) {
    renderCookies(allCookies.slice(0, START_COUNT));
    toggleShowMore();
    return;
  }

  /* filter by description OR img path */
  const result = allCookies.filter(c =>
    c.description.toLowerCase().includes(q) ||
    c.img.toLowerCase().includes(q)
  );

  renderCookies(result);
  showMoreBtn.classList.add('d-none');          // hide button while searching
}

/* 4 ─ Show-More button (unchanged) */
showMoreBtn.addEventListener('click', () => {
  renderCookies(allCookies);
  showMoreBtn.classList.add('d-none');
});

function toggleShowMore() {
  if (allCookies.length > START_COUNT) {
    showMoreBtn.classList.remove('d-none');
  } else {
    showMoreBtn.classList.add('d-none');
  }
}
/* --------------------------------------------------
   Attach modal click handlers after every render
   --------------------------------------------------*/
function attachModalEvents(){
  const modalEl   = document.getElementById('cookieModal');
  const cookieModal = bootstrap.Modal.getOrCreateInstance(modalEl);
  const modalImg  = document.getElementById('modalImg');
  const modalDesc = document.getElementById('modalDesc');

  document
    .querySelectorAll('#cookies-container .box')
    .forEach(box => {
      box.addEventListener('click', () => {
        modalImg.src = box.dataset.img;
        modalDesc.textContent = box.dataset.desc || '';
        modalDesc.classList.toggle('d-none', !box.dataset.desc);
        cookieModal.show();
      });
    });
}
