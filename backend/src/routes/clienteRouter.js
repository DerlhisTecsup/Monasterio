import express from "express";
const router = express.Router();
import {
  createCliente,
  deleteCliente,
  getClientes,
  updateCliente,
} from "../controllers/clienteController.js";
import auth from "../middleware/auth.js";

// Crear un nuevo cliente
router.post("/", auth, createCliente);

// Obtener todos los clientes
router.get("/", auth, getClientes);

// Eliminar un cliente por ID
router.delete("/:id", auth, deleteCliente);

// Actualizar los datos de un cliente por ID
router.patch("/:id", auth, updateCliente);

export default router;
