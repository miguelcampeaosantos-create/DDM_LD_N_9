import React, { useEffect, useState } from "react";
import api from "../api";

export default function TarefasProgramador() {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

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

  useEffect(() => {
    fetchTarefas();
  }, []);

  const moveTask = async (id, novoEstado) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.patch(
        `/tasks/${id}/move`,
        { novoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTarefas(prev => prev.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Erro ao mover tarefa");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div style={{ background: "#1f1f1f", minHeight: "100vh", padding: 30, color: "white" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "white" }}>Minhas Tarefas — Programador</h1>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={fetchTarefas}>Atualizar</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {loading && <p>Carregando...</p>}

      <div style={{
        display: "flex",
        gap: 20,
        marginTop: 30,
      }}>

        {[
          { col: "ToDo", cor: "#dcdcdc" },
          { col: "Doing", cor: "#fff8b1" },
          { col: "Done", cor: "#c6f7c6" }
        ].map(({ col, cor }) => (
          <div
            key={col}
            style={{
              flex: 1,
              background: cor,
              padding: 15,
              borderRadius: 8,
            }}
          >
            <h2 style={{ color: "#333" }}>{col}</h2>

            {tarefas
              .filter(t => t.estado === col)
              .map(t => (
                <div
                  key={t.id}
                  style={{
                    background: "#ffffff",
                    padding: 12,
                    marginBottom: 12,
                    borderRadius: 6
                  }}
                >
                  <b style={{ color: "#333" }}>{t.descricao}</b>
                  <div style={{ fontSize: 12, color: "#555" }}>
                    Ordem {t.ordem} — SP {t.storyPoints}
                  </div>

                  {/* Só pode mexer se for dele */}
                  {t.programadorId === user.id && (
                    <>
                      {t.estado === "ToDo" && (
                        <button onClick={() => moveTask(t.id, "Doing")}>→ Doing</button>
                      )}
                      {t.estado === "Doing" && (
                        <button onClick={() => moveTask(t.id, "Done")}>→ Done</button>
                      )}
                    </>
                  )}
                </div>
              ))}

          </div>
        ))}
      </div>

    </div>
  );
}
