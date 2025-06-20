import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDays, parseISO } from "date-fns";
import "./estilo/App_altera_form.css";

const calcularDatas = (dum) => ({
  partoPrevista: addDays(parseISO(dum), 280),
  transIni:      addDays(parseISO(dum), 77),
  transFim:      addDays(parseISO(dum), 98),
  obstIni:       addDays(parseISO(dum), 154),
  obstFim:       addDays(parseISO(dum), 168),
});

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
  const { id }   = useParams();
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    id: "",
    telefone: "",
    nome: "",
    nascimento: "",
    dum: "",
    statusObst: "",
    statusTrans: "",
    idade: "",
    observacao: ""
  });

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3001/gestantes/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Gestante não encontrada");
        return r.json();
      })
      .then((g) => {
        const fmt = (d) => (d ? d.split("T")[0] : "");

        setDados({
          id:            g.id_gestante,
          nome:          g.nome_gestante || "",
          telefone:      g.telefone_gestante || "",
          nascimento:    fmt(g.data_nasc),
          dum:           fmt(g.dum),
          statusObst:    g.status_obstetrico != null ? g.status_obstetrico.toString() : "1",
          statusTrans:   g.status_transnucal != null ? g.status_transnucal.toString() : "1",
          idade:         calcIdade(g.data_nasc),
          observacao:    g.observacoes || ""
        });
      })
      .catch((err) => {
        alert(err.message);
        navigate("/alterar");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { id: fld, value } = e.target;
    setDados((p) => ({
      ...p,
      [fld]: value,
      ...(fld === "nascimento" && { idade: calcIdade(value) })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datas = calcularDatas(dados.dum);

    const body = {
      nome_gestante: dados.nome,
      telefone_gestante: dados.telefone,
      data_nasc:     dados.nascimento,
      idade_gestante: parseInt(dados.idade, 10),
      dum:           dados.dum,
      status_obstetrico: parseInt(dados.statusObst, 10),
      status_transnucal:  parseInt(dados.statusTrans, 10),
      observacao:     dados.observacao,
      ...datas
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

  return (
    <div className="alterar-formulario-container">
      <header>Sistema de Cadastro de Gestantes</header>

      <main>
        <p className="consulta-title">Atualização dos Dados</p>

        <form onSubmit={handleSubmit}>
          <input type="hidden" id="id" value={dados.id} />

          <div>
            <label htmlFor="nome">Nome:</label>
            <input id="nome" value={dados.nome} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="telefone">Telefone:</label>
            <input id="telefone" value={dados.telefone} onChange={handleChange} required />
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
            <label htmlFor="statusObst">Status Obstétrico:</label>
            <select id="statusObst" value={dados.statusObst} onChange={handleChange}>
              <option value="1">✅ Agendado</option>
              <option value="0">🟥 Nao agendado</option>
            </select>
          </div>

          <div>
            <label htmlFor="statusTrans">Status Transnucal:</label>
            <select id="statusTrans" value={dados.statusTrans} onChange={handleChange}>
              <option value="1">✅ Agendado</option>
              <option value="0">🟥 Nao agendado</option>
            </select>
          </div>

          <div>
            <label htmlFor="observacao">Observações:</label>
            <input id="observacao" value={dados.observacao} onChange={handleChange} rows="3" />
          </div>

          <button type="submit" className="btn">Alterar</button>
          <button type="button" className="btn" onClick={() => navigate("/")}>Voltar</button>
        </form>
      </main>
    </div>
  );
}
