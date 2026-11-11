import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
function App() {
    return (
        <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
        </Routes>
    );
}

export default App;
