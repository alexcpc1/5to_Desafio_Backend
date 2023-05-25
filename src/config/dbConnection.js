import mongoose from "mongoose";
import {options} from "./options.js";

try {
  await mongoose.connect(options.mongoDB.url);
  console.log("base de datos conectada");
} catch (error) {
  console.log(`Hubo un error al conectar la base de datos ${error.message}`);
}