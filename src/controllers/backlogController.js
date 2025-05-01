const Backlog = require("../modules/Backlog.model")
const Task = require("../modules/task.model")

const ExistBacklog = async (req, res, next) => {
    let backlog;

    try {
        backlog = await Backlog.findOne();

        if (!backlog) {
            // Si no existe, crear uno y guardarlo en la DB
            backlog = new Backlog();
            await backlog.save();
        }

        res.backlog = backlog
        next();
    } catch (err) {
        return res.status(500).json(
            {
                message: err.message
            }
        )
    }

}

const getBacklogController = async (req, res) => {
    try {
        const backlog = res.backlog;

        if (!backlog) {
            res.status(200).json(
                {
                    message: "El backlog no existe"  // No hay backlog
                }
            );
        }

        res.status(200).json(backlog);
    } catch (error) {
        res.status(500).json({
            message: `Ocurrió un error en getBacklogController: ${error.message}`
        });
    }
}

const getTasksBacklogController = async (req, res) => {
    try {
        const backlog = res.backlog;
        const tasks = backlog.tareas;
        if (!tasks) {
            res.status(404).json(
                {
                    message: "Las tareas no existen"
                }
            )
        }
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

const createTaskBacklogController = async (req, res) => {

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


const updateTaskBacklogController = async (req, res) => {
    try {
        const { id } = req.params;
            const backlog = res.backlog;
        
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
              return res.status(404).json({ message: "El id de la tarea no es válido" });
            }
        
            // Buscar la tarea en la base de datos
            const task = await Task.findById(id);
            if (!task) {
              return res.status(404).json({ message: "La tarea no se encontró" });
            }
        
            // Actualizar sus campos
            task.titulo = req.body.titulo || task.titulo;
            task.descripcion = req.body.descripcion || task.descripcion;
            task.estado = req.body.estado || task.estado;
            task.fecha_limite = req.body.fecha_limite || task.fecha_limite;
            task.color = req.body.color || task.color;
        
            await task.save();
        
            // Actualizar la referencia en el spring
            backlog.tareas = backlog.tareas.map((tarea) =>
              tarea._id.equals(id) ? task : tarea
            );
        
            await backlog.save();
        
            return res.status(200).json(task);

    } catch (error) {
        return res.status(500).json(
            {
                message: `Ocurrio un error en updateTaskSpringController: ${error.message}`
            }
        )
    }
}

const deleteTaskBacklogController = async (req, res) => {
    const { id } = req.params
    const backlog = res.backlog;
    if (backlog && id) {
        const index = backlog.tareas.findIndex((tarea) => tarea._id.equals(id));
        const [task_backlog] = backlog.tareas.splice(index, 1);

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
    createTaskBacklogController,
    updateTaskBacklogController,
    deleteTaskBacklogController,
    deleteBacklog
}