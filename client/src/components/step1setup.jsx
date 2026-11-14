import { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { ServerURL } from "../config.js";

function Step1setup({ onStart }) {
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeText, setResumeText] = useState("");
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Upload the resume and let AI fill in role / experience
    const handleAnalyze = async () => {
        if (!resumeFile) return;
        setLoading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("resume", resumeFile);

            const { data } = await axios.post(
                `${ServerURL}/api/interview/resume`,
                formData,
                { withCredentials: true },
            );

            setRole(data.role || "");
            setExperience(data.experience || "");
            setSkills(data.skills || []);
            setProjects(data.projects || []);
            setResumeText(data.resumeText || "");
        } catch (err) {
            setError(err.response?.data?.message || "Could not analyze resume");
        } finally {
            setLoading(false);
        }
    };

    const handleStart = () => {
        if (!role.trim() || !experience.trim()) {
            setError("Please enter your role and experience");
            return;
        }
        onStart({ role, experience, mode, skills, projects, resumeText });
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        Start Your AI Interview
                    </h2>
                    <p className="text-gray-600">
                        Practice real interview scenarios powered by AI. Improve
                        communication, technical skills, and confidence.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="p-12 flex flex-col gap-4"
                >
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Interview Setup
                    </h3>

                    <input
                        type="text"
                        placeholder="Role (e.g. Frontend Developer)"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
                    />

                    <input
                        type="text"
                        placeholder="Experience (e.g. 2 years)"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
                    />

                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500"
                    >
                        <option>Technical</option>
                        <option>HR</option>
                    </select>

                    <div className="border border-dashed border-gray-300 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">
                            Optional: upload your resume (PDF)
                        </p>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setResumeFile(e.target.files[0])}
                        />
                        {resumeFile && (
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50"
                            >
                                {loading ? "Analyzing..." : "Analyze Resume"}
                            </button>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handleStart}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                    >
                        Start Interview
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default Step1setup;
