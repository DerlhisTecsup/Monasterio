import Cliente from "../models/clientemodel.js";

// Crear un cliente
export const createCliente = async (req, res) => {
  const { name, phonenumber, dni, email } = req.body;
  try {
    let cliente = await Cliente.findOne({
      where: {
        [Op.or]: [{ email }, { dni }],
      },
    });
    if (cliente) {
      return res.status(400).json({ message: "Cliente ya existe" });
    }
    cliente = await Cliente.create({
      name,
      phonenumber,
      dni,
      email,
    });
    res.status(201).json({ message: "Cliente creado con éxito" });
  } catch (err) {
    console.error("Error al crear cliente:", err);
    res.status(500).send("Error en el servidor");
  }
};

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

// Eliminar un cliente
export const deleteCliente = async (req, res) => {
  try {
    const clienteId = req.params.id;
    await Cliente.destroy({ where: { id: clienteId } });
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar cliente" });
  }
};

// Actualizar un cliente
export const updateCliente = async (req, res) => {
  try {
    const clienteId = req.params.id;
    const updatedData = req.body;
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    await cliente.update(updatedData);
    res.json({ message: "Datos del cliente actualizados", cliente });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente" });
  }
};
