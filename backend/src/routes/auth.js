import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// ----------- REGISTER -----------
router.post("/register", async (req, res) => {
  try {
    const { username, password, nome, tipo, nivel, departamento, gestorId } = req.body;

    // Verificar se já existe username
    const existing = await prisma.user.findUnique({
      where: { username }
    });

    if (existing) {
      return res.status(400).json({ error: "Username já existe" });
    }

    // Hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar utilizador
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        nome,
        tipo,          // "Gestor" ou "Programador"
        nivel,
        departamento,
        gestorId
      }
    });

    res.json({ message: "Utilizador criado com sucesso", user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});


// ----------- LOGIN -----------

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Procurar utilizador
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    // Verificar password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        tipo: user.tipo,
        nome: user.nome
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login feito com sucesso!",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        tipo: user.tipo
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

export default router;
