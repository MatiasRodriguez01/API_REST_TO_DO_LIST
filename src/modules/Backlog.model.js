const mongoose = require("mongoose")

const backlog = new mongoose.Schema(
    {
        lista_tareas: []
    }
)

module.exports = mongoose.model("Backlog", backlog);