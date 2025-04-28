const express = require("express");
const router = express.Router(); 

const {
    ExistBacklog,
    getBacklogController,
    getTasksBacklogController,
    getTaskByIdBacklogController,
    postCreateTaskBacklogController,
    deleteTaskBacklogController,
    deleteBacklog
} = require("../controllers/backlogController")

router.get("/", ExistBacklog, getBacklogController)

router.get("/tasks", ExistBacklog, getTasksBacklogController)

router.get("/task-backlog/:id", ExistBacklog, getTaskByIdBacklogController)

router.post("/create-task", ExistBacklog, postCreateTaskBacklogController)

router.put("/delete-task/:id", ExistBacklog, deleteTaskBacklogController)

router.delete("/", ExistBacklog, deleteBacklog)

module.exports = router