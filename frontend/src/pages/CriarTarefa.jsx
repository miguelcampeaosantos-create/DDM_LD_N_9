import { useEffect, useState } from "react";
import api from "../api";

export default function CriarTarefa() {
  const [descricao, setDescricao] = useState("");
  const [ordem, setOrdem] = useState("");
  const [storyPoints, setStoryPoints] = useState("");
  const [tipoId, setTipoId] = useState("");
  const [tipos, setTipos] = useState([]);

  const token = localStorage.getItem("token");

  // Buscar tipos de tarefa
  const fetchTipos = async () => {
    try {
      const res = await api.get("/tipos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTipos(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar dados");
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const criarTarefa = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/tasks",
        {
          descricao,
          ordem: Number(ordem),
          storyPoints: Number(storyPoints),
          tipoTarefaId: Number(tipoId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Tarefa criada com sucesso!");
      window.location.href = "/gestor/tarefas";
    } catch (err) {
      console.error(err);
      alert("Erro ao criar tarefa");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Criar Tarefa</h1>

      <form onSubmit={criarTarefa} style={{ maxWidth: 400 }}>
        
        <label>Descrição:</label>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />

        <br /><br />

        <label>Ordem:</label>
        <input
          type="number"
          value={ordem}
          onChange={(e) => setOrdem(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />

        <br /><br />

        <label>Story Points:</label>
        <input
          type="number"
          value={storyPoints}
          onChange={(e) => setStoryPoints(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />

        <br /><br />

        <label>Tipo de Tarefa:</label>
        <select
          value={tipoId}
          onChange={(e) => setTipoId(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        >
          <option value="">Selecione...</option>

          {tipos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome}
            </option>
          ))}
        </select>

        <br /><br />

        <button type="submit" style={{ padding: 10 }}>
          Criar
        </button>
      </form>
    </div>
  );
}
