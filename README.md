# 🚀 API de Gerenciamento de Eventos

Este projeto contém uma API completa para gerenciar eventos, atividades, participantes e suas inscrições. A seguir estão as instruções para configurar e rodar o projeto em um ambiente de desenvolvimento local.

## 🛠️ Como Rodar o Projeto Localmente

Siga os passos abaixo para ter a aplicação funcionando na sua máquina.

### Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:
- **[Node.js](https://nodejs.org/)**: Versão 20.x ou superior.
- **[Docker](https://www.docker.com/products/docker-desktop/)**: Para rodar o banco de dados PostgreSQL de forma isolada.
- **[Git](https://git-scm.com/)**: Para clonar o repositório.

### Passo 1: Clone o Repositório

Abra seu terminal e clone este projeto para sua máquina local.
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd projeto-eventos
```

### Passo 2: Instale as Dependências

Com o projeto clonado, instale todas as dependências necessárias usando o NPM.
```bash
npm install
```

### Passo 3: Suba o Banco de Dados com Docker

Para a aplicação funcionar, ela precisa de um banco de dados PostgreSQL. O comando abaixo irá criar e rodar um container Docker com uma instância do Postgres pronta para uso.

```bash
docker run --name postgres-dev -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```
- Este comando cria um banco chamado `postgres-dev` com a senha `docker` e o expõe na porta `5432` da sua máquina.

### Passo 4: Configure as Variáveis de Ambiente

A aplicação usa um arquivo `.env` para guardar a string de conexão com o banco de dados.

1. Crie um arquivo chamado `.env` na raiz do projeto.
2. Adicione o seguinte conteúdo a ele:

```env
# .env
DATABASE_URL="postgresql://postgres:docker@localhost:5432/mydb?schema=public"
```
- `postgres`: É o usuário padrão do PostgreSQL.
- `docker`: Foi a senha que definimos no passo anterior.
- `localhost:5432`: Endereço do nosso banco de dados.
- `mydb`: Nome do banco de dados que será usado.

### Passo 5: Aplique as Migrações do Banco

Com o banco de dados rodando e a conexão configurada, use o Prisma para criar a estrutura de tabelas.

```bash
npx prisma migrate dev
```
- Este comando irá ler o arquivo `prisma/schema.prisma`, criar as tabelas no banco de dados e gerar o Prisma Client atualizado.

### Passo 6: Inicie a Aplicação

Finalmente, inicie o servidor de desenvolvimento.

```bash
npm run start:dev
```

O terminal irá indicar que a aplicação foi iniciada com sucesso. Por padrão, ela estará rodando em `http://localhost:3000`. O modo de desenvolvimento (`--watch`) reiniciará o servidor automaticamente sempre que você salvar uma alteração nos arquivos.

---

## 🔬 Ferramentas de Desenvolvimento

### Prisma Studio

Este projeto vem com o Prisma, que inclui uma ferramenta visual incrível chamada **Prisma Studio**. Ela permite visualizar e editar os dados do seu banco de dados diretamente pelo navegador.

Para iniciá-la, rode o seguinte comando em um novo terminal (você pode deixar a aplicação rodando em outro):

```bash
npx prisma studio
```
- Uma nova aba será aberta em `http://localhost:5555`, onde você poderá gerenciar suas tabelas (`Evento`, `Atividade`, etc.) de forma interativa.

---

## 📖 Documentação da API

Esta é a documentação para a API de gerenciamento de eventos, atividades e participantes.

**URL Base:** `http://localhost:3000`

---

## 🗓️ Eventos (`/evento`)

#### `POST /evento`
Cria um novo evento.

**Body (raw/json):**
```json
{
  "titulo": "Seminário de IA",
  "edicao": "2024",
  "tipo": "pago",
  "dataHoraInicio": "2024-10-20T09:00:00.000Z",
  "dataHoraFim": "2024-10-22T18:00:00.000Z",
  "taxa": 50.00
}
```
- `tipo` pode ser `"pago"` ou `"gratuito"`.
- `taxa` é obrigatório apenas se o tipo for `"pago"`.

---

#### `GET /evento`
Lista todos os eventos cadastrados.

---

#### `GET /evento/:id`
Busca um evento específico pelo seu `id`.
- **Exemplo:** `GET http://localhost:3000/evento/1`

---

#### `PATCH /evento/:id`
Atualiza os dados de um evento. Envie no corpo da requisição apenas os campos que deseja alterar.
- **Exemplo:** `PATCH http://localhost:3000/evento/1`
- **Body (raw/json):**
```json
{
  "titulo": "Novo Título do Seminário de IA"
}
```

---

#### `DELETE /evento/:id`
Exclui um evento pelo seu `id`.
- **Exemplo:** `DELETE http://localhost:3000/evento/1`

---

#### `GET /evento/:id/palestrantes`
Lista todos os palestrantes de um evento específico.
- **Exemplo:** `GET http://localhost:3000/evento/1/palestrantes`

---

#### `GET /evento/receita`
Retorna a receita total arrecadada para cada evento pago.

---

## 🏃 Atividades (`/atividade`)

#### `POST /atividade`
Cria uma nova atividade associada a um evento.

**Body (raw/json):**
```json
{
  "tipo": "palestra",
  "titulo": "Introdução ao NestJS",
  "dataHoraInicio": "2024-10-20T10:00:00.000Z",
  "dataHoraFim": "2024-10-20T12:00:00.000Z",
  "qntdMaximaOuvintes": 100,
  "fk_idEvento": 1
}
```
- `tipo` pode ser `"palestra"`, `"minicurso"` ou `"mesa redonda"`.
- `fk_idEvento` deve ser o `id` de um evento existente.

---

#### `GET /atividade`
Lista todas as atividades cadastradas.

---

#### `GET /atividade/:id`
Busca uma atividade específica pelo seu `id`.
- **Exemplo:** `GET http://localhost:3000/atividade/1`

---

#### `PATCH /atividade/:id`
Atualiza os dados de uma atividade.
- **Exemplo:** `PATCH http://localhost:3000/atividade/1`
- **Body (raw/json):**
```json
{
  "qntdMaximaOuvintes": 120
}
```

---

#### `DELETE /atividade/:id`
Exclui uma atividade pelo seu `id`.
- **Exemplo:** `DELETE http://localhost:3000/atividade/1`

---

## 🧑‍🤝‍🧑 Participantes (`/participante`)

#### `POST /participante`
Cria um novo participante.

**Body (raw/json):**
```json
{
  "nome": "João da Silva",
  "cpf": "123.456.789-00",
  "telefone": "71999998888",
  "email": "joao.silva@example.com",
  "dataDeNascimento": "1990-05-15T00:00:00.000Z"
}
```

---

#### `GET /participante`
Lista todos os participantes.

---

#### `GET /participante/:id`
Busca um participante pelo seu `id`.
- **Exemplo:** `GET http://localhost:3000/participante/1`

---

#### `PATCH /participante/:id`
Atualiza os dados de um participante.
- **Exemplo:** `PATCH http://localhost:3000/participante/1`
- **Body (raw/json):**
```json
{
  "telefone": "71988887777"
}
```

---

#### `DELETE /participante/:id`
Exclui um participante pelo seu `id`.
- **Exemplo:** `DELETE http://localhost:3000/participante/1`

---

#### `GET /participante/nascidos-em/:ano`
Lista todos os participantes nascidos em um determinado ano.
- **Exemplo:** `GET http://localhost:3000/participante/nascidos-em/1990`

---

## 🔗 Participações (`/participacao`)

#### `POST /participacao`
Registra a participação de uma pessoa em uma atividade.

**Body (raw/json):**
```json
{
  "tipo": "ouvinte",
  "fk_idParticipante": 1,
  "fk_idAtividade": 1
}
```
- `tipo` pode ser `"organizador"`, `"palestrante"`, `"mediador"`, `"monitor"` ou `"ouvinte"`.
- `fk_idParticipante` e `fk_idAtividade` devem ser `id`s existentes.

---

#### `GET /participacao`
Lista todas as participações registradas.

---

#### `GET /participacao/:id`
Busca uma participação pelo seu `id`.
- **Exemplo:** `GET http://localhost:3000/participacao/1`

---

#### `PATCH /participacao/:id`
Atualiza o tipo de uma participação.
- **Exemplo:** `PATCH http://localhost:3000/participacao/1`
- **Body (raw/json):**
```json
{
  "tipo": "monitor"
}
```

---

#### `DELETE /participacao/:id`
Exclui um registro de participação.
- **Exemplo:** `DELETE http://localhost:3000/participacao/1`

