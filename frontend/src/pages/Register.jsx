// src/pages/Register.jsx
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("Programador"); // padrão
  const [erro, setErro] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      // Usar /auth/register (rota pública) para criar um utilizador
      const res = await api.post("/auth/register", {
        username,
        password,
        nome,
        tipo
      });

      alert("Utilizador registado com sucesso!");
      // opcional: redirecionar para login
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErro(err?.response?.data?.error || "Erro ao registar.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "#1e1e1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "#2b2b2b",
          padding: "30px",
          borderRadius: "12px",
          width: "380px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 12 }}>Registar</h2>

        {erro && (
          <p style={{ color: "salmon", textAlign: "center", marginBottom: 8 }}>
            {erro}
          </p>
        )}

        <form onSubmit={handleRegister}>
          <label>Nome</label>
          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              margin: "6px 0 12px 0",
              borderRadius: 6,
              border: "1px solid #555",
              background: "#1e1e1e",
              color: "#fff",
            }}
          />

          <label>Username</label>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              margin: "6px 0 12px 0",
              borderRadius: 6,
              border: "1px solid #555",
              background: "#1e1e1e",
              color: "#fff",
            }}
          />

          <label>Password</label>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              margin: "6px 0 14px 0",
              borderRadius: 6,
              border: "1px solid #555",
              background: "#1e1e1e",
              color: "#fff",
            }}
          />

          <label>Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              margin: "6px 0 18px 0",
              borderRadius: 6,
              border: "1px solid #555",
              background: "#1e1e1e",
              color: "#fff",
            }}
          >
            <option value="Gestor">Gestor</option>
            <option value="Programador">Programador</option>
          </select>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              background: "#4CAF50",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Registar
          </button>
        </form>
      </div>
    </div>
  );
}
