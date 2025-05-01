const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { config } = require("dotenv");
const cors = require("cors")

config(); // Carga las variables de entorno

// Configuración de CORS: Permitir solicitudes de cualquier origen (también puedes limitarlo a un dominio específico)
const corsOptions = {
  origin: "http://localhost:5173",  // Reemplaza esto con el dominio correcto si es necesario
  methods: "GET,POST,PUT,DELETE",  // Métodos permitidos
  allowedHeaders: "Content-Type,Authorization",  // Cabeceras permitidas
};

const taskRouters = require("./routes/tasks.routes");
const springRouters = require("./routes/sprint.routes");
const backlogRouters = require("./routes/backlog.routes");

// 

// app express
const app = express();
app.use(bodyParser.json());

// coneccion con cors para usar en el front
app.use(cors(corsOptions)) 

// Conexión con MongoDB Atlas
mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.MONGO_BD_NAME,
  })
    .then(() => console.log("✅ Conectado a Mongo Atlas"))
    .catch((err) => console.error("❌ Error conectando a MongoDB: ", err));

const db = mongoose.connection;

// Rutas
app.use("/tasks", taskRouters);
app.use("/springs", springRouters);
app.use("/backlog", backlogRouters);

// Puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${port}`);
});
