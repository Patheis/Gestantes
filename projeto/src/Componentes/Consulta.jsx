import './estilo/App_consulta.css';

const AppConsulta = () => {
  const filtrar = () => {
    const termo = document.getElementById('buscaInput').value.toLowerCase();
    const linhas = document.querySelectorAll('#tabelaGestante tbody tr');
    linhas.forEach(linha => {
      const nome = linha.cells[0].innerText.toLowerCase();
      linha.style.display = nome.includes(termo) ? '' : 'none';
    });
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
          <input type="text" id="buscaInput" placeholder="Pesquisar gestante..." />
          <button onClick={filtrar}>Buscar</button>
          <button type="button" className="btn" onClick={() => window.history.back()}>
            Voltar
          </button>
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
              <th>Observacao</th>
              <th>Data prevista</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Maria Silva</td>
              <td>12/05/1994</td>
              <td>199999999</td>
              <td>10/03/2025</td>
              <td><span className="badge ativo">Ativo</span></td>
              <td>22/03/2025</td>
              <td><span className="badge ativo">Ativo</span></td>
              <td>Risco</td>
              <td>10/12/2025</td>
            </tr>
            <tr>
              <td>Ana Souza</td>
              <td>08/11/1990</td>
              <td>199999999</td>
              <td>05/02/2025</td>
              <td><span className="badge inativo">Inativo</span></td>
              <td>-</td>
              <td><span className="badge inativo">Inativo</span></td>
              <td>Alto Risco</td>
              <td>10/12/2025</td>
            </tr>
            <tr>
              <td>Luciana Costa</td>
              <td>30/01/1998</td>
              <td>199999999</td>
              <td>18/04/2025</td>
              <td><span className="badge ativo">Ativo</span></td>
              <td>30/04/2025</td>
              <td><span className="badge ativo">Ativo</span></td>
              <td>Risco</td>
              <td>10/12/2025</td>
            </tr>
          </tbody>
        </table>
      </main>

      <footer>&copy; 2025 Sistema de Gestantes. Todos os direitos reservados.</footer>
    </div>
  );
};

export default AppConsulta;
