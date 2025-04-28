const mongoose = require("mongoose")

const backlog = new mongoose.Schema(
    {
        tareas: []
    }
)

module.exports = mongoose.model("Backlog", backlog);