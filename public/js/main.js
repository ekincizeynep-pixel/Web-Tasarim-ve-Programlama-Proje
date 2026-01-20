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

  fetch("http://localhost:3000/api/cities")
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
