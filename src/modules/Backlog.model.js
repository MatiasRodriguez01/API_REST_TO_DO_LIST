const mongoose = require("mongoose")

const backlog = new mongoose.Schema(
    {
        tareas: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task"
            }
        ]
    }
)

module.exports = mongoose.model("Backlog", backlog);