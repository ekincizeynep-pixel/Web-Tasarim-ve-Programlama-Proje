const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://key-edee-web-final-proje-ef42f60a.koyeb.app/";

const isAdmin = localStorage.getItem("isAdmin") === "true";
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

fetch(`${BASE_URL}/api/cities`)
  .then((res) => res.json())
  .then((cities) => {
    const container = document.getElementById("citiesContainer");

    if (cities.length === 0) {
      container.innerHTML = "<p class='text-center'>Henüz şehir eklenmedi.</p>";
      return;
    }
    cities
     .sort((a, b) => a.name.localeCompare(b.name, "tr"))
     .forEach((city) => {
      const isFavorite = favorites.includes(String(city.id));
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";

      card.innerHTML = `
        <div class="card h-100 position-relative shadow">

          ${isFavorite ? `
              <span class="position-absolute top-0 end-0 m-2 text-warning fs-4">
                <i class="bi bi-star-fill"></i>
              </span>
            ` : ""}

          <img src="${city.image}" class="card-img-top" alt="${city.name}">

          <div class="card-body">
            <h5 class="card-title">${city.name}</h5>
            <p class="card-text">${city.description.substring(0, 80)}...</p>
            <a href="city-detail.html?id=${city.id}" class="btn btn-primary mb-2">
              Detayları Gör
            </a>
            
            ${
              isAdmin
                ? `<button class="btn btn-danger btn-sm" onclick="deleteCity(${city.id})">
                     Sil
                   </button>`
                : ""
            }
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch((err) => {
    console.error("Şehirler yüklenemedi:", err);
  });
// şehir silme 
function deleteCity(id) {
  if (!confirm("Bu şehri silmek istediğinize emin misiniz?")) return;

  fetch(`http://localhost:3000/api/cities/${id}`, {
    method: "DELETE",
  }).then(() => location.reload());
}
