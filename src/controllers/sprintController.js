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
        spring = await Spring.findById(id).populate("tareas");
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
    const { nombre, fecha_inicio, fecha_cierre, tareas, color } = req.body;
    if (!fecha_inicio || !fecha_cierre) {
        return res.status(400).json({
            message: "Los parametros titulo, descripcion, estado y fecha limite son obligatorios"
        })
    }
    const newSpring = new Spring(
        {
            nombre,
            fecha_inicio,
            fecha_cierre,
            tareas,
            color
        }
    )

    try {
        const springSaved = await newSpring.save();
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
        spring.nombre = req.body.nombre || spring.nombre
        spring.fecha_inicio = req.body.fecha_inicio || spring.fecha_inicio;
        spring.fecha_cierre = req.body.fecha_cierre || spring.fecha_cierre;
        spring.color = req.body.color || spring.color;

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
        spring.nombre = req.body.nombre || spring.nombre
        spring.fecha_inicio = req.body.fecha_inicio || spring.fecha_inicio;
        spring.fecha_cierre = req.body.fecha_cierre || spring.fecha_cierre;
        spring.color = req.body.color || spring.color;

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

const createTaskSpringController = async (req, res) => {
    try {
      const spring = res.spring 
      const taskData = req.body;
  
      // Validación básica
      if (!taskData) {
        return res.status(400).json({
          message: "La tarea no existe"
        });
      }
  
      // Crear y guardar la nueva tarea
      const newTask = new Task(taskData);
      const taskSaved = await newTask.save();
  
      // Agregar su _id al array de tareas de la spring
      spring.tareas.push(taskSaved._id);
      await spring.save();
  
      res.json(taskSaved);
  
    } catch (error) {
      res.status(500).json({
        message: `Ocurrió un error en createTaskSpringController: ${error.message}`
      });
    }
  }
  

const updateTaskSpringController = async (req, res) => {
    try {
        const { taskId } = req.params;
        const spring = res.spring;

        if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: "El id de la tarea no es válido" });
        }

        // Buscar la tarea en la base de datos
        const task = await Task.findById(taskId);
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
        spring.tareas = spring.tareas.map((tarea) =>
            tarea._id.equals(taskId) ? task : tarea
        );

        await spring.save();

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({
            message: `Ocurrió un error en updateTaskSpringController: ${error.message}`
        });
    }
};


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
    createTaskSpringController,
    updateTaskSpringController,
    deleteTaskSpringController
}