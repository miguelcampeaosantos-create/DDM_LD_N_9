import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const res = await api.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.tipo === "Gestor") {
        navigate("/gestor/tarefas");
      } else {
        navigate("/programador/tarefas");
      }
    } catch (err) {
      setErro("Credenciais inválidas");
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
          padding: "40px",
          borderRadius: "12px",
          width: "350px",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Login</h2>

        {erro && (
          <p style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
            {erro}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              margin: "8px 0 15px 0",
              borderRadius: 6,
              border: "1px solid #555",
              background: "#1e1e1e",
              color: "#fff",
            }}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              margin: "8px 0 20px 0",
              borderRadius: 6,
              border: "1px solid #555",
              background: "#1e1e1e",
              color: "#fff",
            }}
          />

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
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
