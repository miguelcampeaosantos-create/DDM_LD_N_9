import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import tiposRoutes from "./routes/tipos.js";
import usersRoutes from "./routes/users.js";
import relatoriosRoutes from "./routes/relatorios.js";
import taskTypesRoutes from "./routes/taskTypesRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

// Rota de teste
app.get("/", (req, res) => {
  res.send("API do projeto DDM_LD_N_9 está a funcionar!");
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/tipos", tiposRoutes);
app.use("/users", usersRoutes);
app.use("/relatorios", relatoriosRoutes);
app.use("/task-types", taskTypesRoutes);
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
