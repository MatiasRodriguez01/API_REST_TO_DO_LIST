const express = require("express");
const router = express.Router(); 

const { deleteTaskController } = require('../controllers/taskController')

const {
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
} = require("../controllers/sprintController")

// mostrar las spring
router.get("/", getAllSpringController)

// mostrar una spring por Id
router.get("/:id", getSpring, async (req, res) => {
    res.json(res.spring)
})

// Crear una spring
router.post("/", postSpringController);

// Editar una spring
router.put("/:id", getSpring, putSpringController);

// Editar un atributo de una spring
router.patch("/:id", getSpring, patchSpringController);

// Eliminar una spring
router.delete("/:id", getSpring, deletePatchController);

// Rutas de las tareas de una spring especificas
// Mostrar las tareas de la spring
router.get("/:id/tasks", getSpring, getTaskSpringController);

// mostrar una tarea de una spring por id
router.get("/:id/get-task/:taskId", getSpring, getTaskByIdSpringController);

// crear un tarea de una spring por id 
router.put("/:id/add-task", getSpring, createTaskSpringController);

// editar tarea de una spring por id
router.put("/:id/update-task/:taskId", getSpring, updateTaskSpringController);

// eliminar una tarea de una spring por id
router.delete("/:id/delete-task/:taskId", getSpring, deleteTaskSpringController);

module.exports = router