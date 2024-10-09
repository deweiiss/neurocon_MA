import './App.css';
import {HashRouter, Route, Routes} from "react-router-dom"
import AuthenticationPage from "./pages/authentication";
import HomePage from "./pages/home";
import DashboardPage from "./pages/dashboard";
import InputPage from "./pages/input";
import ModellingPage from "./pages/modelling";
import TrainingPage from "./pages/training";
import OutputPage from "./pages/output";

function App() {
  return (
      <HashRouter>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/auth" element={<AuthenticationPage/>}/>
            <Route path="/dashboard" element={<DashboardPage/>}/>
            <Route path="/input" element={<InputPage/>}/>
            <Route path="/modelling" element={<ModellingPage/>}/>
            <Route path="/training" element={<TrainingPage/>}/>
            <Route path="/output" element={<OutputPage/>}/>
        </Routes>
      </HashRouter>
  )
}

export default App;
