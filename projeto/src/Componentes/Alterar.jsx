import './estilo/App_altera.css';

const AppAltera = () => {

  const editarGestante = (id, nome) => {
    const confirmar = window.confirm(`Deseja alterar o cadastro da gestante ${nome}?`);
    if (confirmar) {
      window.location.href = `alterar-formulario.jsx?id=${id}`;
    }
  };

  const filtrar = () => {
    const termo = document.getElementById('buscaInput').value.toLowerCase();
    const linhas = document.querySelectorAll('#tabelaAlterar tbody tr');
    linhas.forEach((linha) => {
      const nome = linha.cells[0].innerText.toLowerCase();
      linha.style.display = nome.includes(termo) ? '' : 'none';
    });
  };

  return (
    <div>
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
        <h2 className="titulo-alterar">Alterar Dados de Gestantes</h2>

        <div className="busca">
          <input type="text" id="buscaInput" placeholder="Pesquisar por nome..." />
          <button onClick={filtrar}>Buscar</button>
          <a href="/"><button type="button" className="btn">Voltar</button></a>
        </div>

        <table className="alterar-table" id="tabelaAlterar">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data Nasc.</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Maria Silva</td>
              <td>12/05/1994</td>
              <td>
                <button className="editar-btn" onClick={() => editarGestante(1, 'Maria Silva')}>✏️</button>
              </td>
            </tr>
            <tr>
              <td>Luciana Costa</td>
              <td>30/01/1998</td>
              <td>
                <button className="editar-btn" onClick={() => editarGestante(2, 'Luciana Costa')}>✏️</button>
              </td>
            </tr>
          </tbody>
        </table>
        
      </main>
    </div>
  );
};

export default AppAltera;
