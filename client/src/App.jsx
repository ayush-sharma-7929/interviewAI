import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import { useEffect } from "react";
import axios from "axios";
import { ServerURL } from "./config.js";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice.js";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        const getUser = async () => {
            try {
                const result = await axios.get(
                    `${ServerURL}/api/user/current_user`,
                    { withCredentials: true },
                );
                dispatch(setUserData(result.data));
            } catch (error) {
                console.error("Error fetching user:", error);
                dispatch(setUserData(null));
            }
        };
        getUser();
    }, [dispatch]);
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
        </Routes>
    );
}

export default App;
