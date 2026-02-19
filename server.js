const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let db = { tasks: [], users: {} };

if (fs.existsSync("db.json")) {
  db = JSON.parse(fs.readFileSync("db.json"));
}

function save() {
  fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
}

app.post("/add-task", (req, res) => {
  const { link } = req.body;
  const id = Date.now();
  db.tasks.push({ id, link, views: 0 });
  save();
  res.json({ ok: true });
});

app.get("/tasks", (req, res) => {
  res.json(db.tasks);
});

app.post("/viewed", (req, res) => {
  const { id } = req.body;
  const task = db.tasks.find(t => t.id === id);
  if (task) {
    task.views++;
    save();
  }
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Server 3000"));
