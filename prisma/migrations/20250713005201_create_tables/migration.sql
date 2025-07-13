-- CreateTable
CREATE TABLE "evento" (
    "idEvento" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "dataHoraInicio" TIMESTAMP(3) NOT NULL,
    "dataHoraFim" TIMESTAMP(3) NOT NULL,
    "taxa" DOUBLE PRECISION,
    "edicao" TEXT,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("idEvento")
);

-- CreateTable
CREATE TABLE "atividade" (
    "idAtividade" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "dataHoraInicio" TIMESTAMP(3) NOT NULL,
    "dataHoraFim" TIMESTAMP(3) NOT NULL,
    "qntdMaximaOuvintes" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "fk_idEvento" INTEGER NOT NULL,

    CONSTRAINT "atividade_pkey" PRIMARY KEY ("idAtividade")
);

-- CreateTable
CREATE TABLE "participante" (
    "idParticipante" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dataDeNascimento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participante_pkey" PRIMARY KEY ("idParticipante")
);

-- CreateTable
CREATE TABLE "participacao" (
    "idParticipacao" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "fk_idParticipante" INTEGER NOT NULL,
    "fk_idAtividade" INTEGER NOT NULL,

    CONSTRAINT "participacao_pkey" PRIMARY KEY ("idParticipacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "participante_cpf_key" ON "participante"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "participante_email_key" ON "participante"("email");

-- CreateIndex
CREATE UNIQUE INDEX "participacao_fk_idParticipante_fk_idAtividade_key" ON "participacao"("fk_idParticipante", "fk_idAtividade");

-- AddForeignKey
ALTER TABLE "atividade" ADD CONSTRAINT "atividade_fk_idEvento_fkey" FOREIGN KEY ("fk_idEvento") REFERENCES "evento"("idEvento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacao" ADD CONSTRAINT "participacao_fk_idParticipante_fkey" FOREIGN KEY ("fk_idParticipante") REFERENCES "participante"("idParticipante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participacao" ADD CONSTRAINT "participacao_fk_idAtividade_fkey" FOREIGN KEY ("fk_idAtividade") REFERENCES "atividade"("idAtividade") ON DELETE RESTRICT ON UPDATE CASCADE;
