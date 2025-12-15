import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

// Middleware GLOBAL - só gestores podem aceder
router.use(authMiddleware, (req, res, next) => {
  if (req.user.tipo !== "Gestor") {
    return res.status(403).json({ error: "Apenas gestores podem ver relatórios" });
  }
  next();
});

// -----------------------------------------
//  RELATÓRIO SIMPLES (usado pelo frontend)
// -----------------------------------------
router.get("/geral", async (req, res) => {
  try {
    const total = await prisma.task.count();
    const todo = await prisma.task.count({ where: { estado: "ToDo" } });
    const doing = await prisma.task.count({ where: { estado: "Doing" } });
    const done = await prisma.task.count({ where: { estado: "Done" } });

    const storyPointsDone = await prisma.task.aggregate({
      where: { estado: "Done" },
      _sum: { storyPoints: true }
    });

    res.json({
      totalTarefas: total,
      ToDo: todo,
      Doing: doing,
      Done: done,
      storyPointsDone: storyPointsDone._sum.storyPoints || 0,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar relatório geral" });
  }
});

// -----------------------------------------
//  EXPORTAÇÃO CSV
// -----------------------------------------
router.get("/csv", async (req, res) => {
  try {
    const tarefas = await prisma.task.findMany({
      where: { estado: "Done", gestorId: req.user.id },
      include: { programador: true, tipoTarefa: true }
    });

    let csv = "Programador;Descricao;DataPrevistaInicio;DataPrevistaFim;TipoTarefa;DataRealInicio;DataRealFim\n";

    tarefas.forEach(t => {
      csv += `${t.programador?.nome || ""};${t.descricao};${t.dataPrevistaInicio || ""};${t.dataPrevistaFim || ""};${t.tipoTarefa?.nome || ""};${t.dataRealInicio || ""};${t.dataRealFim || ""}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio.csv");
    res.send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao exportar CSV" });
  }
});

export default router;
