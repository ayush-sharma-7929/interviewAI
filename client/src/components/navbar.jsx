import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { BsRobot, BsCoin } from "react-icons/bs";
import { ServerURL } from "../config.js";
import { setUserData } from "../redux/userSlice.js";

function Navbar() {
    const userData = useSelector((state) => state.user.userdata);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.get(`${ServerURL}/api/auth/logout`, {
                withCredentials: true,
            });
            dispatch(setUserData(null));
            setShowMenu(false);
            navigate("/auth");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="w-full bg-[#f3f3f3] flex justify-center px-4 pt-6">
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full max-w-6xl bg-white rounded-[24px] shadow-md border border-gray-200 px-8 py-4 flex items-center justify-between relative"
            >
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <div className="bg-black text-white p-2 rounded-lg">
                        <BsRobot size={18} />
                    </div>
                    <h1 className="font-semibold text-lg hidden md:block">
                        InterviewAI
                    </h1>
                </div>

                <div className="flex items-center gap-4 relative">
                    {userData ? (
                        <>
                            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
                                <BsCoin size={16} />
                                {userData.credits ?? 0}
                            </div>

                            <button
                                onClick={() => setShowMenu((prev) => !prev)}
                                className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold"
                                aria-label="Open user menu"
                            >
                                {userData.name?.charAt(0).toUpperCase()}
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-12 w-48 bg-white shadow-xl border border-gray-200 rounded-xl p-3 z-50">
                                    <p className="text-sm font-medium truncate mb-2">
                                        {userData.name}
                                    </p>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left text-sm text-red-500 hover:bg-gray-50 rounded-lg px-2 py-1"
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <motion.button
                            whileHover={{ opacity: 0.9, scale: 1.03 }}
                            whileTap={{ opacity: 0.8, scale: 0.98 }}
                            onClick={() => navigate("/auth")}
                            className="px-5 py-2 bg-black text-white rounded-full text-sm font-medium shadow-md"
                        >
                            Sign in
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default Navbar;
