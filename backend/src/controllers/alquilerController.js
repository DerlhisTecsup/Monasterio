import { Op } from "sequelize";
import Alquiler from "../models/alquilermodel.js"; // Asegúrate de importar el modelo de Alquiler

// Crear un nuevo alquiler
export const createAlquiler = async (req, res) => {
  const {
    clientId,
    nombreRecurso,
    fechaInicio,
    fechaFin,
    reservar,
    disponible,
    mantenimiento,
    estado,
    ubicacion,
    descripcion,
  } = req.body;

  try {
    // Verificar si el recurso ya está alquilado en el rango de fechas
    const alquilerExistente = await Alquiler.findOne({
      where: {
        nombreRecurso,
        [Op.or]: [
          {
            [Op.and]: [
              { fechaInicio: { [Op.lte]: fechaFin } },
              { fechaFin: { [Op.gte]: fechaInicio } },
            ],
          },
        ],
      },
    });

    if (alquilerExistente) {
      return res
        .status(400)
        .json({
          message: "El recurso ya está reservado en este rango de fechas",
        });
    }

    // Crear un nuevo alquiler
    const alquiler = await Alquiler.create({
      clientId,
      nombreRecurso,
      fechaInicio,
      fechaFin,
      reservar,
      disponible,
      mantenimiento,
      estado,
      ubicacion,
      descripcion,
    });

    res.status(201).json({ message: "Alquiler creado con éxito", alquiler });
  } catch (err) {
    console.error("Error al crear alquiler:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener todos los alquileres
export const getAlquileres = async (req, res) => {
  try {
    const alquileres = await Alquiler.findAll();
    res.json(alquileres);
  } catch (error) {
    console.error("Error al obtener alquileres:", error);
    res.status(500).json({ message: "Error al obtener alquileres" });
  }
};

// Obtener alquileres de un cliente
export const getAlquileresPorCliente = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const alquileres = await Alquiler.findAll({ where: { clientId } });
    if (alquileres.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron alquileres para este cliente" });
    }
    res.json(alquileres);
  } catch (error) {
    console.error("Error al obtener alquileres del cliente:", error);
    res
      .status(500)
      .json({ message: "Error al obtener alquileres del cliente" });
  }
};

// Eliminar un alquiler
export const deleteAlquiler = async (req, res) => {
  try {
    const alquilerId = req.params.id;
    const alquiler = await Alquiler.findByPk(alquilerId);
    if (!alquiler) {
      return res.status(404).json({ message: "Alquiler no encontrado" });
    }
    await alquiler.destroy();
    res.json({ message: "Alquiler eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar alquiler:", error);
    res.status(500).json({ message: "Error al eliminar alquiler" });
  }
};

// Actualizar un alquiler
export const updateAlquiler = async (req, res) => {
  try {
    const alquilerId = req.params.id;
    const updatedData = req.body;
    const alquiler = await Alquiler.findByPk(alquilerId);

    if (!alquiler) {
      return res.status(404).json({ message: "Alquiler no encontrado" });
    }

    // Verificar si se está intentando actualizar las fechas de un alquiler ya existente
    if (updatedData.fechaInicio || updatedData.fechaFin) {
      const alquilerExistente = await Alquiler.findOne({
        where: {
          nombreRecurso: alquiler.nombreRecurso,
          [Op.or]: [
            {
              [Op.and]: [
                {
                  fechaInicio: {
                    [Op.lte]: updatedData.fechaFin || alquiler.fechaFin,
                  },
                },
                {
                  fechaFin: {
                    [Op.gte]: updatedData.fechaInicio || alquiler.fechaInicio,
                  },
                },
              ],
            },
          ],
        },
      });

      if (alquilerExistente) {
        return res
          .status(400)
          .json({
            message: "El recurso ya está reservado en este rango de fechas",
          });
      }
    }

    // Actualizar el alquiler
    await alquiler.update(updatedData);
    res.json({ message: "Alquiler actualizado con éxito", alquiler });
  } catch (error) {
    console.error("Error al actualizar alquiler:", error);
    res.status(500).json({ message: "Error al actualizar alquiler" });
  }
};
