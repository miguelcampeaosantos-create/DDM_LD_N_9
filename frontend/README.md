Sistema de Gestão de Tarefas — DDM_LD_N_9

Projeto desenvolvido no âmbito da Unidade Curricular Desenvolvimento de Sistemas de Informação, consistindo num sistema completo para gestão de tarefas, com:

Backend (Node.js + Express + Prisma + SQLite)

Frontend (React + Vite)

Autenticação JWT

Gestão de utilizadores (Gestor / Programador)

Kanban interativo

Atribuição de tarefas a programadores

Criação de tarefas

Movimentação de tarefas entre estados

Tecnologias Utilizadas
Backend

Node.js

Express.js

Prisma ORM

JWT (autenticação)

Bcrypt (hash de passwords)

SQLite (base de dados local)

Frontend

React

Vite

Axios

React Router DOM

Papéis do Sistema
Gestor

Criar tarefas

Atribuir tarefas a programadores

Criar tipos de tarefa

Consultar todas as tarefas

Mover tarefas (ToDo → Doing → Done)

Gerir equipa

Programador

Visualizar as SUAS próprias tarefas

Mover apenas as suas tarefas

Atualizar estados (ToDo → Doing → Done)

Estrutura do Projeto
backend/
 ├─ prisma/
 ├─ src/
 │   ├─ middleware/
 │   ├─ routes/
 │   │   ├─ auth.js
 │   │   ├─ users.js
 │   │   ├─ tasks.js
 │   │   ├─ tipos.js
 │   │   └─ relatorios.js
 │   └─ server.js
frontend/
 ├─ src/
 │   ├─ components/
 │   │   └─ ProtectRoute.jsx
 │   ├─ pages/
 │   │   ├─ Login.jsx
 │   │   ├─ CriarTarefa.jsx
 │   │   ├─ TarefasGestor.jsx
 │   │   ├─ TarefasProgramador.jsx
 │   │   ├─ Relatorios.jsx
 │   │   └─ ListaProgramadores.jsx
 │   ├─ api.js
 │   └─ App.jsx

Login de Teste
Gestor

username: gestor1

password: 123456

Programador

username: prog2

password: 123456

Como Executar
1. Backend
cd backend
npm install
npx prisma migrate dev
npm run dev


O servidor arranca em:

http://localhost:3000

2. Frontend
cd frontend
npm install
npm run dev


O frontend arranca em:

http://localhost:5173

📌 Funcionalidades Principais

✔ Login com JWT
✔ Painel de Gestor
✔ Painel de Programador
✔ Criação de tarefas
✔ Movimentação no Kanban
✔ Atribuição de tarefas a programadores
✔ Listagem de programadores
✔ Relatórios de produtividade
✔ Logout
✔ Autorização por tipo de utilizador

Testes Realizados

Teste de login

Criação de tarefas

Movimento entre estados

Restrições de permissões

Atribuição correta de tarefas

Comportamento do painel do programador

Autores

Miguel — nº 2024493
Projeto DDM_LD_N_9