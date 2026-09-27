const express = require("express");
const cors = require("cors");
const db = require("./database/database");

const app = express();
const PORT = 3001;

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// ROTA INICIAL
// ===============================
app.get("/", (req, res) => {
    res.json({
        mensagem: "EcoControl API está funcionando! 🌱",
        status: "online"
    });
});

// ===============================
// CADASTRAR EQUIPAMENTO
// ===============================
app.post("/equipamentos", (req, res) => {
    const {
        nome,
        potencia_w,
        quantidade,
        horas_por_dia,
        dias_por_mes
    } = req.body;

    // Verificar campos obrigatórios
    if (
        !nome ||
        potencia_w == null ||
        quantidade == null ||
        horas_por_dia == null ||
        dias_por_mes == null
    ) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios."
        });
    }

    const sql = `
        INSERT INTO equipamentos
        (nome, potencia_w, quantidade, horas_por_dia, dias_por_mes)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            nome,
            potencia_w,
            quantidade,
            horas_por_dia,
            dias_por_mes
        ],
        function (err) {
            if (err) {
                console.error(
                    "Erro ao cadastrar equipamento:",
                    err.message
                );

                return res.status(500).json({
                    erro: "Erro ao cadastrar equipamento."
                });
            }

            res.status(201).json({
                mensagem: "Equipamento cadastrado com sucesso! ✅",
                id: this.lastID
            });
        }
    );
});

// ===============================
// LISTAR EQUIPAMENTOS
// ===============================
app.get("/equipamentos", (req, res) => {
    const sql = `
        SELECT *
        FROM equipamentos
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(
                "Erro ao buscar equipamentos:",
                err.message
            );

            return res.status(500).json({
                erro: "Erro ao buscar equipamentos."
            });
        }

        // Calcular consumo mensal
        const equipamentos = rows.map((equipamento) => {
            const consumoKwh =
                (
                    equipamento.potencia_w *
                    equipamento.quantidade *
                    equipamento.horas_por_dia *
                    equipamento.dias_por_mes
                ) / 1000;

            return {
                ...equipamento,
                consumo_mensal_kwh: Number(
                    consumoKwh.toFixed(2)
                )
            };
        });

        res.json(equipamentos);
    });
});
// ===============================
// EDITAR EQUIPAMENTO
// ===============================
app.put("/equipamentos/:id", (req, res) => {
    const { id } = req.params;

    const {
        nome,
        potencia_w,
        quantidade,
        horas_por_dia,
        dias_por_mes
    } = req.body;

    if (
        !nome ||
        potencia_w == null ||
        quantidade == null ||
        horas_por_dia == null ||
        dias_por_mes == null
    ) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios."
        });
    }

    const sql = `
        UPDATE equipamentos
        SET
            nome = ?,
            potencia_w = ?,
            quantidade = ?,
            horas_por_dia = ?,
            dias_por_mes = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [
            nome,
            potencia_w,
            quantidade,
            horas_por_dia,
            dias_por_mes,
            id
        ],
        function (err) {
            if (err) {
                console.error(
                    "Erro ao editar equipamento:",
                    err.message
                );

                return res.status(500).json({
                    erro: "Erro ao editar equipamento."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    erro: "Equipamento não encontrado."
                });
            }

            res.json({
                mensagem: "Equipamento atualizado com sucesso! ✅"
            });
        }
    );
});

// ===============================
// EXCLUIR EQUIPAMENTO
// ===============================
app.delete("/equipamentos/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM equipamentos
        WHERE id = ?
    `;

    db.run(sql, [id], function (err) {
        if (err) {
            console.error(
                "Erro ao excluir equipamento:",
                err.message
            );

            return res.status(500).json({
                erro: "Erro ao excluir equipamento."
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                erro: "Equipamento não encontrado."
            });
        }

        res.json({
            mensagem: "Equipamento excluído com sucesso! 🗑️"
        });
    });
});
// ===============================
// REGISTRAR CONSUMO DE PAPEL
// ===============================
app.post("/papel", (req, res) => {
    const {
        mes,
        impressoes,
        frente_verso
    } = req.body;

    if (
        !mes ||
        impressoes == null ||
        frente_verso == null
    ) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios."
        });
    }

    const sql = `
        INSERT INTO consumo_papel
        (mes, impressoes, frente_verso)
        VALUES (?, ?, ?)
    `;

    db.run(
        sql,
        [mes, impressoes, frente_verso],
        function (err) {
            if (err) {
                console.error(
                    "Erro ao registrar consumo de papel:",
                    err.message
                );

                return res.status(500).json({
                    erro: "Erro ao registrar consumo de papel."
                });
            }

            res.status(201).json({
                mensagem: "Consumo de papel registrado com sucesso! ✅",
                id: this.lastID
            });
        }
    );
});

// ===============================
// LISTAR CONSUMO DE PAPEL
// ===============================
app.get("/papel", (req, res) => {
    const sql = `
        SELECT *
        FROM consumo_papel
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(
                "Erro ao buscar consumo de papel:",
                err.message
            );

            return res.status(500).json({
                erro: "Erro ao buscar consumo de papel."
            });
        }

        res.json(rows);
    });
});

// ===============================
// REGISTRAR RESÍDUO
// ===============================
app.post("/residuos", (req, res) => {
    const {
        mes,
        material,
        quantidade_kg,
        destino
    } = req.body;

    if (
        !mes ||
        !material ||
        quantidade_kg == null ||
        !destino
    ) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios."
        });
    }

    const sql = `
        INSERT INTO residuos
        (mes, material, quantidade_kg, destino)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [mes, material, quantidade_kg, destino],
        function (err) {
            if (err) {
                console.error(
                    "Erro ao registrar resíduo:",
                    err.message
                );

                return res.status(500).json({
                    erro: "Erro ao registrar resíduo."
                });
            }

            res.status(201).json({
                mensagem: "Resíduo registrado com sucesso! ✅",
                id: this.lastID
            });
        }
    );
});

// ===============================
// LISTAR RESÍDUOS
// ===============================
app.get("/residuos", (req, res) => {
    const sql = `
        SELECT *
        FROM residuos
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(
                "Erro ao buscar resíduos:",
                err.message
            );

            return res.status(500).json({
                erro: "Erro ao buscar resíduos."
            });
        }

        res.json(rows);
    });
});
// ===============================
// REGISTRAR CONSUMO DE ÁGUA
// ===============================

app.post("/agua", (req, res) => {
    const {
        mes,
        lavagens,
        litros_por_lavagem
    } = req.body;

    if (
        !mes ||
        lavagens == null ||
        litros_por_lavagem == null
    ) {
        return res.status(400).json({
            erro: "Todos os campos são obrigatórios."
        });
    }

    const consumoTotal =
        Number(lavagens) * Number(litros_por_lavagem);

    const sql = `
        INSERT INTO consumo_agua
        (mes, lavagens, litros_por_lavagem, consumo_total_litros)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            mes,
            Number(lavagens),
            Number(litros_por_lavagem),
            Number(consumoTotal.toFixed(2))
        ],
        function (err) {
            if (err) {
                console.error(
                    "Erro ao registrar consumo de água:",
                    err.message
                );

                return res.status(500).json({
                    erro: "Erro ao registrar consumo de água."
                });
            }

            res.status(201).json({
                mensagem: "Consumo de água registrado com sucesso! ✅",
                id: this.lastID,
                consumo_total_litros: Number(
                    consumoTotal.toFixed(2)
                )
            });
        }
    );
});

// ===============================
// LISTAR CONSUMO DE ÁGUA
// ===============================

app.get("/agua", (req, res) => {
    const sql = `
        SELECT *
        FROM consumo_agua
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(
                "Erro ao buscar consumo de água:",
                err.message
            );

            return res.status(500).json({
                erro: "Erro ao buscar consumo de água."
            });
        }

        res.json(rows);
    });
});
// ===============================
// INICIAR SERVIDOR
// ===============================
app.listen(PORT, () => {
    console.log(
        `EcoControl rodando em http://localhost:${PORT}`
    );
});