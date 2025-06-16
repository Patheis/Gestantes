

export default function Home() {
  return (
    <div className="app-container">
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

        <h2 className="menu-title">Bem‑vinda! Escolha a ação desejada</h2>

        <div className="menu-container">
          <a className="menu-btn" href="/cadastro">Cadastro</a>
          <a className="menu-btn" href="/consulta">Consulta</a>
          <a className="menu-btn" href="/alterar">Alterar</a>
          <a className="menu-btn" href="/excluir">Excluir</a>
        </div>
      </main>

      <footer>
        &copy; 2025 Sistema de Gestantes. Todos os direitos reservados.
      </footer>
    </div>
  );
}
