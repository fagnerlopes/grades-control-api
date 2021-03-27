import express from "express";
const router = express.Router();
import { promises as fs } from "fs";
const { readFile, writeFile } = fs;
/*{
	"student": "Fagner Lopes",
	"subject": "01 - JavaScript",
	"type": "Desafio",
	"value": 45,
	"timestamp": "2021-03-25T22:30:24.981Z"
}*/

function getDateIso(date = null) {
  let d = null;
  if (date) {
    // data: troque por "new Date()" para a data atual
    d = date;
  } else {
    d = new Date();
  }

  // formatar data no formato ISO 8601
  let iso = d.getFullYear().toString() + "-";
  iso += d.getMonth().toString().padStart(2, "0") + "-";
  iso += d.getDate().toString().padStart(2, "0") + "T";
  iso += d.getHours().toString().padStart(2, "0") + ":";
  iso += d.getMinutes().toString().padStart(2, "0") + ":";
  iso += d.getSeconds().toString().padStart(2, "0");

  return iso;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
// this verify if all values are fill
function isValid(obj) {
  let resultado = true;
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      console.log(value);
      if (value === "" && value === null) {
        resultado = false;
        break;
      }
    }
  }
  return resultado;
}

router.post("/", async (req, res) => {
  try {
    let grade = req.body;

    const { student, subject, type, value } = grade;
    const data = JSON.parse(await readFile(fileName));

    if (!student) {
      res.send({ error: "Student is required" });
      throw new Error("Student is required");
    }

    if (!subject) {
      res.send({ error: "Subject is required" });
      throw new Error("Subject is required");
    }

    if (!type) {
      res.send({ error: "Type is required" });
      throw new Error("Type is required");
    }

    if (value === null) {
      res.send({ error: "Value is required" });
      throw new Error("Value is required");
    }

    grade = {
      id: data.nextId,
      student,
      subject,
      type,
      value,
      timestamp: getDateIso(),
    };

    data.nextId++;
    data.grades.push(grade);

    await writeFile(fileName, JSON.stringify(data), null, 2);
    res.send(grade);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(fileName));

    // this remove id because security reasons
    delete data.nextId;
    res.send(data);
  } catch (err) {
    res.send({ error: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const data = JSON.parse(await readFile(fileName));
    const grade = data.grades.find((grade) => grade.id === parseInt(id));
    res.send(grade);
  } catch (err) {
    res.send({ error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const data = JSON.parse(await readFile(fileName));
    data.grades = data.grades.filter((grade) => {
      return grade.id !== parseInt(id);
    });
    await writeFile(fileName, JSON.stringify(data, null, 2));
    res.send({ success: "Record deleted" });
  } catch (err) {
    res.send(err);
  }
});

router.put("/", async (req, res) => {
  try {
    let grade = req.body;
    const { id, student, subject, type, value } = grade;
    if (
      !id ||
      !student ||
      !subject ||
      !type ||
      value === null ||
      value === ""
    ) {
      res.send("All fields are required");
      throw new Error("All fields are required");
    }

    const data = JSON.parse(await readFile(fileName));
    let { grades } = data;
    const index = grades.findIndex((g) => g.id === parseInt(grade.id));

    if (index == -1) {
      res.send("Record not found.");
      throw new Error("Record not found.");
    }

    data.grades[index].student = student;
    data.grades[index].subject = subject;
    data.grades[index].type = type;
    data.grades[index].value = value;
    data.grades[index].timestamp = getDateIso();

    writeFile(fileName, JSON.stringify(data), null, 2);
    res.send(data.grades[index]);
  } catch (err) {
    res.send(err);
  }
});
export default router;
