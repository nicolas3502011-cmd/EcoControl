# EcoControl / BarberEco

Sistema de gestão de sustentabilidade para barbearia.

## Estrutura

```
EcoControl/
├── backend/
│   ├── ecocontrol.db          ← banco SQLite (dados salvos aqui)
│   ├── package.json
│   └── src/
│       ├── server.js          ← API Express (rotas)
│       └── database/
│           └── database.js    ← conexão + criação das tabelas
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx           ← entrada do React
        ├── App.jsx            ← interface (dashboard, forms, tabela)
        └── index.css          ← estilos
```

## Como rodar

### 1. Backend (API + banco)

```bash
cd backend
npm install
npm start
```

API em: http://localhost:3001

Teste no navegador: http://localhost:3001/equipamentos

### 2. Frontend (interface)

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (ex.: http://localhost:5173)

## Banco de dados

- Arquivo: `backend/ecocontrol.db`
- Conexão definida em `backend/src/database/database.js`
- Caminho fixo (não depende da pasta de onde você inicia o Node)

### Tabelas

| Tabela           | Uso atual                          |
|------------------|------------------------------------|
| equipamentos     | Cadastro + listagem (API ativa)    |
| consumo_papel    | Cadastro + listagem (API ativa)    |
| residuos         | Cadastro + listagem (API ativa)    |
| consumo_agua     | Cadastro + listagem (API ativa)    |
| consumo_energia  | Só existe no banco (ainda sem rota)|

## API atual (só criar e listar)

| Método | Rota            | Função              |
|--------|-----------------|---------------------|
| GET    | /               | Status da API       |
| POST   | /equipamentos   | Cadastrar           |
| GET    | /equipamentos   | Listar (+ kWh calc) |
| POST   | /papel          | Registrar papel     |
| GET    | /papel          | Listar papel        |
| POST   | /residuos       | Registrar resíduo   |
| GET    | /residuos       | Listar resíduos     |
| POST   | /agua           | Registrar água      |
| GET    | /agua           | Listar água         |

Ainda **não** existem rotas de editar (PUT) nem excluir (DELETE).

## Ligação frontend ↔ backend

No `frontend/src/App.jsx`:

```js
const API = "http://localhost:3001";
```

Todas as chamadas usam `fetch(`${API}/...`)`.
O backend precisa estar rodando para a tela mostrar e gravar dados.
