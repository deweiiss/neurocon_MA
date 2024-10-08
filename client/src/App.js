import './App.css';
import {HashRouter, Route, Routes} from "react-router-dom"
import AuthenticationPage from "./pages/authentication";
import HomePage from "./pages/home";

function App() {
  return (
      <HashRouter>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/auth" element={<AuthenticationPage/>}/>
        </Routes>
      </HashRouter>
  )
}

export default App;
