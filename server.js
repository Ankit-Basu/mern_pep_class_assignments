const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data", "students.json");

app.use(express.json());

const readData = () => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(DATA_FILE, "utf8");
    let data = "";
    stream.on("data", (chunk) => (data += chunk));
    stream.on("end", () => resolve(data ? JSON.parse(data) : []));
    stream.on("error", (err) => {
      console.log(err);
      resolve([]);
    });
  });
};

const writeData = (data) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(DATA_FILE);
    stream.write(JSON.stringify(data, null, 2));
    stream.end();
    stream.on("finish", () => resolve(true));
    stream.on("error", () => resolve(false));
  });
};

app.get("/students", (req, res) => {
  readData().then((students) => {
    res.status(200).json(students);
  });
});

app.get("/students/:id", (req, res) => {
  readData().then((students) => {
    const student = students.find((s) => s.id == req.params.id);
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  });
});

app.post("/students", (req, res) => {
  readData().then((students) => {
    students.push(req.body);
    writeData(students).then(() => {
      res.status(200).json(req.body);
    });
  });
});

app.put("/students/:id", (req, res) => {
  readData().then((students) => {
    const index = students.findIndex((s) => s.id == req.params.id);
    if (index === -1) {
      return res.status(400).json({ message: "Student not found" });
    }
    students[index] = { ...students[index], ...req.body };
    writeData(students).then(() => {
      res.status(200).json(students[index]);
    });
  });
});

app.delete("/students/:id", (req, res) => {
  readData().then((students) => {
    const newStudents = students.filter((s) => s.id != req.params.id);
    if (students.length === newStudents.length) {
      return res.status(400).json({ message: "Student not found" });
    }
    writeData(newStudents).then(() => {
      res.status(200).json({ message: "Student deleted successfully" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
