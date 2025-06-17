import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./estilo/App_altera_form.css";

const AlterarFormulario = () => {
  const [dados, setDados] = useState({
    id: "",
    nome: "",
    nascimento: "",
    exameObst: "",
    statusObst: "Ativo",
    exameTrans: "",
    statusTrans: "Ativo"
  });

  const navigate = useNavigate();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
      setDados((prev) => ({ ...prev, id }));

      // Simulação de preenchimento (substitua pelo fetch futuramente)
      if (id === "1") {
        setDados({
          id,
          nome: "Maria Silva",
          nascimento: "1994-05-12",
          exameObst: "2025-03-10",
          statusObst: "Ativo",
          exameTrans: "2025-03-22",
          statusTrans: "Ativo"
        });
      } else if (id === "2") {
        setDados({
          id,
          nome: "Luciana Costa",
          nascimento: "1998-01-30",
          exameObst: "2025-04-18",
          statusObst: "Ativo",
          exameTrans: "2025-04-30",
          statusTrans: "Ativo"
        });
      }
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setDados((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados a serem enviados para o backend:", dados);

    // Substituir isso por um fetch para seu backend futuramente
    // fetch("/api/gestante/atualizar", {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(dados)
    // })

    alert("Dados atualizados com sucesso!");
  };

  return (
    <div className="alterar-formulario-container">
      <header>Sistema de Cadastro de Gestantes</header>

      <main>
        <p className="consulta-title">Atualização dos Dados</p>

        <form onSubmit={handleSubmit}>
          <input type="hidden" id="idGestante" value={dados.id} />

          <div>
            <label htmlFor="nome">Nome:</label>
            <input type="text" id="nome" value={dados.nome} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="nascimento">Data de Nascimento:</label>
            <input type="date" id="nascimento" value={dados.nascimento} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="nascimento">Idade:</label>
            <input type="text" id="idade" value={dados.idade} onChange={handleChange} required readOnly/>
          </div>

          <div>
            <label htmlFor="exameObst">Exame Obstétrico:</label>
            <input type="date" id="exameObst" value={dados.exameObst} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="statusObst">Status Obstétrico:</label>
            <select id="statusObst" value={dados.statusObst} onChange={handleChange}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <div>
            <label htmlFor="exameTrans">Exame Transnucal:</label>
            <input type="date" id="exameTrans" value={dados.exameTrans} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="statusTrans">Status Transnucal:</label>
            <select id="statusTrans" value={dados.statusTrans} onChange={handleChange}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <button type="button" className="btn">Alterar</button>
          <a href="/"><button type="button" className="btn" >
                Voltar
              </button> </a>
        </form>
      </main>

    </div>
  );
};

export default AlterarFormulario;
