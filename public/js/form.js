const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://key-edee-web-final-proje-ef42f60a.koyeb.app";

document.getElementById("cityForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").value;

  // gezilecek yerleri toplamak için
  const places = [...document.querySelectorAll("#placesContainer > div")]
    .map(div => ({
      title: div.querySelector(".place-title").value,
      image: div.querySelector(".place-image").value,
      description: div.querySelector(".place-desc").value
    }))
    .filter(p => p.title);

  // yemekleri toplamak için
  const foods = [...document.querySelectorAll(".food-title")]
    .map((el, i) => ({
      title: el.value,
      description: document.querySelectorAll(".food-desc")[i].value
    }))
    .filter(f => f.title);

  fetch(`${BASE_URL}/api/cities`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name,
    description,
    image,
    places,
    foods
  }),
})
  .then((res) => res.json())
  .then(() => {
    document.getElementById("message").innerHTML =
      "<div class='alert alert-success'>Şehir başarıyla eklendi!</div>";

    document.getElementById("cityForm").reset();
    document.getElementById("placesContainer").innerHTML = "";
    document.getElementById("foodsContainer").innerHTML = "";
  })
  .catch((err) => {
    document.getElementById("message").innerHTML =
      "<div class='alert alert-danger'>Hata oluştu!</div>";
    console.error(err);
  });

});

// yer ekleme
function addPlace() {
  const div = document.createElement("div");
  div.className = "mb-2";

  div.innerHTML = `
    <input class="form-control mb-1 place-title"
      placeholder="Yer adı">
    <input class="form-control mb-1 place-image"
      placeholder="Görsel URL">
    <textarea class="form-control place-desc"
      placeholder="Açıklama"></textarea>
  `;

  document.getElementById("placesContainer").appendChild(div);
}

// yemek ekleme
function addFood() {
  const div = document.createElement("div");
  div.className = "mb-2";

  div.innerHTML = `
    <input class="form-control mb-1 food-title"
      placeholder="Yemek adı">
    <textarea class="form-control food-desc"
      placeholder="Açıklama"></textarea>
  `;

  document.getElementById("foodsContainer").appendChild(div);
}
