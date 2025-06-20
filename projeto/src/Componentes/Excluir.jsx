import './estilo/App_Excluir.css';
import { useEffect, useState } from 'react';

const AppExcluir = () => {
  const [gestantes, setGestantes] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    fetch("http://localhost:3001/gestantes")
      .then(res => res.json())
      .then(data => setGestantes(data))
      .catch(err => console.error("Erro ao carregar gestantes:", err));
  }, []);

  const excluirGestante = (id, nome) => {
    const confirmar = window.confirm(`Deseja realmente excluir o cadastro de ${nome}?`);
    if (confirmar) {
      fetch(`http://localhost:3001/gestantes/${id}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(data => {
          alert(data.msg);
          setGestantes(gestantes.filter(g => g.id_gestante !== id));
        })
        .catch(err => {
          alert("Erro ao excluir gestante");
          console.error(err);
        });
    }
  };

  const gestantesFiltradas = gestantes.filter(g =>
    g.nome_gestante.toLowerCase().includes(termoBusca.toLowerCase())
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
        <h2 className="titulo-alterar">Excluir Cadastro de Gestantes</h2>

        <div className="busca">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
          <button>Buscar</button>
          <a href="/"><button type="button" className="btn">Voltar</button></a>
        </div>

        <table className="alterar-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data Nasc.</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {gestantesFiltradas.map((g) => (
              <tr key={g.id_gestante}>
                <td>{g.nome_gestante}</td>
                <td>{formatarData(g.data_nasc)}</td>
                <td>
                  <button
                    className="editar-btn"
                    onClick={() => excluirGestante(g.id_gestante, g.nome_gestante)}
                    title="Excluir gestante"
                  >
                    &#10060;
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

export default AppExcluir;
