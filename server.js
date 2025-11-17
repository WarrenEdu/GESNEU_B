const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const session = require("express-session");

const poNeumaticoRoutes = require("./routes/poNeumaticoRoutes");
const poSupervisoresRoutes = require("./routes/poSupervisorRoutes");
const padronRoutes = require("./routes/poPadron");
const poBuscarVehiculoRoutes = require("./routes/poBuscarVehiculoRoutes");
const poAsignadosRoutes = require("./routes/poAsignadosRoutes");
const poAsignarNeumaticoRoutes = require("./routes/poAsignarNeumaticoRoutes");
const poInicioSesionRoutes = require("./routes/poInicioSesionRoutes");
const poInspeccionRoutes = require("./routes/poInspeccionRoutes");
const porMovimientoRoutes = require("./routes/porMovimientoRoutes");
const poMantenimientoRoutes = require("./routes/poMantenimientoRoutes");
const poReporteRoutes = require("./routes/poReporteRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();
// CORS dinámico para devolver el origen correcto
const allowedOrigins = [
  "http://192.168.5.207:3000",
  "http://192.168.4.13:3000",
  "http://192.168.5.207:3001",
  "http://192.168.100.182:3000",
  "http://localhost:3000",
  null, // Para peticiones sin origin (opcional, para pruebas locales)
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (como Postman o curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Neumáticos TAIR",
      version: "1.0.0",
      description: "Documentación de la API para la gestión de neumáticos.",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configura express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Usar variable de entorno
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true si usas HTTPS
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// Rutas API
app.use("/api", poInicioSesionRoutes);
app.use("/api/po-neumaticos", poNeumaticoRoutes);
app.use("/api/po-asignados", poAsignadosRoutes);
app.use("/api/po-supervisores", poSupervisoresRoutes);
app.use("/api/po-padron", padronRoutes);
app.use("/api/vehiculo", poBuscarVehiculoRoutes);
app.use("/api/po-asignar-neumatico", poAsignarNeumaticoRoutes);
app.use("/api/inspeccion", poInspeccionRoutes);
app.use("/api/po-movimiento", porMovimientoRoutes);
app.use("/api", poMantenimientoRoutes);
app.use("/api/po-reportes", poReporteRoutes);

// Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`🟢 Servidor corriendo en http://0.0.0.0:${PORT}`);
  await db.connect();
});
