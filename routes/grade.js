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
      if (!value) {
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
    if (isEmpty(grade) || !isValid(grade)) {
      res.send({ error: "All values are required" });
      throw new Error("All values are required");
    } else {
      const { student, subject, type, value, timestamp } = grade;
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

      if (!value) {
        res.send({ error: "Value is required" });
        throw new Error("Value is required");
      }

      if (!timestamp) {
        res.send({ error: "Timestamp is required" });
        throw new Error("Timestamp is required");
      }

      grade = {
        id: data.nextId,
        student,
        subject,
        type,
        value,
        timestamp,
      };

      data.nextId++;
      data.grades.push(grade);

      await writeFile(fileName, JSON.stringify(data), null, 2);
      res.send(grade);
    }
  } catch (err) {
    console.log(err);
  }
});


router.get('/', async (req, res) => {
  try {
    const data = JSON.parse(await readFile(fileName));
    
    // this remove id because security reasons
    delete data.nextId;
    res.send(data);
  } catch (err) {
    res.send({error: err});    
  }
});

router.get('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const data = JSON.parse(await readFile(fileName));
    const grade = data.grades.find(grade => grade.id === parseInt(id));
    res.send(grade);    
  } catch (err) {
    res.send({error: err});     
  }
});


export default router;
