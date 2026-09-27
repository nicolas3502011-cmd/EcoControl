const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Caminho fixo do banco (sempre em backend/ecocontrol.db)
// Assim funciona mesmo se o Node for iniciado de outra pasta
const dbPath = path.join(__dirname, "../../ecocontrol.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err.message);
    } else {
        console.log("Banco de dados conectado:", dbPath);
        console.log("Banco de dados conectado com sucesso! ✅");
    }
});

db.serialize(() => {

    // =========================================
    // TABELA DE EQUIPAMENTOS
    // =========================================

    db.run(`
        CREATE TABLE IF NOT EXISTS equipamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            potencia_w REAL NOT NULL,
            quantidade INTEGER NOT NULL,
            horas_por_dia REAL NOT NULL,
            dias_por_mes INTEGER NOT NULL
        )
    `);

    // =========================================
    // TABELA DE CONSUMO DE ENERGIA
    // (reservada — ainda não usada nas rotas)
    // =========================================

    db.run(`
        CREATE TABLE IF NOT EXISTS consumo_energia (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equipamento_id INTEGER NOT NULL,
            mes TEXT NOT NULL,
            consumo_kwh REAL NOT NULL,
            FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id)
        )
    `);

    // =========================================
    // TABELA DE CONSUMO DE PAPEL
    // =========================================

    db.run(`
        CREATE TABLE IF NOT EXISTS consumo_papel (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mes TEXT NOT NULL,
            impressoes INTEGER NOT NULL,
            frente_verso INTEGER NOT NULL
        )
    `);

    // =========================================
    // TABELA DE RESÍDUOS
    // =========================================

    db.run(`
        CREATE TABLE IF NOT EXISTS residuos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mes TEXT NOT NULL,
            material TEXT NOT NULL,
            quantidade_kg REAL NOT NULL,
            destino TEXT NOT NULL
        )
    `);

    // =========================================
    // TABELA DE CONSUMO DE ÁGUA
    // =========================================

    db.run(`
        CREATE TABLE IF NOT EXISTS consumo_agua (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mes TEXT NOT NULL,
            lavagens INTEGER NOT NULL,
            litros_por_lavagem REAL NOT NULL,
            consumo_total_litros REAL NOT NULL
        )
    `);

    console.log("Tabelas verificadas/criadas com sucesso! ✅");
});

module.exports = db;
