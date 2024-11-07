import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // Asegúrate de tener la configuración de la base de datos

const Alquiler = sequelize.define(
  "Alquiler",
  {
    nombreRecurso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reservar: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    mantenimiento: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "disponible",
    },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    // Métodos adicionales
    hooks: {
      // Hook para verificar la disponibilidad antes de reservar
      beforeCreate: (alquiler) => {
        if (alquiler.reservar && !alquiler.disponible) {
          throw new Error("El recurso no está disponible para ser reservado.");
        }
      },
    },
  }
);

// Relación con Client
Alquiler.associate = (models) => {
  Alquiler.belongsTo(models.Client, {
    foreignKey: "clientId",
    as: "client",
  });
};

// Método para verificar disponibilidad de un recurso
Alquiler.prototype.verificarDisponibilidad = function () {
  return this.disponible;
};

export default Alquiler;
