import React, { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false);

  // BUSCAR TAREFAS COM TOKEN CORRETO
  const fetchTarefas = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTarefas(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  // Chama a função ao carregar a página
  useEffect(() => {
    fetchTarefas();
  }, []);

  // MOVER TAREFA COM TOKEN
  const moveTask = async (id, novoEstado) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.patch(
        `/tasks/${id}/move`,
        { novoEstado },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // atualizar estado sem refetch total
      setTarefas((prev) => prev.map(t => t.id === id ? res.data : t));

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Erro ao mover tarefa");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard</h1>
        <div>
          <button onClick={fetchTarefas}>Atualizar</button>{" "}
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {loading && <p>Carregando...</p>}

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        {["ToDo", "Doing", "Done"].map((col) => (
          <div
            key={col}
            style={{
              flex: 1,
              background: col === "ToDo" ? "#eee" : col === "Doing" ? "#ffd" : "#dfd",
              padding: 10
            }}
          >
            <h2>{col}</h2>

            {tarefas
              .filter(t => t.estado === col)
              .map(t => (
                <div
                  key={t.id}
                  style={{
                    background: "#fff",
                    margin: 10,
                    padding: 10,
                    borderRadius: 6
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <b>{t.descricao}</b>
                      <div style={{ fontSize: 12, color: "#444" }}>
                        Ordem: {t.ordem} • SP: {t.storyPoints}
                      </div>
                    </div>

                    {/* 🔥 Botões corretos */}
                    <div style={{ display: "flex", gap: 6 }}>
                      {t.estado === "ToDo" && (
                        <button onClick={() => moveTask(t.id, "Doing")}>Mover → Doing</button>
                      )}
                      {t.estado === "Doing" && (
                        <button onClick={() => moveTask(t.id, "Done")}>Mover → Done</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
