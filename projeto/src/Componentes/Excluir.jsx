import './estilo/App_Excluir.css';
import { useState } from 'react';

const AppExcluir = () => {
  const [termoBusca, setTermoBusca] = useState('');
  const [gestantes, setGestantes] = useState([
    { id: 1, nome: 'Maria Silva', nascimento: '12/05/1994' },
    { id: 2, nome: 'Luciana Costa', nascimento: '30/01/1998' }
  ]);

  const filtrar = () => {
    return gestantes.filter(g => g.nome.toLowerCase().includes(termoBusca.toLowerCase()));
  };

  const confirmarExclusao = (id, nome) => {
    const confirmar = window.confirm(`Deseja realmente excluir o cadastro de ${nome}?`);
    if (confirmar) {
      setGestantes(gestantes.filter(g => g.id !== id));
      alert(`Cadastro de ${nome} excluído com sucesso!`);
    }
  };

  return (
    <div>
      <header>Sistema de Cadastro de Gestantes</header>

      <main>
        <h2 className="excluir-title">Excluir Cadastro de Gestantes</h2>

        <div className="busca">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
          <button onClick={filtrar}>Buscar</button>
          <a href="/"><button type="button" className="btn">Voltar</button></a>
        </div>

        <table className="gestante-table" id="tabelaGestante">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data Nasc.</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrar().map((g) => (
              <tr key={g.id}>
                <td>{g.nome}</td>
                <td>{g.nascimento}</td>
                <td>
                  <a
                    href="#"
                    className="acao excluir"
                    onClick={() => confirmarExclusao(g.id, g.nome)}
                  >
                    &#10060;
                  </a>
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
