const mongoose = require("mongoose");

// const task = require("../interfaces/IInterfaces")

const spring = new mongoose.Schema(
    {
        fecha_inicio: String,
        fecha_cierre: String,
        tareas: [],
        color: String
    }
)

module.exports = mongoose.model("Spring", spring);