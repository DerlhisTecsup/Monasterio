import express from "express";
const router = express.Router();
import {
  createAlquiler,
  deleteAlquiler,
  getAlquileres,
  updateAlquiler,
  getAlquileresPorCliente,
} from "../controllers/alquilerController.js";
import auth from "../middleware/auth.js";

// Crear un nuevo alquiler
router.post("/", auth, createAlquiler);

// Obtener todos los alquileres
router.get("/", auth, getAlquileres);

// Obtener alquileres de un cliente específico
router.get("/cliente/:clientId", auth, getAlquileresPorCliente);

// Eliminar un alquiler por ID
router.delete("/:id", auth, deleteAlquiler);

// Actualizar un alquiler por ID
router.patch("/:id", auth, updateAlquiler);

export default router;
