import { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { ServerURL } from "../config.js";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

function Step1setup({ onStart }) {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.userdata);
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeText, setResumeText] = useState("");
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState("");

    // Upload the resume and let AI fill in role / experience
    const handleAnalyze = async (file) => {
        if (!file) return;
        setLoading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("resume", file);

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

    // Ask the server to generate the questions, then move to step 2
    const handleStart = async () => {
        if (!role.trim() || !experience.trim()) {
            setError("Please enter your role and experience");
            return;
        }
        setStarting(true);
        setError("");
        try {
            const { data } = await axios.post(
                `${ServerURL}/api/interview/generate-questions`,
                { role, experience, mode, skills, projects, resumeText },
                { withCredentials: true },
            );
            // update the credits shown in the navbar
            dispatch(setUserData({ ...userData, credits: data.credits }));
            onStart({
                role,
                experience,
                mode,
                interviewId: data.interviewId,
                questions: data.questions,
            });
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not start the interview",
            );
        } finally {
            setStarting(false);
        }
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

                    <div className="border hover:border-green-900 border-dashed border-gray-300 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-3">
                            upload your resume (PDF)
                        </p>

                        {/* hidden native input, styled label acts as the button */}
                        <input
                            id="resume-upload"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setResumeFile(file);
                                handleAnalyze(file);
                            }}
                        />
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="resume-upload"
                                className="cursor-pointer px-4 py-2 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-lg text-sm font-medium"
                            >
                                {resumeFile ? "Change file" : "Choose PDF"}
                            </label>
                            <span className="text-sm text-gray-500 truncate">
                                {loading
                                    ? "Reading resume..."
                                    : resumeFile
                                      ? resumeFile.name
                                      : "No file selected"}
                            </span>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handleStart}
                        disabled={loading || starting}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50"
                    >
                        {starting
                            ? "Generating questions..."
                            : "Start Interview"}
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default Step1setup;
