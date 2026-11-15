import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { ServerURL } from "../config.js";

function History() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getHistory = async () => {
            try {
                const { data } = await axios.get(
                    `${ServerURL}/api/history`,
                    { withCredentials: true },
                );
                setHistory(data);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Could not load history",
                );
            } finally {
                setLoading(false);
            }
        };
        getHistory();
    }, []);

    // color of the score badge
    const scoreColor = (score) =>
        score >= 7
            ? "bg-green-100 text-green-700"
            : score >= 4
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700";

    return (
        <motion.div
            className="min-h-screen bg-[#f3f3f3] px-4 md:px-8 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-4xl mx-auto">
                {/* header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate("/")}
                        className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100"
                    >
                        <FaArrowLeft size={14} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Interview History
                        </h1>
                        <p className="text-sm text-gray-500">
                            All the interviews you have taken
                        </p>
                    </div>
                </div>

                {loading && <p className="text-gray-500">Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && history.length === 0 && (
                    <div className="bg-white rounded-2xl shadow p-10 text-center">
                        <p className="text-gray-600 mb-4">
                            You haven&apos;t taken any interviews yet.
                        </p>
                        <button
                            onClick={() => navigate("/interview")}
                            className="px-6 py-2 bg-black text-white rounded-full font-medium"
                        >
                            Start your first interview
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {history.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.05 * index }}
                            className="bg-white rounded-2xl shadow p-6 flex items-center justify-between gap-4"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800 text-lg">
                                    {item.role}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {item.mode} · {item.experience}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(item.createdAt).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        },
                                    )}{" "}
                                    · {item.answeredQuestions} /{" "}
                                    {item.totalQuestions} answered
                                </p>
                            </div>

                            <span
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold ${scoreColor(item.averageScore)}`}
                            >
                                {item.averageScore} / 10
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default History;
