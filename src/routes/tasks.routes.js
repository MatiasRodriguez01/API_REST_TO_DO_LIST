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


router.get("/", getAllTaskController);

router.get("/:id", getTaskById, async (req, res) => {
    res.json(res.task)
});

router.post("/", postCreateTaskController);

router.put("/:id", getTaskById, putUpdateTaskController);

router.patch("/:id", getTaskById, patchTaskController);

router.delete("/:id", getTaskById, EliminarTarea, deleteTaskController);


module.exports = router