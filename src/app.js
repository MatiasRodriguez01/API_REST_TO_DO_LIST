const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const { config } = require("dotenv");

config();

// ruta de task
const taskRouters = require("./routes/tasks.routes")

// corremos el app express
const app = express();
app.use(bodyParser.json())

// corremos la base de datos
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_BD_NAME })
    .then(() => console.log("Conectando a mongo"))
    .catch((err) => console.error("Error conectando a MongoDB: ", err))

const db = mongoose.connection;

app.use("/tasks", taskRouters) 


// usamos el puerto de las variale de entorno
const port = process.env.PORT;

// escuchamos el puerto
app.listen(port, () => {
    console.log(`Escuchando el puerto: ${port}`)
})
