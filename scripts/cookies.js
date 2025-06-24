document.addEventListener('DOMContentLoaded', () => {
  fetch('../data/cookies.json')
    .then(r => r.json())
    .then(data => {
      window.allCookies = data.cookies;
      renderCookies(allCookies);           // render first 12
      toggleShowMore();                    // decide if button visible
    })
    .catch(err => console.error('Error:', err));
});

/* -------  CONFIG  ------- */
const START_COUNT = 12;   // 4 × 3 teaser
/* ------------------------ */

function renderCookies(list){
  const container = document.getElementById('cookies-container');
  container.innerHTML = list.map(c => `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="box text-center">
        <div class="img-box">
          <img src="${c.img}" alt="${c.name}">
        </div>
        <div class="detail-box">
          <h5>${c.name}</h5>
        </div>
      </div>
    </div>
  `).join('');
}

/* ----  Search  ---- */
document.getElementById('cookie-search-btn').addEventListener('click', runSearch);
document.getElementById('cookie-search').addEventListener('keypress', e => {
  if(e.key==='Enter'){ runSearch(); }
});

function runSearch(){
  const q = document.getElementById('cookie-search').value.trim().toLowerCase();
  const result = window.allCookies.filter(c =>
    c.id.toLowerCase().includes(q) ||
    c.name.toLowerCase().includes(q) ||
    c.tags.some(t => t.toLowerCase().includes(q))
  );
  renderCookies(result);
  document.getElementById('show-more-btn').classList.add('d-none');   // hide button on search
}

/* ----  Show-More  ---- */
const btn = document.getElementById('show-more-btn');
btn.addEventListener('click', () => {
  renderCookies(allCookies);            // show everything
  btn.classList.add('d-none');          // hide button
});

function toggleShowMore(){
  if(window.allCookies.length > START_COUNT){
    // render only the first 12 then reveal button
    renderCookies(window.allCookies.slice(0, START_COUNT));
    btn.classList.remove('d-none');
  }
}
