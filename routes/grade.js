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

export default router;
