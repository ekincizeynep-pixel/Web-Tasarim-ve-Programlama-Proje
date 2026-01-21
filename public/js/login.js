const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "";

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch(`${BASE_URL}/api/login`, { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("username", username);
        window.location.href = "city-form.html";
      } else {
        document.getElementById("message").innerHTML =
          "<span class='text-danger'>Hatalı kullanıcı adı veya şifre</span>";
      }
    })
    .catch(() => {
      document.getElementById("message").innerHTML =
        "<span class='text-danger'>Sunucu hatası</span>";
    });
});

