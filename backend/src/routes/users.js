import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

// ------------------------
// LISTAR UTILIZADORES (GESTOR)
// ------------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.tipo !== "Gestor") {
      return res.status(403).json({ error: "Apenas gestores podem listar utilizadores" });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nome: true,
        tipo: true
      }
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar utilizadores" });
  }
});

// ------------------------
// CRIAR NOVO UTILIZADOR (GESTOR)
// ------------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.tipo !== "Gestor") {
      return res.status(403).json({ error: "Apenas gestores podem criar utilizadores" });
    }

    const { username, password, nome, tipo } = req.body;

    const novoUser = await prisma.user.create({
      data: {
        username,
        password,
        nome,
        tipo
      }
    });

    res.json(novoUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar utilizador" });
  }
});

// ------------------------
// EDITAR UTILIZADOR (GESTOR)
// ------------------------
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.tipo !== "Gestor") {
      return res.status(403).json({ error: "Apenas gestores podem editar utilizadores" });
    }

    const { id } = req.params;
    const { nome, tipo } = req.body;

    const atualizado = await prisma.user.update({
      where: { id: Number(id) },
      data: { nome, tipo }
    });

    res.json(atualizado);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao editar utilizador" });
  }
});

// ------------------------
// APAGAR UTILIZADOR (GESTOR)
// ------------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.tipo !== "Gestor") {
      return res.status(403).json({ error: "Apenas gestores podem apagar utilizadores" });
    }

    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Utilizador apagado com sucesso" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao apagar utilizador" });
  }
});

export default router;
