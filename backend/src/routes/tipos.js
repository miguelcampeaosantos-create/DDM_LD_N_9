import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

// Listar tipos
router.get("/", authMiddleware, async (req, res) => {
  const tipos = await prisma.tipoTarefa.findMany();
  res.json(tipos);
});

// Criar tipo
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.tipo !== "Gestor") {
    return res.status(403).json({ error: "Apenas gestores podem criar tipos" });
  }

  const { nome } = req.body;

  const novo = await prisma.tipoTarefa.create({
    data: { nome }
  });

  res.json(novo);
});

// Atualizar tipo
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  const atualizado = await prisma.tipoTarefa.update({
    where: { id: Number(id) },
    data: { nome }
  });

  res.json(atualizado);
});

// Apagar tipo
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  await prisma.tipoTarefa.delete({
    where: { id: Number(id) }
  });

  res.json({ message: "Tipo apagado" });
});

export default router;
