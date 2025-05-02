const express = require("express");
const router = express.Router();

const {
    ExistBacklog,
    getBacklogController,
    getTasksBacklogController,
    getTaskByIdBacklogController,
    createTaskBacklogController,
    updateTaskBacklogController,
    deleteTaskBacklogController,
    deleteBacklog
} = require("../controllers/backlogController")

// mostrar el backlog
router.get("/", ExistBacklog, getBacklogController)

// mostrar las tareas del backlog
router.get("/tasks", ExistBacklog, getTasksBacklogController)

// mostrar una tarea por id de backlog
router.get("/task-backlog/:id", ExistBacklog, getTaskByIdBacklogController)

// crear una tarea por id de backlog
router.put("/create-task", ExistBacklog, createTaskBacklogController)

// editar una tarea por id de backlog
router.put("/update-task/:id", ExistBacklog, updateTaskBacklogController);

// eliminar una tarea por id de backlog
router.delete("/delete-task/:id", ExistBacklog, deleteTaskBacklogController)

// eliminar el backlog
router.delete("/", ExistBacklog, deleteBacklog)

module.exports = router