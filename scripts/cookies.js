document.addEventListener("DOMContentLoaded", () => {
    fetch("data/cookies.json") // adjust path if needed
        .then(response => response.json())
        .then(data => {
            window.allCookies = data.cookies; // Save globally
            renderCookies(data.cookies);
        })
        .catch(error => console.error("Error loading cookies:", error));
});

// Render cookies to the DOM
function renderCookies(cookies) {
    const container = document.getElementById("cookies-container");
    container.innerHTML = cookies.map(cookie => `
        <div class="col-sm-6 col-lg-4">
            <div class="box text-center">
                <div class="img-box">
                    <img src="${cookie.img}" alt="${cookie.name}">
                </div>
                <div class="detail-box">
                    <h5>${cookie.name}</h5>
                </div>
            </div>
        </div>
    `).join("");
}

// Search handler
document.getElementById("cookie-search-btn").addEventListener("click", () => {
    const query = document.getElementById("cookie-search").value.trim().toLowerCase();
    const filtered = window.allCookies.filter(cookie => 
        cookie.id.toLowerCase().includes(query) ||
        cookie.name.toLowerCase().includes(query) ||
        cookie.tags.some(tag => tag.toLowerCase().includes(query))
    );
    renderCookies(filtered);
});

// Optional: Enter key triggers search
document.getElementById("cookie-search").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("cookie-search-btn").click();
    }
});
