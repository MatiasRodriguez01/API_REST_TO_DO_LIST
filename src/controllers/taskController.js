
const Spring = require("../modules/Sprint.model")
const Backlog = require('../modules/Backlog.model')
const Task = require("../modules/task.model");

const getTaskById = async (req, res, next) => {

    let task;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: "El id de la tarea no es valido"
        })
    }

    try {
        task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "La tarea no fue encontrada" });
        }
        
    } catch (err) {
        return res.status(500).json(
            {
                message: err.message
            }
        )
    }

    res.task = task;
    next();

}

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

const putUpdateTaskController = async (req, res) => {
    try {

        const task = res.task;
        task.titulo = req.body.titulo || book.titulo;
        task.descripcion = req.body.descripcion || book.descripcion;
        task.estado = req.body.estado || book.estado;
        task.fecha_limite = req.body.fecha_limite || book.fecha_limite;
        task.color = req.body.color || book.color;

        const updateTask = await task.save();
        res.json(updateTask)

    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

const patchTaskController = async (req, res) => {
    if (!req.body.titulo || !req.body.descripcion || !req.body.estado || !req.body.fecha_limite) {
        return res.status(400).json({
            message: "Al menos uno de estos campos debe ser enviado: titulo, descripcion, estado y fecha limite."
        })
    }
    try {

        const task = res.task;
        task.titulo = req.body.titulo || book.titulo;
        task.descripcion = req.body.descripcion || book.descripcion;
        task.estado = req.body.estado || book.estado;
        task.fecha_limite = req.body.fecha_limite || book.fecha_limite;
        task.color = req.body.color || book.color;

        const updateTask = await task.save();
        res.json(updateTask)

    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

const EliminarTarea = async (req, res, next) => {
    try {
        const task = res.task;
        const springs = await Spring.find();
        const backlog = await Backlog.findOne();

        const result_spring = springs.filter((spring) => spring.tareas.includes(task))
        const result_backlog = backlog.tareas.includes(task)

        if (result_spring) {
            return res.status(404).json({
                message: `La tarea ${task.titulo} no se puede eliminar porque esta asociado a una spring`
            })
        } 
        
        if (result_backlog) {
            return res.status(404).json({
                message: `La tarea ${task.titulo} no se puede eliminar porque esta asociado al backlog`
            })
        } 

        next();

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteTaskController = async (req, res) => {
    try {
        const task = res.task;

        await task.deleteOne({
            _id: task._id
        });

        res.json({
            message: `la tarea ${task.titulo} fue eliminada correctamente`
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
    getTaskById,
    getAllTaskController,
    postCreateTaskController,
    putUpdateTaskController,
    patchTaskController,
    EliminarTarea,
    deleteTaskController
}