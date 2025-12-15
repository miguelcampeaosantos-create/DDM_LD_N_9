import { useEffect, useState } from "react";
import api from "../api";

export default function ListaProgramadores() {
  const [programadores, setProgramadores] = useState([]);

  const fetchProgramadores = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const apenasProgramadores = res.data.filter(u => u.tipo === "Programador");
      setProgramadores(apenasProgramadores);

    } catch (err) {
      console.error(err);
      alert("Erro ao carregar programadores");
    }
  };

  useEffect(() => {
    fetchProgramadores();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Lista de Programadores</h1>

      <ul>
        {programadores.map(p => (
          <li key={p.id}>
            {p.nome} — ({p.username})
          </li>
        ))}
      </ul>
    </div>
  );
}
