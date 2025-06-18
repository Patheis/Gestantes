import './estilo/App_consulta.css';
import { useEffect, useState } from 'react';

const AppConsulta = () => {
  const [gestantes, setGestantes] = useState([]);
  const [filtroInput, setFiltroInput] = useState("");
  const [filtroAplicado, setFiltroAplicado] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/gestantes")
      .then(res => res.json())
      .then(data => setGestantes(data))
      .catch(err => console.error("Erro ao buscar gestantes:", err));
  }, []);

  const filtrar = () => {
    setFiltroAplicado(filtroInput);
  };

  const gestantesFiltradas = gestantes.filter((g) =>
    g.nome_gestante.toLowerCase().includes(filtroAplicado.toLowerCase())
  );

  const formatarData = (dataStr) => {
  if (!dataStr || dataStr === "0000-00-00") return "-";
  const data = new Date(dataStr);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};


  return (
    <div className="consulta-wrapper">
      <header>Sistema de Cadastro de Gestantes</header>

      <main>
        <div className="image-container">
          <img
            src="https://img.freepik.com/vetores-gratis/ilustracao-de-desenho-de-mulher-gravida-desenhada-de-mao_23-2150452532.jpg?semt=ais_hybrid&w=740"
            alt="Logo Rede Cegonha"
          />
          <img
            src="https://sapl.mococa.sp.leg.br/media/sapl/public/casa/logotipo/logo_mococa.jpg"
            alt="Logo Prefeitura"
          />
        </div>

        <p className="consulta-title">Consulta de Gestantes e Exames</p>

        <div className="busca">
          <input
            type="text"
            id="buscaInput"
            placeholder="Pesquisar gestante..."
            value={filtroInput}
            onChange={(e) => setFiltroInput(e.target.value)}
          />
          <button onClick={filtrar}>Buscar</button>
          <a href="/">
            <button type="button" className="btn">Voltar</button>
          </a>
        </div>

        <table className="gestante-table" id="tabelaGestante">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data Nasc.</th>
              <th>Telefone</th>
              <th>Exame Obstétrico</th>
              <th>Status Obst.</th>
              <th>Exame Transnucal</th>
              <th>Status Trans.</th>
              <th>Observação</th>
              <th>Data prevista</th>
            </tr>
          </thead>
          <tbody>
            {gestantesFiltradas.map((g) => (
              <tr key={g.id_gestante}>
                <td>{g.nome_gestante}</td>
                <td>{formatarData(g.data_nasc)}</td>
                <td>{g.telefone_gestante}</td>
                <td>{formatarData(g.data_exame_o)}</td>
                <td>
                  <span className={`badge ${g.status_obstetrico ? 'ativo' : 'inativo'}`}>
                    {g.status_obstetrico ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td>{formatarData(g.data_exame_t)}</td>
                <td>
                  <span className={`badge ${g.status_transnucal ? 'ativo' : 'inativo'}`}>
                    {g.status_transnucal ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td>{g.observacao || '-'}</td>
                <td>{formatarData(g.data_parto_prevista)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AppConsulta;
