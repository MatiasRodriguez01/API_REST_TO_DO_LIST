const Spring = require("../modules/Sprint.model")
const Task = require("../modules/task.model")

const getSpring = async (req, res, next) => {
    let spring;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: "El id de la spring no es valido"
        })
    }

    try {
        spring = await Spring.findById(id);
        if (!spring) {
            return res.status(404).json(
                {
                    message: "La spring no fue encontrada"
                }
            )
        }
    } catch (err) {
        return res.status(500).json(
            {
                message: err.message
            }
        )
    }

    res.spring = spring;
    next();
}

const getAllSpringController = async (req, res) => {
    try {
        // obtenemos todas las tareas
        const springs = await Spring.find();
        console.log("GET ALL springs: ", springs)

        // preguntamos que si las tareas existen
        if (springs.length === 0) {
            res.status(204).json([])
        }

        // mandamos las tareas a la base
        res.status(200).json(springs)
    } catch (error) {

        // mostramos un mensaje de error
        res.status(500).json({
            message: `Ocurrio un error en getAllSpringController: ${error.message}`
        })
    }
}

const postSpringController = async (req, res) => {
    const { fecha_inicio, fecha_cierre, tareas, color } = req.body;
    if (!fecha_inicio || !fecha_cierre) {
        return res.status(400).json({
            message: "Los parametros titulo, descripcion, estado y fecha limite son obligatorios"
        })
    }
    const newSpring = new Spring(
        {
            fecha_inicio,
            fecha_cierre,
            tareas,
            color
        }
    )

    try {
        const springSaved = await newSpring.save();
        console.log("Nuevo spring: ", springSaved)
        res.status(201).json(springSaved)
    } catch (error) {
        return res.status(400).json({
            message: `Ocurrio un error en postSpringController: ${error.message}`
        })
    }

}

const putSpringController = async (req, res) => {
    try {
        const spring = res.spring;
        spring.fecha_inicio = req.body.fecha_inicio = spring.fecha_inicio;
        spring.fecha_cierre = req.body.fecha_cierre = spring.fecha_cierre;
        spring.color = req.body.color = spring.color;

        const updateSpring = await spring.save();
        res.json(updateSpring)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

const patchSpringController = async (req, res) => {
    if (!req.body.fecha_inicio || !req.body.fecha_cierre || !req.body.color) {
        return res.status(400).json({
            message: "Al menos uno de estos campos debe ser enviado: fecha_inicio, fecha_cierre y color"
        })
    }
    try {
        const spring = res.spring;
        spring.fecha_inicio = req.body.fecha_inicio = spring.fecha_inicio;
        spring.fecha_cierre = req.body.fecha_cierre = spring.fecha_cierre;
        spring.color = req.body.color = spring.color;

        const updateSpring = await spring.save();
        res.json(updateSpring)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

const deletePatchController = async (req, res) => {
    try {
        const spring = res.spring;
        await spring.deleteOne({
            _id: spring._id,
            tareas: []
        });
        res.json({
            message: `El spring fue eliminado correctamente`
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const getTaskSpringController = async (req, res) => {
    try {
        const spring = res.spring;

        const tasks = spring.tareas;

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({
                message: "El spring no tiene tareas"
            });
        }

        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({
            message: `Ocurrió un error en getTaskSpringController: ${err.message}`
        });
    }
}

const getTaskByIdSpringController = async (req, res) => {
    const { taskId } = req.params;
    const spring = res.spring;

    if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: "El id la tarea no es valido"
        })
    }

    try {

        const task = spring.tareas.find((tarea) => tarea._id.equals(taskId));
        console.log("Tarea: ", task)
        if (!task) {
            res.status(404).json(
                {
                    message: "La tarea no se encontro"
                }
            )
        }
        res.json(task);

    } catch (error) {
        res.status(500).json({
            message: `Ocurrio un error en getTaskByIdSpringController: ${error.message}`
        })
    }

}

const putTaskSpringController = async (req, res) => {

    try {
        let task = req.body;

        if (task) {
            const newTask = new Task(task);

            newTask.save().then((task) => {
                const spring = res.spring;

                spring.tareas.push(task);
                spring.save();
                return res.json(task);

            }).catch((error) => {
                res.status(400).json({
                    message: `Ocurrio un error al crear la tarea en el spring: ${error.message}`
                })
            })
        }

    } catch (error) {
        return res.status(500).json(
            {
                message: `Ocurrio un error en putTaskSpringController: ${error.message}`
            }
        )
    }
}

const deleteTaskSpringController = async (req, res) => {

    const { taskId } = req.params;
    const spring = res.spring;

    try {
        const index = spring.tareas.findIndex((tarea) => tarea._id.equals(taskId));
        const [taskSpring] = spring.tareas.splice(index, 1);

        const task = await Task.findById(taskId);

        if (task) {
            await task.deleteOne({
                _id: task._id
            });
        }

        await spring.save();
        res.status(200).json(
            {
                message: `Tarea ${taskSpring.titulo} Eliminada!`
            }
        )


    } catch (error) {
        res.status(404).json(
            {
                message: `Hubo un error al eliminar una tarea en la spring: ${error.message}`
            }
        )
    }

}



module.exports = {
    getSpring,
    getAllSpringController,
    postSpringController,
    putSpringController,
    patchSpringController,
    deletePatchController,
    getTaskSpringController,
    getTaskByIdSpringController,
    putTaskSpringController,
    deleteTaskSpringController
}