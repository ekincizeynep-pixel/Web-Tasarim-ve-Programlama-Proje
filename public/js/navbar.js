fetch("navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;

    const username = localStorage.getItem("username");
    const isAdmin = localStorage.getItem("isAdmin");
    const adminLink = document.getElementById("adminLink");
    const loginLink = document.getElementById("loginLink");
    const userDropdown = document.getElementById("userDropdown");
    const navbarUsername = document.getElementById("navbarUsername");
    const logoutBtn = document.getElementById("logoutBtn");
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");

      if (href === currentPage) {
        link.classList.add("active");
        link.style.fontWeight = "600";
      }
    });

    // giriş yoksa
    if (!username) {
      if (adminLink) adminLink.style.display = "none";
      if (userDropdown) userDropdown.style.display = "none";
      if (loginLink) loginLink.style.display = "block";
      return;
    }

    // giriş varsa
    if (username) {
      userDropdown.style.display = "block";
      navbarUsername.textContent = username;
      if (loginLink) loginLink.style.display = "none";
    } else {
      if (loginLink) loginLink.style.display = "block";
    }

    // admin değilse şehir ekleyemez
    if (isAdmin !== "true") {
      if (adminLink) adminLink.style.display = "none";
    }

    // çıkış
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "index.html";
      });
    }
  });
  

