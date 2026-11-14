import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { ServerURL } from "./config.js";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "./redux/userSlice.js";
import InterviewPage from "./pages/InterviewPage.jsx";

function App() {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.userdata);
    const [checking, setChecking] = useState(true);
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
            } finally {
                setChecking(false);
            }
        };
        getUser();
    }, [dispatch]);
    // wait until we know whether the user is logged in
    if (checking) return null;

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/interview" element={userData ? <InterviewPage /> : <Navigate to="/" state={{ signInRequired: true }} replace />} />
        </Routes>
    );
}

export default App;
