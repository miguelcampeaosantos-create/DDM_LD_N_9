import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

// Listar tipos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tipos = await prisma.tipoTarefa.findMany();
    res.json(tipos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar tipos" });
  }
});

// Criar tipo
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.tipo !== "Gestor") {
    return res.status(403).json({ error: "Apenas gestores podem criar tipos" });
  }

  const { nome } = req.body;

  try {
    const novo = await prisma.tipoTarefa.create({
      data: { nome }
    });

    res.json(novo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar tipo" });
  }
});

// Atualizar
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  try {
    const atualizado = await prisma.tipoTarefa.update({
      where: { id: Number(id) },
      data: { nome }
    });

    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar tipo" });
  }
});

// Apagar
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.tipoTarefa.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Tipo apagado" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao apagar tipo" });
  }
});

export default router;
