document.addEventListener("DOMContentLoaded", () => {
    fetch("data/testimonials.json")
        .then(response => response.json())
        .then(data => loadTestimonials(data.testimonials))
        .catch(error => console.error("Error loading testimonials:", error));
});

function loadTestimonials(testimonials) {
    const container = document.getElementById("testimonials-container");

    container.innerHTML = testimonials.map(testimonial => `
        <div class="col-md-4">
            <img src="${testimonial.img}" alt="${testimonial.name}" class="rounded-circle mb-3" style="width: 100px; height: 100px;">
            <h5>${testimonial.platform}</h5>
            <p>"${testimonial.quote}"</p>
            <p>${"⭐".repeat(testimonial.stars)}</p>
        </div>
    `).join("");
}
