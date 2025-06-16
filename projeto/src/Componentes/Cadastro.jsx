import "./estilo/App_cadastro.css";
import { useState, useEffect } from "react";


export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    data_nasc: "",
    idade: "",
    dum: "",
    telefone: "",
  });

  useEffect(() => {
    if (formData.data_nasc) {
      const hoje = new Date();
      const nasc = new Date(formData.data_nasc);
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const mesAtual = hoje.getMonth();
      const mesNasc = nasc.getMonth();
      if (
        mesAtual < mesNasc ||
        (mesAtual === mesNasc && hoje.getDate() < nasc.getDate())
      ) {
        idade--;
      }
      setFormData((prev) => ({ ...prev, idade: idade.toString() }));
    }
  }, [formData.data_nasc]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/gestantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome_gestante: formData.nome,
          data_nasc: formData.data_nasc,
          idade_gestante: formData.idade,
          dum: formData.dum,
          telefone_gestante: formData.telefone,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso!\n\n" + result.msg);
        setFormData({ nome: "", data_nasc: "", idade: "", dum: "", telefone: "" });
      } else {
        alert("Erro ao cadastrar:\n\n" + (result.error || result.msg));
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="cadastro-page">
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

        <div className="form-container">
            
          <form onSubmit={handleSubmit}>
            <text className="title">Cadastro</text>

            <label htmlFor="nome">Nome da Gestante:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />

            <label htmlFor="data_nasc">Data de Nascimento:</label>
            <input
              type="date"
              id="data_nasc"
              name="data_nasc"
              value={formData.data_nasc}
              onChange={handleChange}
              required
            />

            <label htmlFor="idade">Idade:</label>
            <input
              type="text"
              id="idade"
              name="idade"
              value={formData.idade}
              readOnly
            />

            <label htmlFor="dum">DUM (Data da Última Menstruação):</label>
            <input
              type="date"
              id="dum"
              name="dum"
              value={formData.dum}
              onChange={handleChange}
            />

            <label htmlFor="telefone">Telefone:</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
            />

            <div className="button-container">
              <button type="button" className="btn" onClick={() => window.history.back()}>
                Voltar
              </button>
              <button type="submit" className="btn">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer>
        &copy; 2025 Sistema de Gestantes. Todos os direitos reservados.
      </footer>
    </div>
  );
}
