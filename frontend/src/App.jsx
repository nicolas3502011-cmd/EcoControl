import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import "./index.css";

const API ="https://ecocontrol-backend.onrender.com";
  function App() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [papel, setPapel] = useState([]);
  const [residuos, setResiduos] = useState([]);
  const [agua, setAgua] = useState([]);

  const [equipamentoEditando, setEquipamentoEditando] =
    useState(null);

  const [equipamentoForm, setEquipamentoForm] = useState({
    nome: "",
    potencia_w: "",
    quantidade: "",
    horas_por_dia: "",
    dias_por_mes: "",
  });

  const [papelForm, setPapelForm] = useState({
    mes: "Setembro/2026",
    impressoes: "",
    frente_verso: "",
  });

  const [residuoForm, setResiduoForm] = useState({
    mes: "Setembro/2026",
    material: "Papel",
    quantidade_kg: "",
    destino: "Reciclagem",
  });

  const [aguaForm, setAguaForm] = useState({
    mes: "Setembro/2026",
    lavagens: "",
    litros_por_lavagem: "",
  });

  const [mensagem, setMensagem] = useState("");

  // =========================================
  // CARREGAR DADOS
  // =========================================

  async function carregarDados() {
    try {
      const respostaEquipamentos = await fetch(
       `${API}/equipamentos`
      );

      const respostaPapel = await fetch(
       `${API}/papel`
      );

      const respostaResiduos = await fetch(
        `${API}/residuos`
      );

      const respostaAgua = await fetch(
        `${API}/agua`
      );

      const dadosEquipamentos =
        await respostaEquipamentos.json();

      const dadosPapel =
        await respostaPapel.json();

      const dadosResiduos =
        await respostaResiduos.json();

      const dadosAgua =
        await respostaAgua.json();

      setEquipamentos(dadosEquipamentos);
      setPapel(dadosPapel);
      setResiduos(dadosResiduos);
      setAgua(dadosAgua);
    } catch (erro) {
      console.error(
        "Erro ao carregar dados:",
        erro
      );

      setMensagem(
        "Não foi possível conectar ao servidor."
      );
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // =========================================
  // ALTERAR FORMULÁRIOS
  // =========================================

  function alterarEquipamento(e) {
    setEquipamentoForm({
      ...equipamentoForm,
      [e.target.name]: e.target.value,
    });
  }

  function alterarPapel(e) {
    setPapelForm({
      ...papelForm,
      [e.target.name]: e.target.value,
    });
  }

  function alterarResiduo(e) {
    setResiduoForm({
      ...residuoForm,
      [e.target.name]: e.target.value,
    });
  }

  function alterarAgua(e) {
    setAguaForm({
      ...aguaForm,
      [e.target.name]: e.target.value,
    });
  }

  // =========================================
  // LIMPAR FORMULÁRIO DE EQUIPAMENTO
  // =========================================

  function limparFormularioEquipamento() {
    setEquipamentoEditando(null);

    setEquipamentoForm({
      nome: "",
      potencia_w: "",
      quantidade: "",
      horas_por_dia: "",
      dias_por_mes: "",
    });
  }

  // =========================================
  // CADASTRAR EQUIPAMENTO
  // =========================================

  async function cadastrarEquipamento(e) {
    e.preventDefault();

    try {
      const resposta = await fetch(
        `${API}/equipamentos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: equipamentoForm.nome,
            potencia_w: Number(
              equipamentoForm.potencia_w
            ),
            quantidade: Number(
              equipamentoForm.quantidade
            ),
            horas_por_dia: Number(
              equipamentoForm.horas_por_dia
            ),
            dias_por_mes: Number(
              equipamentoForm.dias_por_mes
            ),
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.erro ||
            "Erro ao cadastrar equipamento."
        );
        return;
      }

      setMensagem(
        "Equipamento cadastrado com sucesso! ✅"
      );

      limparFormularioEquipamento();

      await carregarDados();
    } catch (erro) {
      console.error(erro);

      setMensagem(
        "Erro ao conectar ao servidor."
      );
    }
  }

  // =========================================
  // INICIAR EDIÇÃO
  // =========================================

  function iniciarEdicao(equipamento) {
    setEquipamentoEditando(equipamento);

    setEquipamentoForm({
      nome: equipamento.nome,
      potencia_w: equipamento.potencia_w,
      quantidade: equipamento.quantidade,
      horas_por_dia:
        equipamento.horas_por_dia,
      dias_por_mes:
        equipamento.dias_por_mes,
    });

    setMensagem(
      "Modo de edição ativado. ✏️"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================
  // ATUALIZAR EQUIPAMENTO
  // =========================================

  async function atualizarEquipamento(e) {
    e.preventDefault();

    if (!equipamentoEditando) {
      return;
    }

    try {
      const resposta = await fetch(
      `${API}/equipamentos/${equipamentoEditando.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: equipamentoForm.nome,
            potencia_w: Number(
              equipamentoForm.potencia_w
            ),
            quantidade: Number(
              equipamentoForm.quantidade
            ),
            horas_por_dia: Number(
              equipamentoForm.horas_por_dia
            ),
            dias_por_mes: Number(
              equipamentoForm.dias_por_mes
            ),
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.erro ||
            "Erro ao atualizar equipamento."
        );
        return;
      }

      setMensagem(
        "Equipamento atualizado com sucesso! ✅"
      );

      limparFormularioEquipamento();

      await carregarDados();
    } catch (erro) {
      console.error(erro);

      setMensagem(
        "Erro ao atualizar equipamento."
      );
    }
  }

  // =========================================
  // EXCLUIR EQUIPAMENTO
  // =========================================

  async function excluirEquipamento(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este equipamento?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
       `${API}/equipamentos/${id}`,
        {
          method: "DELETE",
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.erro ||
            "Erro ao excluir equipamento."
        );
        return;
      }

      if (
        equipamentoEditando &&
        equipamentoEditando.id === id
      ) {
        limparFormularioEquipamento();
      }

      setMensagem(
        "Equipamento excluído com sucesso! 🗑️"
      );

      await carregarDados();
    } catch (erro) {
      console.error(erro);

      setMensagem(
        "Erro ao excluir equipamento."
      );
    }
  }

  // =========================================
  // CADASTRAR PAPEL
  // =========================================

  async function cadastrarPapel(e) {
    e.preventDefault();

    try {
      const resposta = await fetch(
       `${API}/papel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mes: papelForm.mes,
            impressoes: Number(
              papelForm.impressoes
            ),
            frente_verso: Number(
              papelForm.frente_verso
            ),
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.erro ||
            "Erro ao registrar consumo de papel."
        );
        return;
      }

      setMensagem(
        "Consumo de papel registrado com sucesso! ✅"
      );

      setPapelForm({
        mes: "Setembro/2026",
        impressoes: "",
        frente_verso: "",
      });

      await carregarDados();
    } catch (erro) {
      console.error(erro);

      setMensagem(
        "Erro ao registrar papel."
      );
    }
  }

  // =========================================
  // CADASTRAR RESÍDUO
  // =========================================

  async function cadastrarResiduo(e) {
    e.preventDefault();

    try {
      const resposta = await fetch(
        `${API}/residuos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mes: residuoForm.mes,
            material: residuoForm.material,
            quantidade_kg: Number(
              residuoForm.quantidade_kg
            ),
            destino: residuoForm.destino,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.erro ||
            "Erro ao registrar resíduo."
        );
        return;
      }

      setMensagem(
        "Resíduo registrado com sucesso! ✅"
      );

      setResiduoForm({
        mes: "Setembro/2026",
        material: "Papel",
        quantidade_kg: "",
        destino: "Reciclagem",
      });

      await carregarDados();
    } catch (erro) {
      console.error(erro);

      setMensagem(
        "Erro ao registrar resíduo."
      );
    }
  }

  // =========================================
  // CADASTRAR ÁGUA
  // =========================================

  async function cadastrarAgua(e) {
    e.preventDefault();

    try {
      const resposta = await fetch(
        `${API}/agua`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mes: aguaForm.mes,
            lavagens: Number(
              aguaForm.lavagens
            ),
            litros_por_lavagem: Number(
              aguaForm.litros_por_lavagem
            ),
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.erro ||
            "Erro ao registrar consumo de água."
        );
        return;
      }

      setMensagem(
        "Consumo de água registrado com sucesso! ✅"
      );

      setAguaForm({
        mes: "Setembro/2026",
        lavagens: "",
        litros_por_lavagem: "",
      });

      await carregarDados();
    } catch (erro) {
      console.error(erro);

      setMensagem(
        "Erro ao registrar água."
      );
    }
  }

  // =========================================
  // CÁLCULOS
  // =========================================

  const totalConsumo = equipamentos.reduce(
    (total, equipamento) =>
      total +
      Number(
        equipamento.consumo_mensal_kwh || 0
      ),
    0
  );

  const totalImpressoes = papel.reduce(
    (total, registro) =>
      total +
      Number(registro.impressoes || 0),
    0
  );

  const totalFrenteVerso = papel.reduce(
    (total, registro) =>
      total +
      Number(registro.frente_verso || 0),
    0
  );

  const totalResiduos = residuos.reduce(
    (total, registro) =>
      total +
      Number(registro.quantidade_kg || 0),
    0
  );

  const totalReciclado = residuos
    .filter(
      (registro) =>
        registro.destino === "Reciclagem"
    )
    .reduce(
      (total, registro) =>
        total +
        Number(
          registro.quantidade_kg || 0
        ),
      0
    );

  const totalAgua = agua.reduce(
    (total, registro) =>
      total +
      Number(
        registro.consumo_total_litros || 0
      ),
    0
  );

  const percentualFrenteVerso =
    totalImpressoes > 0
      ? (totalFrenteVerso /
          totalImpressoes) *
        100
      : 0;

  const percentualReciclado =
    totalResiduos > 0
      ? (totalReciclado /
          totalResiduos) *
        100
      : 0;

  const consumoAnualEnergia =
    totalConsumo * 12;

  const consumoAnualAgua =
    totalAgua * 12;

  // =========================================
  // GRÁFICO
  // =========================================

  const dadosGrafico = [
    {
      nome: "Energia",
      valor: Number(
        totalConsumo.toFixed(2)
      ),
    },
    {
      nome: "Água",
      valor: Number(
        (totalAgua / 10).toFixed(2)
      ),
    },
    {
      nome: "Papel",
      valor: totalImpressoes,
    },
    {
      nome: "Resíduos",
      valor: Number(
        totalResiduos.toFixed(2)
      ),
    },
  ];

  // =========================================
  // INTERFACE
  // =========================================

  return (
    <div className="app">

      {/* CABEÇALHO */}

      <header className="topo">
        <div>
          <h1>🌱 EcoControl</h1>

          <h2>
            GESTÃO SUSTENTÁVEL EM FAMÍLIA
          </h2>

          <p>
            Uma aplicação que ajuda famílias
            a acompanhar o consumo de água,
            energia, papel e produção de
            resíduos, apresentando essas
            informações de forma simples e
            visual para promover hábitos mais
            sustentáveis.
          </p>

          <p>
            Gestão inteligente para um futuro
            mais consciente. 🌍
          </p>
        </div>
      </header>

      <main className="container">

        {/* DASHBOARD */}

        <section className="dashboard">

          <div className="card">
            <span className="icone">
              ⚡
            </span>

            <div>
              <p>Energia</p>

              <h2>
                {totalConsumo.toFixed(2)} kWh
              </h2>
            </div>
          </div>

          <div className="card">
            <span className="icone">
              💧
            </span>

            <div>
              <p>Água</p>

              <h2>
                {totalAgua.toFixed(2)} L
              </h2>
            </div>
          </div>

          <div className="card">
            <span className="icone">
              ♻️
            </span>

            <div>
              <p>Resíduos</p>

              <h2>
                {totalResiduos.toFixed(2)} kg
              </h2>
            </div>
          </div>

          <div className="card">
            <span className="icone">
              🖨️
            </span>

            <div>
              <p>Impressões</p>

              <h2>
                {totalImpressoes}
              </h2>
            </div>
          </div>

        </section>

        {/* MENSAGEM */}

        {mensagem && (
          <div className="mensagem-global">
            {mensagem}
          </div>
        )}

        {/* FORMULÁRIOS */}

        <section className="formularios">

          {/* EQUIPAMENTO */}

          <div className="painel">

            <h2>
              {equipamentoEditando
                ? "✏️ Editar equipamento"
                : "⚡ Adicionar equipamento"}
            </h2>

            <form
              onSubmit={
                equipamentoEditando
                  ? atualizarEquipamento
                  : cadastrarEquipamento
              }
            >

              <label>Nome</label>

              <input
                type="text"
                name="nome"
                value={equipamentoForm.nome}
                onChange={alterarEquipamento}
                placeholder="Ex.: Computador"
                required
              />

              <label>Potência (W)</label>

              <input
                type="number"
                name="potencia_w"
                value={
                  equipamentoForm.potencia_w
                }
                onChange={alterarEquipamento}
                placeholder="Ex.: 300"
                min="1"
                required
              />

              <label>Quantidade</label>

              <input
                type="number"
                name="quantidade"
                value={
                  equipamentoForm.quantidade
                }
                onChange={alterarEquipamento}
                placeholder="Ex.: 1"
                min="1"
                required
              />

              <label>Horas por dia</label>

              <input
                type="number"
                name="horas_por_dia"
                value={
                  equipamentoForm.horas_por_dia
                }
                onChange={alterarEquipamento}
                placeholder="Ex.: 8"
                min="0.1"
                step="0.1"
                required
              />

              <label>Dias por mês</label>

              <input
                type="number"
                name="dias_por_mes"
                value={
                  equipamentoForm.dias_por_mes
                }
                onChange={alterarEquipamento}
                placeholder="Ex.: 22"
                min="1"
                max="31"
                required
              />

              <button type="submit">
                {equipamentoEditando
                  ? "💾 Atualizar equipamento"
                  : "➕ Cadastrar equipamento"}
              </button>

              {equipamentoEditando && (
                <button
                  type="button"
                  onClick={
                    limparFormularioEquipamento
                  }
                >
                  ❌ Cancelar edição
                </button>
              )}

            </form>
          </div>

          {/* ÁGUA */}

          <div className="painel">

            <h2>
              💧 Registrar água
            </h2>

            <form
              onSubmit={cadastrarAgua}
            >

              <label>Mês</label>

              <input
                type="text"
                name="mes"
                value={aguaForm.mes}
                onChange={alterarAgua}
                required
              />

              <label>
                Número de utilizações
              </label>

              <input
                type="number"
                name="lavagens"
                value={
                  aguaForm.lavagens
                }
                onChange={alterarAgua}
                placeholder="Ex.: 120"
                min="0"
                required
              />

              <label>
                Litros por utilização
              </label>

              <input
                type="number"
                name="litros_por_lavagem"
                value={
                  aguaForm.litros_por_lavagem
                }
                onChange={alterarAgua}
                placeholder="Ex.: 8"
                min="0"
                step="0.1"
                required
              />

              <button type="submit">
                Registrar consumo
              </button>

            </form>
          </div>

          {/* PAPEL */}

          <div className="painel">

            <h2>
              🖨️ Registrar papel
            </h2>

            <form
              onSubmit={cadastrarPapel}
            >

              <label>Mês</label>

              <input
                type="text"
                name="mes"
                value={papelForm.mes}
                onChange={alterarPapel}
                required
              />

              <label>
                Quantidade de impressões
              </label>

              <input
                type="number"
                name="impressoes"
                value={
                  papelForm.impressoes
                }
                onChange={alterarPapel}
                placeholder="Ex.: 50"
                min="0"
                required
              />

              <label>
                Impressões frente e verso
              </label>

              <input
                type="number"
                name="frente_verso"
                value={
                  papelForm.frente_verso
                }
                onChange={alterarPapel}
                placeholder="Ex.: 20"
                min="0"
                required
              />

              <button type="submit">
                Registrar consumo
              </button>

            </form>
          </div>

          {/* RESÍDUOS */}

          <div className="painel">

            <h2>
              ♻️ Registrar resíduos
            </h2>

            <form
              onSubmit={cadastrarResiduo}
            >

              <label>Mês</label>

              <input
                type="text"
                name="mes"
                value={residuoForm.mes}
                onChange={alterarResiduo}
                required
              />

              <label>Material</label>

              <select
                name="material"
                value={
                  residuoForm.material
                }
                onChange={alterarResiduo}
              >
                <option>Papel</option>
                <option>Plástico</option>
                <option>Metal</option>
                <option>Vidro</option>
                <option>Orgânico</option>
                <option>Eletrônico</option>
              </select>

              <label>
                Quantidade (kg)
              </label>

              <input
                type="number"
                name="quantidade_kg"
                value={
                  residuoForm.quantidade_kg
                }
                onChange={alterarResiduo}
                placeholder="Ex.: 5"
                min="0"
                step="0.01"
                required
              />

              <label>Destino</label>

              <select
                name="destino"
                value={
                  residuoForm.destino
                }
                onChange={alterarResiduo}
              >
                <option>
                  Reciclagem
                </option>

                <option>
                  Reutilização
                </option>

                <option>
                  Compostagem
                </option>

                <option>
                  Descarte
                </option>
              </select>

              <button type="submit">
                Registrar resíduo
              </button>

            </form>
          </div>

        </section>

        {/* TABELA DE EQUIPAMENTOS */}

        <section className="painel tabela-painel">

          <h2>
            📊 Equipamentos cadastrados
          </h2>

          <div className="tabela-container">

            <table>

              <thead>
                <tr>
                  <th>Equipamento</th>
                  <th>Quantidade</th>
                  <th>Potência</th>
                  <th>Horas/dia</th>
                  <th>Consumo mensal</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>

                {equipamentos.length === 0 ? (

                  <tr>
                    <td colSpan="6">
                      Nenhum equipamento
                      cadastrado.
                    </td>
                  </tr>

                ) : (

                  equipamentos.map(
                    (equipamento) => (

                      <tr
                        key={
                          equipamento.id
                        }
                      >

                        <td>
                          {equipamento.nome}
                        </td>

                        <td>
                          {
                            equipamento.quantidade
                          }
                        </td>

                        <td>
                          {
                            equipamento.potencia_w
                          }{" "}
                          W
                        </td>

                        <td>
                          {
                            equipamento.horas_por_dia
                          }
                        </td>

                        <td>
                          {
                            equipamento.consumo_mensal_kwh
                          }{" "}
                          kWh
                        </td>

                        <td>

                          <div
                            style={{
                              display:
                                "flex",
                              gap: "8px",
                              justifyContent:
                                "center",
                              flexWrap:
                                "wrap",
                            }}
                          >

                            <button
                              type="button"
                              onClick={() =>
                                iniciarEdicao(
                                  equipamento
                                )
                              }
                            >
                              ✏️ Editar
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                excluirEquipamento(
                                  equipamento.id
                                )
                              }
                            >
                              🗑️ Excluir
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* GRÁFICO */}

        <section className="painel grafico-painel">

          <div className="grafico-cabecalho">

            <div>

              <h2>
                📈 Consumo de recursos
              </h2>

              <p>
                Visão geral dos principais
                indicadores de consumo
                da família.
              </p>

            </div>

          </div>

          <div className="grafico">

            <ResponsiveContainer
              width="100%"
              height={330}
            >

              <BarChart
                data={dadosGrafico}
                margin={{
                  top: 20,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="nome"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="valor"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                >

                  <Cell fill="#f59e0b" />

                  <Cell fill="#06b6d4" />

                  <Cell fill="#3b82f6" />

                  <Cell fill="#22c55e" />

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

          <div className="grafico-legenda">

            <span>
              ⚡ Energia: kWh
            </span>

            <span>
              💧 Água: litros ÷ 10
            </span>

            <span>
              🖨️ Papel: impressões
            </span>

            <span>
              ♻️ Resíduos: kg
            </span>

          </div>

        </section>

        {/* RELATÓRIO */}

        <section className="relatorio">

          <div className="painel">

            <h2>
              📊 Relatório de
              sustentabilidade
            </h2>

            {/* ENERGIA */}

            <div className="relatorio-item">

              <div className="relatorio-topo">

                <span>
                  ⚡ Consumo de energia
                </span>

                <strong>
                  {totalConsumo.toFixed(
                    2
                  )}{" "}
                  kWh/mês
                </strong>

              </div>

              <div className="barra">

                <div
                  className="barra-preenchida energia"
                  style={{
                    width: `${Math.min(
                      (totalConsumo /
                        500) *
                        100,
                      100
                    )}%`,
                  }}
                />

              </div>

              <small>
                Consumo anual estimado:{" "}
                {consumoAnualEnergia.toFixed(
                  2
                )}{" "}
                kWh
              </small>

            </div>

            {/* ÁGUA */}

            <div className="relatorio-item">

              <div className="relatorio-topo">

                <span>
                  💧 Consumo de água
                </span>

                <strong>
                  {totalAgua.toFixed(
                    2
                  )}{" "}
                  L/mês
                </strong>

              </div>

              <div className="barra">

                <div
                  className="barra-preenchida agua"
                  style={{
                    width: `${Math.min(
                      (totalAgua /
                        3000) *
                        100,
                      100
                    )}%`,
                  }}
                />

              </div>

              <small>
                Consumo anual estimado:{" "}
                {consumoAnualAgua.toFixed(
                  2
                )}{" "}
                L
              </small>

            </div>

            {/* PAPEL */}

            <div className="relatorio-item">

              <div className="relatorio-topo">

                <span>
                  🖨️ Impressões frente e
                  verso
                </span>

                <strong>
                  {percentualFrenteVerso.toFixed(
                    1
                  )}
                  %
                </strong>

              </div>

              <div className="barra">

                <div
                  className="barra-preenchida papel"
                  style={{
                    width: `${Math.min(
                      percentualFrenteVerso,
                      100
                    )}%`,
                  }}
                />

              </div>

              <small>
                {totalFrenteVerso} de{" "}
                {totalImpressoes}{" "}
                impressões registradas
                em frente e verso.
              </small>

            </div>

            {/* RECICLAGEM */}

            <div className="relatorio-item">

              <div className="relatorio-topo">

                <span>
                  ♻️ Resíduos destinados
                  à reciclagem
                </span>

                <strong>
                  {percentualReciclado.toFixed(
                    1
                  )}
                  %
                </strong>

              </div>

              <div className="barra">

                <div
                  className="barra-preenchida reciclagem"
                  style={{
                    width: `${Math.min(
                      percentualReciclado,
                      100
                    )}%`,
                  }}
                />

              </div>

              <small>
                {totalReciclado.toFixed(
                  2
                )}{" "}
                kg de{" "}
                {totalResiduos.toFixed(
                  2
                )}{" "}
                kg destinados à
                reciclagem.
              </small>

            </div>

          </div>

          {/* RECOMENDAÇÕES */}

          <div className="painel">

            <h2>
              💡 Recomendações
            </h2>

            <div className="recomendacao">

              <strong>
                ⚡ Energia
              </strong>

              <p>
                Desligar equipamentos,
                computadores e
                iluminação quando não
                estiverem sendo
                utilizados.
              </p>

            </div>

            <div className="recomendacao">

              <strong>
                💧 Água
              </strong>

              <p>
                Verificar torneiras e
                equipamentos hidráulicos
                e reduzir o desperdício
                durante o consumo diário.
              </p>

            </div>

            <div className="recomendacao">

              <strong>
                🖨️ Papel
              </strong>

              <p>
                Priorizar documentos
                digitais e utilizar
                impressão frente e
                verso quando necessário.
              </p>

            </div>

            <div className="recomendacao">

              <strong>
                ♻️ Resíduos
              </strong>

              <p>
                Separar corretamente os
                resíduos e aumentar a
                quantidade de materiais
                destinados à reciclagem.
              </p>

            </div>

            <div className="recomendacao">

              <strong>
                🌱 Consciencialização
              </strong>

              <p>
                Acompanhar os indicadores
                mensalmente e envolver
                toda a família em práticas
                de consumo mais
                sustentáveis.
              </p>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default App;