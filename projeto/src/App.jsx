import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './Componentes/Home';
import Cadastro from './Componentes/Cadastro';
import Consulta from './Componentes/Consulta';
import Footer from './Componentes/Footer';
import Alterar from './Componentes/Alterar';
import Excluir from './Componentes/Excluir';
import AlterarFormulario from "./Componentes/Alterar-formulario"; 

export default function App()
{
  return(
    <div className="page-container">
    <BrowserRouter>
       
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/consulta" element={<Consulta />} />
        <Route path="/alterar" element={<Alterar />} />
        <Route path="/excluir" element={<Excluir />} />
        <Route path="/alterar-formulario" element={<AlterarFormulario />} />
      </Routes>
      
    </BrowserRouter>
    <Footer />
    </div>
  );
}