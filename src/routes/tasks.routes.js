const express = require("express");
const router = express.Router();

const { getAllTaskController, postCreateTaskController } = require("../controllers/taskController")

router.get("/", getAllTaskController)

router.post("/", postCreateTaskController)


module.exports = router