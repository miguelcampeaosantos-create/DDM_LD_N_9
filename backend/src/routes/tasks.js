import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();


// ------------------------
// LISTAR TAREFAS
// ------------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tarefas = await prisma.task.findMany({
      include: {
        tipoTarefa: true,
        gestor: true,
        programador: true
      },
      orderBy: { ordem: "asc" }
    });

    res.json(tarefas);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar tarefas" });
  }
});


// ------------------------
// CRIAR TAREFA (GESTOR)
// ------------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.tipo !== "Gestor") {
      return res.status(403).json({ error: "Apenas gestores podem criar tarefas" });
    }

    const {
      descricao,
      tipoTarefaId,
      programadorId,
      ordem,
      storyPoints,
      dataPrevistaInicio,
      dataPrevistaFim
    } = req.body;

    const nova = await prisma.task.create({
      data: {
        descricao,
        tipoTarefaId,
        programadorId,
        gestorId: req.user.id,
        ordem,
        storyPoints,
        estado: "ToDo",
        dataPrevistaInicio,
        dataPrevistaFim
      }
    });

    res.json(nova);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
});

// ------------------------
// MOVER TAREFA
// ------------------------
router.patch("/:id/move", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { novoEstado } = req.body;

    const estadosValidos = ["ToDo", "Doing", "Done"];

    if (!estadosValidos.includes(novoEstado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const tarefa = await prisma.task.findUnique({
      where: { id: Number(id) }
    });

    if (!tarefa) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    // ------------------------
    // DONE é imutável
    // ------------------------
    if (tarefa.estado === "Done") {
      return res.status(400).json({
        error: "Tarefas em Done não podem voltar para outro estado"
      });
    }

    // ------------------------
    // Programador só move tarefas dele
    // ------------------------
    if (req.user.tipo === "Programador") {
      if (tarefa.programadorId !== req.user.id) {
        return res.status(403).json({
          error: "Programador só pode mover as suas próprias tarefas"
        });
      }
    }

    // ------------------------
    // WIP = máximo 2 tarefas em Doing
    // ------------------------
    if (novoEstado === "Doing") {
      const doingCount = await prisma.task.count({
        where: {
          programadorId: tarefa.programadorId,
          estado: "Doing"
        }
      });

      if (doingCount >= 2) {
        return res.status(400).json({
          error: "Limite WIP atingido (máximo 2 tarefas em Doing)"
        });
      }
    }

    // ------------------------
    // Ordem obrigatória
    // Só pode fazer tarefa N se N-1 estiver DONE
    // ------------------------
    if (novoEstado === "Doing" || novoEstado === "Done") {
      if (tarefa.ordem > 1) {
        const tarefaAnterior = await prisma.task.findFirst({
          where: {
            programadorId: tarefa.programadorId,
            ordem: tarefa.ordem - 1
          }
        });

        if (tarefaAnterior && tarefaAnterior.estado !== "Done") {
          return res.status(400).json({
            error: `Tarefa ${tarefa.ordem - 1} ainda não está Done`
          });
        }
      }
    }

    // ------------------------
    // Atualizar datas reais
    // ------------------------
    let dataRealInicio = tarefa.dataRealInicio;
    let dataRealFim = tarefa.dataRealFim;

    if (novoEstado === "Doing" && !dataRealInicio) {
      dataRealInicio = new Date();
    }

    if (novoEstado === "Done" && !dataRealFim) {
      dataRealFim = new Date();
    }

    // ------------------------
    // Aplicar atualização
    // ------------------------
    const atualizada = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        estado: novoEstado,
        dataRealInicio,
        dataRealFim
      }
    });

    res.json(atualizada);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao mover tarefa" });
  }
});

// ------------------------
// ATUALIZAR TAREFA 
// ------------------------
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    // apenas gestores podem editar livremente; programadores não (opcional)
    if (req.user.tipo !== "Gestor") {
      return res.status(403).json({ error: "Apenas gestores podem editar tarefas" });
    }

    const { id } = req.params;
    const {
      descricao,
      tipoTarefaId,
      programadorId,
      ordem,
      storyPoints,
      dataPrevistaInicio,
      dataPrevistaFim
    } = req.body;

    // monta objecto data dinamicamente
    const data = {};
    if (descricao !== undefined) data.descricao = descricao;
    if (tipoTarefaId !== undefined) data.tipoTarefaId = tipoTarefaId;
    if (programadorId !== undefined) data.programadorId = programadorId;
    if (ordem !== undefined) data.ordem = ordem;
    if (storyPoints !== undefined) data.storyPoints = storyPoints;
    if (dataPrevistaInicio !== undefined) data.dataPrevistaInicio = dataPrevistaInicio;
    if (dataPrevistaFim !== undefined) data.dataPrevistaFim = dataPrevistaFim;

    const atualizado = await prisma.task.update({
      where: { id: Number(id) },
      data
    });

    res.json(atualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
});

// ------------------------
// DELETE TAREFA (APENAS GESTOR)
// ------------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.tipo !== "Gestor") {
      return res.status(403).json({ error: "Apenas gestores podem apagar tarefas" });
    }

    const { id } = req.params;

    await prisma.task.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Tarefa apagada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao apagar tarefa" });
  }
});

export default router;
