const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://key-edee-web-final-proje-ef42f60a.koyeb.app";

const params = new URLSearchParams(window.location.search);
const cityId = params.get("id");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const isAdmin = localStorage.getItem("isAdmin") === "true";
const container = document.getElementById("detailContainer");

fetch(`${BASE_URL}/api/cities/${cityId}`)
  .then(res => res.json())
  .then(city => {
    if (!city) {
      container.innerHTML = "<p>Şehir bulunamadı</p>";
      return;
    }

    // gezilecek yerler
    const placesHTML = city.places.length
      ? city.places.map(p => `
          <div class="d-flex gap-3 mb-3 align-items-start">
            ${p.image ? `
              <img src="${p.image}" width="80" height="80"
                class="rounded object-fit-cover">
            ` : ""}
            <div>
              <strong>${p.title}</strong>
              ${p.description ? `<p class="mb-0">${p.description}</p>` : ""}
            </div>
          </div>
        `).join("")
      : "<p>Bilgi yok</p>";

    // yemekler
    const foodsHTML = city.foods.length
      ? city.foods.map(f => `
          <div class="mb-2">
            <strong>🍽️ ${f.title}</strong>
            ${f.description ? `<p class="mb-1">${f.description}</p>` : ""}
          </div>
        `).join("")
      : "<p>Bilgi yok</p>";

    
    container.innerHTML = `
      <div class="card mb-4 shadow">
        <img src="${city.image}" class="card-img-top" alt="${city.name}">
        <div class="card-body">
          <h2 class="card-title">${city.name}</h2>

          <button id="favBtn" class="btn btn-outline-warning mb-3">
             Favorilere Ekle
          </button>

          <p class="card-text">${city.description}</p>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">📍 Gezilecek Yerler</h5>
              ${placesHTML}
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">🍽️ Yemek Önerileri</h5>
              ${foodsHTML}
            </div>
          </div>
        </div>
      </div>

      ${isAdmin ? adminPanel(city) : ""}
    `;

    // favoriler
    const favBtn = document.getElementById("favBtn");

    if (favorites.includes(String(city.id))) {
      favBtn.innerText = " Favorilerden Çıkar";
      favBtn.classList.remove("btn-outline-warning");
      favBtn.classList.add("btn-warning");
    }

    favBtn.addEventListener("click", () => {
      if (!favorites.includes(String(city.id))) {
        favorites.push(String(city.id));
        favBtn.innerText = " Favorilerden Çıkar";
        favBtn.classList.remove("btn-outline-warning");
        favBtn.classList.add("btn-warning");
      } else {
        favorites = favorites.filter(id => id !== String(city.id));
        favBtn.innerText = " Favorilere Ekle";
        favBtn.classList.add("btn-outline-warning");
        favBtn.classList.remove("btn-warning");
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
    });

    window.currentCity = city;
  });

// şehir detaylarını güncellemek için (sadece admin)
function adminPanel(city) {
  return `
    <hr class="my-4">
    <h4>Admin Güncelleme</h4>

    <button class="btn btn-danger mb-4"
      onclick="deleteCity(${city.id})">
      Şehri Sil
    </button>

    <h5>📍 Gezilecek Yerler</h5>
    ${city.places.map((p, i) => `
      <div class="d-flex justify-content-between align-items-start border rounded p-2 mb-2">
        <div>
          <strong>${p.title}</strong>
          <p class="mb-1">${p.description || ""}</p>
        </div>
        <button class="btn btn-sm btn-outline-danger"
          onclick="removePlace(${i})">
          Sil
        </button>
      </div>
    `).join("")}

    <h6 class="mt-3"> + Yeni Yer Ekle</h6>
    <input id="placeTitle" class="form-control mb-2" placeholder="Yer adı">
    <input id="placeImage" class="form-control mb-2" placeholder="Resim URL">
    <textarea id="placeDesc" class="form-control mb-2"
      placeholder="Açıklama"></textarea>
    <button class="btn btn-secondary mb-4"
      onclick="addPlace()">Yer Ekle</button>

    <h5>🍽️ Yemek Önerileri</h5>
    ${city.foods.map((f, i) => `
      <div class="d-flex justify-content-between align-items-start border rounded p-2 mb-2">
        <div>
          <strong>${f.title}</strong>
          <p class="mb-1">${f.description || ""}</p>
        </div>
        <button class="btn btn-sm btn-outline-danger"
          onclick="removeFood(${i})">
          Sil
        </button>
      </div>
    `).join("")}

    <h6 class="mt-3"> + Yeni Yemek Ekle</h6>
    <input id="foodTitle" class="form-control mb-2" placeholder="Yemek adı">
    <textarea id="foodDesc" class="form-control mb-2"
      placeholder="Açıklama"></textarea>
    <button class="btn btn-secondary"
      onclick="addFood()">Yemek Ekle</button>
  `;
}
// yer ekleme
function addPlace() {
  const city = window.currentCity;
  city.places.push({
    title: placeTitle.value,
    description: placeDesc.value,
    image: placeImage.value
  });
  updateCity(city);
}
// yemek ekleme
function addFood() {
  const city = window.currentCity;
  city.foods.push({
    title: foodTitle.value,
    description: foodDesc.value
  });
  updateCity(city);
}
// şehir güncelleme
function updateCity(city) {
  fetch(`${BASE_URL}/api/cities/${city.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(city)
  }).then(() => location.reload());
}
// şehir silme
function deleteCity(id) {
  if (!confirm("Bu şehri silmek istediğinize emin misiniz?")) return;

  fetch(`${BASE_URL}/api/cities/${id}`, {
    method: "DELETE"
  }).then(() => {
    window.location.href = "cities.html";
  });
}
// gezilecek yer silme
function removePlace(index) {
  if (!confirm("Bu yeri silmek istediğinize emin misiniz?")) return;

  const city = window.currentCity;
  city.places.splice(index, 1);
  updateCity(city);
}
// yemek önerisi silme
function removeFood(index) {
  if (!confirm("Bu yemek önerisini silmek istediğinize emin misiniz?")) return;

  const city = window.currentCity;
  city.foods.splice(index, 1);
  updateCity(city);
}

