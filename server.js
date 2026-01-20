const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DB_PATH = path.join(__dirname, "database.db");
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error("SQLite bağlanamadı:", err.message);
  else console.log("SQLite veritabanına bağlandı.");
});

db.run(`
  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    image TEXT,
    places TEXT,
    foods TEXT
  )
`);

// CRUD kısmı
// CREATE (şehir ekleme)
app.post("/api/cities", (req, res) => {
  const { name, description, image, places, foods } = req.body;

  db.run(
    `INSERT INTO cities (name, description, image, places, foods)
     VALUES (?, ?, ?, ?, ?)`,
    [
      name,
      description,
      image,
      JSON.stringify(places || []),
      JSON.stringify(foods || [])
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

// READ (tüm şehirleri getirme)
app.get("/api/cities", (req, res) => {
  db.all("SELECT * FROM cities", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const parsed = rows.map(city => ({
      ...city,
      places: JSON.parse(city.places || "[]"),
      foods: JSON.parse(city.foods || "[]")
    }));

    res.json(parsed);
  });
});

// tek şehir görmek için
app.get("/api/cities/:id", (req, res) => {
  db.get(
    "SELECT * FROM cities WHERE id = ?",
    [req.params.id],
    (err, city) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!city) return res.json(null);

      city.places = JSON.parse(city.places || "[]");
      city.foods = JSON.parse(city.foods || "[]");

      res.json(city);
    }
  );
});

// UPDATE (şehir güncelle)
app.put("/api/cities/:id", (req, res) => {
  const { name, description, image, places, foods } = req.body;

  db.run(
    `UPDATE cities
     SET name = ?, description = ?, image = ?, places = ?, foods = ?
     WHERE id = ?`,
    [
      name,
      description,
      image,
      JSON.stringify(places || []),
      JSON.stringify(foods || []),
      req.params.id
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ updated: this.changes });
      }
    }
  );
});

// DELETE (şehir sil)
app.delete("/api/cities/:id", (req, res) => {
  db.run(
    "DELETE FROM cities WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ deleted: this.changes });
      }
    }
  );
});

// admin girişi
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
// giriş yapabilen tek kişi var
  if (username === "Zeynep" && password === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
