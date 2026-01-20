const container = document.getElementById("favoritesContainer");
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

if (favorites.length === 0) {
  container.innerHTML =
    "<p class='text-center'>Henüz favori şehir eklenmedi.</p>";
} else {
  favorites.forEach((id) => {
    fetch(`http://localhost:3000/api/cities/${id}`)
      .then(res => res.json())
      .then(city => {
        if (!city || !city.id) return;
        
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";

        card.innerHTML = `
          <div class="card h-100 shadow">
            <img src="${city.image}" class="card-img-top" alt="${city.name}">
            <div class="card-body">
              <h5 class="card-title">${city.name}</h5>

              <a href="city-detail.html?id=${city.id}" class="btn btn-primary mb-2">
                Detayları Gör
              </a>

              <button class="btn btn-warning btn-sm" onclick="removeFavorite('${city.id}')">
                <i class="bi bi-star-fill"></i> Favorilerden Çıkar
              </button>
            </div>
          </div>
        `;

        container.appendChild(card);
      });
  });
}

function removeFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites = favorites.filter(favId => favId !== String(id));
  localStorage.setItem("favorites", JSON.stringify(favorites));

  if (favorites.length === 0) {
    document.getElementById("favoritesContainer").innerHTML =
      "<p class='text-center'>Henüz favori şehir eklenmedi.</p>";
  } else {
    location.reload();
  }
}


