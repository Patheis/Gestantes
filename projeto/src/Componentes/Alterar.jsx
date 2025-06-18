import './estilo/App_altera.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppAltera = () => {
  const [gestantes, setGestantes] = useState([]);
  const [filtroInput, setFiltroInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/gestantes')
      .then(res => res.json())
      .then(data => setGestantes(data))
      .catch(err => console.error("Erro ao buscar gestantes:", err));
  }, []);

  const editarGestante = (id, nome) => {
    const confirmar = window.confirm(`Deseja alterar o cadastro da gestante ${nome}?`);
    if (confirmar) {
      navigate(`/alterar-formulario/${id}`);
    }
  };

  const gestantesFiltradas = gestantes.filter(g =>
    g.nome_gestante.toLowerCase().includes(filtroInput.toLowerCase())
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
          <input
            type="text"
            id="buscaInput"
            placeholder="Pesquisar por nome..."
            value={filtroInput}
            onChange={(e) => setFiltroInput(e.target.value)}
          />
          
          <a href="/"><button type="button" className="btn">Voltar</button></a>
        </div>

        <table className="alterar-table" id="tabelaAlterar">
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Nome</th>
              <th>Data Nasc.</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {gestantesFiltradas.map(g => (
              <tr key={g.id_gestante}>
                <td>{g.id_gestante}</td>
                <td>{g.nome_gestante}</td>
                <td>{formatarData(g.data_nasc)}</td>
                <td>
                  <button
                    onClick={() => editarGestante(g.id_gestante, g.nome_gestante)}
                    className="icone-editar"
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AppAltera;
