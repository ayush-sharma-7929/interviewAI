import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import { useEffect } from "react";
import axios from "axios";
import { ServerURL } from "./config.js";
function App() {
    useEffect(() => {
        const getUser = async () => {
            try {
                const result = await axios.get(
                    `${ServerURL}/api/user/current_user`,
                    { withCredentials: true },
                );
                console.log("Current user:", result.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        getUser();
    }, []);
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
        </Routes>
    );
}

export default App;
