import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const average = (list, key) =>
    list.length ? list.reduce((sum, r) => sum + (r[key] || 0), 0) / list.length : 0;

// short message under the overall score
const getSummary = (score) => {
    if (score >= 8)
        return { title: "Excellent performance!", text: "You are interview ready." };
    if (score >= 6)
        return { title: "Good job!", text: "A little more practice will make it great." };
    if (score >= 4)
        return { title: "Needs improvement.", text: "Work on clarity and depth in your answers." };
    return {
        title: "Significant improvement required.",
        text: "Work on clarity and confidence.",
    };
};

// circular score meter
function ScoreCircle({ score }) {
    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 10) * circumference;

    return (
        <div className="relative w-36 h-36">
            <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-green-600">
                {score.toFixed(1)}
            </span>
        </div>
    );
}

// area chart of the score of each question
function TrendChart({ scores }) {
    const data = scores.map((score, i) => ({ name: `Q${i + 1}`, score }));

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <YAxis
                        domain={[0, 10]}
                        ticks={[0, 3, 6, 10]}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                    />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#16a34a"
                        strokeWidth={2}
                        fill="#16a34a"
                        fillOpacity={0.15}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function Step3report({ report }) {
    const navigate = useNavigate();
    const results = report?.results || [];
    const overall = Number(report?.averageScore) || 0;
    const summary = getSummary(overall);

    const skills = [
        { label: "Confidence", value: average(results, "confidence") },
        { label: "Communication", value: average(results, "communication") },
        { label: "Correctness", value: average(results, "correctness") },
    ];

    return (
        <motion.div
            className="min-h-screen bg-[#f3f7f5] px-4 md:px-8 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-7xl mx-auto">
                {/* header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 print:hidden"
                        >
                            <FaArrowLeft size={14} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Interview Analytics Dashboard
                            </h1>
                            <p className="text-sm text-gray-500">
                                AI-powered performance insights
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow print:hidden"
                    >
                        Download PDF
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* left column */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center">
                            <p className="text-sm text-gray-500 mb-4">Overall Performance</p>
                            <ScoreCircle score={overall} />
                            <p className="text-xs text-gray-500 mt-2">Out of 10</p>
                            <p className="font-semibold text-gray-800 mt-4 text-sm">
                                {summary.title}
                            </p>
                            <p className="text-xs text-gray-500">{summary.text}</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow p-6">
                            <h3 className="font-semibold text-gray-800 mb-5">
                                Skill Evaluation
                            </h3>
                            <div className="flex flex-col gap-4">
                                {skills.map((skill) => (
                                    <div key={skill.label}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700">{skill.label}</span>
                                            <span className="font-semibold text-green-600">
                                                {skill.value.toFixed(1)}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                            <div
                                                className="h-2 bg-green-500 rounded-full"
                                                style={{ width: `${skill.value * 10}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* right column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl shadow p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Performance Trend
                            </h3>
                            {results.length > 0 ? (
                                <TrendChart scores={results.map((r) => r.score)} />
                            ) : (
                                <p className="text-sm text-gray-500">No answers yet.</p>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl shadow p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Question Breakdown
                            </h3>
                            <div className="flex flex-col gap-4">
                                {results.map((r, i) => (
                                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xs text-gray-400">Question {i + 1}</p>
                                                <p className="font-semibold text-gray-800 text-sm">
                                                    {r.question}
                                                </p>
                                            </div>
                                            <span className="shrink-0 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                {r.score} / 10
                                            </span>
                                        </div>
                                        <div className="mt-3 bg-green-50 border border-green-100 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-green-700 mb-1">
                                                AI Feedback
                                            </p>
                                            <p className="text-sm text-gray-700">{r.feedback}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-8 print:hidden">
                    <button
                        onClick={() => navigate("/")}
                        className="px-10 py-3 bg-black text-white rounded-full font-semibold shadow-md hover:opacity-90"
                    >
                        Finish Interview
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default Step3report;
