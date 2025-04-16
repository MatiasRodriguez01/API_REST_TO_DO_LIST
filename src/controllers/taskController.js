

const Task = require("../modules/task.model");

const getAllTaskController = async (req, res) => {
    try {
        // obtenemos todas las tareas
        const tasks = await Task.find();
        console.log("GET ALL tareas: ", tasks)

        // preguntamos que si las tareas existen
        if (tasks.length === 0) {
            res.status(204).json([])
        }

        // mandamos las tareas a la base
        res.status(200).json(tasks)
    } catch (error) {

        // mostramos un mensaje de error
        res.status(500).json({
            message: `Ocurrio un error al mostrar las tareas: ${error.message}`
        })
    }
}

const postCreateTaskController = async (req, res) => {
    const { titulo, descripcion, estado, fecha_limite, color } = req.body;
    if (!titulo || !descripcion || !estado || !fecha_limite) {
        return res.status(400).json({
            message: "Los parametros titulo, descripcion, estado y fecha limite son obligatorios"
        })
    }
    const newTask = new Task(
        {
            titulo, 
            descripcion,
            estado, 
            fecha_limite,
            color
        }
    )
    try {
        const taskSaved = await newTask.save();
        console.log("Nuevo usuario: ", taskSaved)
        res.status(201).json(taskSaved)
    } catch (error) {
        return res.status(400).json({
            message: `Ocurrio un error al crear una tarea: ${error.message}`
        })
    }
}

module.exports = {
    getAllTaskController,
    postCreateTaskController
}