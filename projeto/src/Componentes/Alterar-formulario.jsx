import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDays, parseISO } from "date-fns";
import "./estilo/App_altera_form.css";

/* ─ util para recalcular datas a partir da DUM ─ */
const calcularDatas = (dum) => ({
  partoPrevista: addDays(parseISO(dum), 280),
  transIni:      addDays(parseISO(dum), 77),
  transFim:      addDays(parseISO(dum), 98),
  obstIni:       addDays(parseISO(dum), 154),
  obstFim:       addDays(parseISO(dum), 168),
});

/* ─ util para idade ─ */
const calcIdade = (dataNasc) => {
  if (!dataNasc) return "";
  const hoje   = new Date();
  const nasc   = new Date(dataNasc);
  let idade    = hoje.getFullYear() - nasc.getFullYear();
  const m      = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
};

export default function AlterarFormulario() {
  /* pego o id direto da rota: /alterar-formulario/:id   */
  const { id }   = useParams();
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    id: "",
    nome: "",
    nascimento: "",
    dum: "",
    exameObst: "",
    statusObst: "",
    exameTrans: "",
    statusTrans: "",
    idade: "",
  });

  /* ───────────────────────────────────────── fetch ─ */
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3001/gestantes/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Gestante não encontrada");
        return r.json();
      })
      .then((g) => {
        /* converto datas para yyyy‑mm‑dd (input type=date exige) */
        const fmt = (d) => (d ? d.split("T")[0] : "");

        setDados({
          id:            g.id_gestante,
          nome:          g.nome_gestante || "",
          nascimento:    fmt(g.data_nasc),
          dum:           fmt(g.dum),
          exameObst:     fmt(g.data_exame_o),
          statusObst:    (g.status_obstetrico ?? 1).toString(),
          exameTrans:    fmt(g.data_exame_t),
          statusTrans:   (g.status_transnucal ?? 1).toString(),
          idade:         calcIdade(g.data_nasc),
        });
      })
      .catch((err) => {
        alert(err.message);
        navigate("/alterar");          // volta para lista se erro
      });
  }, [id, navigate]);

  /* ─────────────────────────────────── handlers ─ */
  const handleChange = (e) => {
    const { id: fld, value } = e.target;
    setDados((p) => ({
      ...p,
      [fld]: value,
      ...(fld === "nascimento" && { idade: calcIdade(value) }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    /* recalcula blocos — se DUM foi alterada */
    const datas = calcularDatas(dados.dum);

    /* prepara payload pro back */
    const body = {
      nome_gestante: dados.nome,
      data_nasc:     dados.nascimento,
      dum:           dados.dum,
      data_exame_o:  dados.exameObst || null,
      status_obstetrico: parseInt(dados.statusObst, 10),
      data_exame_t:  dados.exameTrans || null,
      status_transnucal:  parseInt(dados.statusTrans, 10),

      /* datas recalculadas */
      ...datas,
    };

    fetch(`http://localhost:3001/gestantes/${dados.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao atualizar");
        alert("Dados atualizados!");
        navigate("/");
      })
      .catch((err) => alert(err.message));
  };

  /* ────────────────────────────────── UI ─ */
  return (
    <div className="alterar-formulario-container">
      <header>Sistema de Cadastro de Gestantes</header>

      <main>
        <p className="consulta-title">Atualização dos Dados</p>

        <form onSubmit={handleSubmit}>
          <input type="hidden" id="id" value={dados.id_gestante} />

          <div>
            <label htmlFor="nome">Nome:</label>
            <input id="nome" value={dados.nome} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="nascimento">Data de Nascimento:</label>
            <input type="date" id="nascimento" value={dados.nascimento} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="idade">Idade:</label>
            <input id="idade" value={dados.idade} readOnly />
          </div>

          <div>
            <label htmlFor="dum">DUM:</label>
            <input type="date" id="dum" value={dados.dum} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="exameObst">Exame Obstétrico:</label>
            <input type="date" id="exameObst" value={dados.exameObst} onChange={handleChange} readOnly/>
          </div>

          <div>
            <label htmlFor="statusObst">Status Obstétrico:</label>
            <select id="statusObst" value={dados.statusObst} onChange={handleChange}>
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
            </select>
          </div>

          <div>
            <label htmlFor="exameTrans">Exame Transnucal:</label>
            <input type="date" id="exameTrans" value={dados.exameTrans} onChange={handleChange} readOnly/>
          </div>

          <div>
            <label htmlFor="statusTrans">Status Transnucal:</label>
            <select id="statusTrans" value={dados.statusTrans} onChange={handleChange}>
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
            </select>
          </div>

          <button type="submit" className="btn">Alterar</button>
          <button type="button" className="btn" onClick={() => navigate("/")}>Voltar</button>
        </form>
      </main>
    </div>
  );
}
