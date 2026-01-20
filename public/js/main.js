const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://key-edee-web-final-proje-ef42f60a.koyeb.app/";

document.getElementById("exploreBtn").addEventListener("click", () => {
  window.location.href = "cities.html";
});

function searchCity() {
  const cityName = document
    .getElementById("searchInput")
    .value
    .trim()
    .toLowerCase();

  const resultText = document.getElementById("searchResult");

  if (!cityName) {
    resultText.textContent = "Lütfen bir şehir adı giriniz.";
    return;
  }

  fetch(`${BASE_URL}/api/cities`)
  .then((res) => res.json())
  .then((cities) => {
    const foundCity = cities.find(
      (c) => c.name.toLowerCase() === cityName
    );

    if (foundCity) {
      window.location.href = `city-detail.html?id=${foundCity.id}`;
    } else {
      resultText.textContent = "Şehir bulunamadı :((";
    }
  })
  .catch(() => {
    resultText.textContent = "Bir hata oluştu!";
  });
}
