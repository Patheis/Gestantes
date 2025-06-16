import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './Componentes/Home';
import Cadastro from './Componentes/Cadastro';
import Consulta from './Componentes/Consulta';


export default function App()
{
  return(
    
    <BrowserRouter>
       
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/consulta" element={<Consulta />} />
      </Routes>
    </BrowserRouter>
  );
}