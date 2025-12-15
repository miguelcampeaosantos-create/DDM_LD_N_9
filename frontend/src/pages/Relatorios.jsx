import { useEffect, useState } from "react";
import api from "../api";

export default function Relatorios() {
  const [dados, setDados] = useState(null);

  const carregar = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/relatorios/geral", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDados(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar relatório");
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const exportarCSV = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/relatorios/csv", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert("Erro ao gerar CSV");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio.csv";
    a.click();
  };

  if (!dados) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        <h2>Carregando relatório...</h2>
      </div>
    );
  }

  return (
    <div style={{
      background: "#1f1f1f",
      minHeight: "100vh",
      padding: 30,
      color: "white",
      fontFamily: "Arial"
    }}>
      <h1>Relatórios</h1>

      <div style={{
        background: "#2b2b2b",
        padding: 20,
        borderRadius: 10,
        width: "400px"
      }}>
        <h3>Total de tarefas: {dados.totalTarefas}</h3>
        <p>ToDo: {dados.ToDo}</p>
        <p>Doing: {dados.Doing}</p>
        <p>Done: {dados.Done}</p>

        <h3 style={{ marginTop: 20 }}>
          Story Points concluídos: {dados.storyPointsDone}
        </h3>

        <button
          onClick={exportarCSV}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          Exportar CSV
        </button>
      </div>
    </div>
  );
}
