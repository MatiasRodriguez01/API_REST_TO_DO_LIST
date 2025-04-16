const mongoose = require("mongoose");

const task = new mongoose.Schema(
    {
        titulo: String,
        descripcion: String,
        estado: String,
        fecha_limite: String,
        color: String
    }
)

module.exports = mongoose.model("Task", task)