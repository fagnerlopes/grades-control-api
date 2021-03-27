import express from "express";
import { promises as fs } from "fs";
import gradesRouter from "./routes/grade.js";
const { readFile, writeFile } = fs;

const app = express();
app.use(express.json());

global.fileName = "grades.json";

app.use("/grades", gradesRouter);
app.listen(3000, async () => {
  try {
    await readFile(fileName);
    console.log("API started");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      grades: [],
    };
    await writeFile(fileName, JSON.stringify(initialJson), null, 2);
    console.log("API started an json file created");
  }
});
