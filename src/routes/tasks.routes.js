const express = require("express");
const router = express.Router();

const {
    getTaskById,
    getAllTaskController,
    postCreateTaskController,
    putUpdateTaskController,
    patchTaskController,
    EliminarTarea,
    deleteTaskController
} = require("../controllers/taskController")

// mostrar todas las tareas
router.get("/", getAllTaskController);

// mostrar una tarea por id
router.get("/:id", getTaskById, async (req, res) => {
    res.json(res.task)
});

// crear una tarea
router.post("/", postCreateTaskController);

// editar una tarea
router.put("/:id", getTaskById, putUpdateTaskController);

// editar un atributo de una tarea
router.patch("/:id", getTaskById, patchTaskController);

// eliminar una tarea
router.delete("/:id", getTaskById, EliminarTarea, deleteTaskController);


module.exports = router