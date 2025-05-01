const mongoose = require("mongoose");

// const task = require("../interfaces/IInterfaces")

const spring = new mongoose.Schema(
    {
        nombre: String,
        fecha_inicio: String,
        fecha_cierre: String,
        tareas: [],
        color: String
    }
)

module.exports = mongoose.model("Spring", spring);