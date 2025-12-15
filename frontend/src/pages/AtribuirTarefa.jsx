import { useEffect, useState } from "react";
import api from "../api";

export default function AtribuirTarefa() {
  const [tarefas, setTarefas] = useState([]);
  const [programadores, setProgramadores] = useState([]);
  const [tarefaId, setTarefaId] = useState("");
  const [programadorId, setProgramadorId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem("token");

    try {
      const t = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTarefas(t.data);

      const u = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgramadores(u.data.filter(u => u.tipo === "Programador"));

    } catch (err) {
      console.error(err);
      alert("Erro ao carregar dados");
    }
  };

  const atribuir = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await api.patch(`/tasks/${tarefaId}`, 
        { programadorId: Number(programadorId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Tarefa atribuída com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atribuir tarefa");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Atribuir Tarefa ao Programador</h1>

      <form onSubmit={atribuir}>
        <label>Tarefa:</label><br/>
        <select value={tarefaId} onChange={e => setTarefaId(e.target.value)}>
          <option value="">Escolha...</option>
          {tarefas.map(t => (
            <option key={t.id} value={t.id}>
              {t.descricao}
            </option>
          ))}
        </select>
        <br/><br/>

        <label>Programador:</label><br/>
        <select value={programadorId} onChange={e => setProgramadorId(e.target.value)}>
          <option value="">Escolha...</option>
          {programadores.map(p => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
        <br/><br/>

        <button type="submit">Atribuir</button>
      </form>
    </div>
  );
}
