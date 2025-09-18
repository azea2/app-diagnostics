import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import DiagnosticSummary from "./pages/DiagnosticSummary";
import Home from "./pages/Home";
import Sleccionador from "./views/Seleccionador";
import View3 from "./pages/View3";
import View4 from "./pages/View4";
import View5 from "./pages/View5";
import View7 from "./pages/View7";
import View18 from "./pages/View18";
import Entrevista from "./viewsInformation/Entrevista";
import ArbolView25 from "./viewsAnalysis/ArbolView25";
import ArbolDiagrama from "./viewsAnalysis/ArbolDiagrama";
import ArbolDiagramaSimple from "./viewsAnalysis/ArbolDiagramaSimple";
import ArbolTest from "./viewsAnalysis/ArbolTest";
import ArbolNuevo from "./viewsAnalysis/ArbolNuevo";
import ArbolBasico from "./viewsAnalysis/ArbolBasico";
import ArbolDiagramaFixed from "./viewsAnalysis/ArbolDiagramaFixed";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/diagnosticSummary" element={<Layout><DiagnosticSummary /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/seleccionador" element={<Layout><Sleccionador /></Layout>} />
        <Route path="/view3" element={<Layout><View3 /></Layout>} />
        <Route path="/view4" element={<Layout><View4 /></Layout>} />
        <Route path="/view5" element={<Layout><View5 /></Layout>} />
        <Route path="/view7" element={<Layout><View7 /></Layout>} />
        <Route path="/view18" element={<Layout><View18 /></Layout>} />
        <Route path="/entrevista" element={<Layout><Entrevista /></Layout>} />
        <Route path="/arbol" element={<Layout><ArbolView25 /></Layout>} />
        <Route path="/arbol-diagrama" element={<Layout><ArbolDiagrama /></Layout>} />
        <Route path="/arbol-simple" element={<Layout><ArbolDiagramaSimple /></Layout>} />
        <Route path="/arbol-test" element={<ArbolTest />} />
        <Route path="/arbol-nuevo" element={<Layout><ArbolNuevo /></Layout>} />
        <Route path="/arbol-basico" element={<ArbolBasico />} />
        <Route path="/arbol-fixed" element={<Layout><ArbolDiagramaFixed /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;