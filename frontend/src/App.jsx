import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TarefasGestor from "./pages/TarefasGestor";
import TarefasProgramador from "./pages/TarefasProgramador";
import CriarTarefa from "./pages/CriarTarefa";
import ProtectRoute from "./components/ProtectRoute";
import ListaProgramadores from "./pages/ListaProgramadores";
import AtribuirTarefa from "./pages/AtribuirTarefa";
import Relatorios from "./pages/Relatorios";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* GESTOR */}
        <Route
          path="/gestor/tarefas"
          element={
            <ProtectRoute>
              <TarefasGestor />
            </ProtectRoute>
          }
        />

        <Route
          path="/gestor/criar-tarefa"
          element={
            <ProtectRoute>
              <CriarTarefa />
            </ProtectRoute>
          }
        />

        {/* PROGRAMADOR */}
        <Route
          path="/programador/tarefas"
          element={
            <ProtectRoute>
              <TarefasProgramador />
            </ProtectRoute>
          }
        />

        <Route
  path="/programadores"
  element={
    <ProtectRoute>
      <ListaProgramadores />
    </ProtectRoute>
  }
/>

<Route
  path="/atribuir-tarefa"
  element={
    <ProtectRoute>
      <AtribuirTarefa />
    </ProtectRoute>
  }
/>

<Route
  path="/relatorios"
  element={
    <ProtectRoute>
      <Relatorios />
    </ProtectRoute>
  }
/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
