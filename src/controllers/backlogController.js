const Backlog = require("../modules/Backlog.model")
const Task = require("../modules/task.model")

const ExistBacklog = async (req, res, next) => {
    let backlog;

    try {
        backlog = await Backlog.findOne();
        if (backlog) {
            res.backlog = backlog
        } else {
            res.backlog = new Backlog({
                tarea: []
            })
        }
    } catch (err) {
        return res.status(500).json(
            {
                message: err.message
            }
        )
    }

    next();
}

const getBacklogController = async (req, res) => {
    try {
        const backlog = res.json(res.backlog);

        if (!backlog) {
            res.status(200).json(
                {
                    message: "El backlog no existe"  // No hay backlog
                }
            );
        }

        console.log("GET BACKLOG: ", backlog);
        res.status(200).json(backlog);
    } catch (error) {
        res.status(500).json({
            message: `Ocurrió un error en getBacklogController: ${error.message}`
        });
    }
}

const getTasksBacklogController = async (req, res) => {
    try {
        const tasks = res.backlog.tareas;
        if (!tasks) {
            res.status(404).json(
                {
                    message: "Las tareas no existen"
                }
            )
        }
        console.log("GET TASKS: ", tasks)
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({
            message: `Ocurrió un error en getTasksBacklogController: ${error.message}`
        });
    }
}

const getTaskByIdBacklogController = async (req, res) => {

    const { id } = req.params;
    const backlog = res.backlog;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: "El id la tarea no es valido"
        })
    }

    try {
        const taskBacklog = backlog.tareas.find((tarea) => tarea._id.equals(id))
        if (!taskBacklog) {
            res.status(404).json(
                {
                    message: "La tarea no se encontro"
                }
            )
        }
        res.status(200).json(taskBacklog)

    } catch (error) {
        res.status(500).json({
            message: `Ocurrio un error al mostrar la tarea del backlog: ${error.message}`
        })
    }
}

const postCreateTaskBacklogController = async (req, res) => {

    // const { id } = req.params;

    try {
        let task = req.body;

        if (task) {

            const newTask = new Task(task);

            newTask.save().then((task) => {
                const backlog = res.backlog;

                backlog.tareas.push(task)
                backlog.save()
                return res.json(task);

            }).catch(error => {
                res.status(400).json(
                    {
                        message: `Ocurrio un error al crear un objeto en el backlog: ${error.message}`
                    }
                )
            })
        }

    } catch (error) {
        res.status(400).json({
            message: `La tarea en el body no se encontro: ${error.message}`
        })
    }

}

const deleteTaskBacklogController = async (req, res) => {
    const { id } = req.params
    const backlog = res.backlog;
    if (backlog && id) {
        const index = backlog.tareas.findIndex((tarea) => tarea._id.equals(id));
        const [task_backlog] = backlog.tareas.splice(index, 1);

        console.log("task a eliminar: ", task_backlog)
        const task = await Task.findById(id);

        if (task) {
            await task.deleteOne({
                _id: task._id
            });
        }

        await backlog.save();
        res.status(200).json(
            {
                message: `Tarea ${task_backlog.titulo} Eliminada!`
            }
        )
    } else {
        res.status(404).json(
            {
                message: `No existe el backlog`
            }
        )
    }
}

const deleteBacklog = async (req, res) => {
    const backlog = res.backlog;

    await backlog.deleteOne()

    res.status(200).json({
        message: "Se elimino el backlog!!"
    })
}

module.exports = {
    ExistBacklog,
    getBacklogController,
    getTasksBacklogController,
    getTaskByIdBacklogController,
    postCreateTaskBacklogController,
    deleteTaskBacklogController,
    deleteBacklog
}