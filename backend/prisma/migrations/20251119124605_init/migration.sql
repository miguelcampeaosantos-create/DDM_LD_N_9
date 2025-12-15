-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nivel" TEXT,
    "departamento" TEXT,
    "gestorId" INTEGER
);

-- CreateTable
CREATE TABLE "TipoTarefa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT
);

-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "tipoTarefaId" INTEGER,
    "gestorId" INTEGER NOT NULL,
    "programadorId" INTEGER,
    "ordem" INTEGER NOT NULL,
    "storyPoints" INTEGER NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'ToDo',
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPrevistaInicio" DATETIME,
    "dataPrevistaFim" DATETIME,
    "dataRealInicio" DATETIME,
    "dataRealFim" DATETIME,
    CONSTRAINT "Task_tipoTarefaId_fkey" FOREIGN KEY ("tipoTarefaId") REFERENCES "TipoTarefa" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_programadorId_fkey" FOREIGN KEY ("programadorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
