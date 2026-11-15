import { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import { ServerURL } from "../config.js";

function Step2interview({ interviewData, onFinish }) {
    const { interviewId, questions, role, mode } = interviewData;

    const [current, setCurrent] = useState(0);
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState(null); // { score, feedback } for the current question
    const [results, setResults] = useState([]); // all finished questions
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const question = questions[current];
    const isLast = current === questions.length - 1;

    // Send the answer to the server to be scored by AI
    const handleSubmit = async () => {
        setSubmitting(true);
        setError("");
        try {
            const { data } = await axios.post(
                `${ServerURL}/api/interview/submit-answer`,
                { interviewId, questionId: question._id, answer },
                { withCredentials: true },
            );
            setResult(data);
            setResults((prev) => [
                ...prev,
                {
                    question: question.question,
                    answer,
                    score: data.score,
                    confidence: data.confidence,
                    communication: data.communication,
                    correctness: data.correctness,
                    feedback: data.feedback,
                },
            ]);
        } catch (err) {
            setError(err.response?.data?.message || "Could not submit answer");
        } finally {
            setSubmitting(false);
        }
    };

    const handleNext = () => {
        if (isLast) {
            const total = results.reduce((sum, r) => sum + r.score, 0);
            onFinish({
                role,
                mode,
                results,
                averageScore: (total / results.length).toFixed(1),
            });
            return;
        }
        setCurrent(current + 1);
        setAnswer("");
        setResult(null);
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                {/* header + progress */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {role} · {mode} Interview
                    </h2>
                    <span className="text-sm text-gray-500">
                        Question {current + 1} of {questions.length}
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
                    <div
                        className="h-2 bg-green-600 rounded-full transition-all"
                        style={{
                            width: `${((current + (result ? 1 : 0)) / questions.length) * 100}%`,
                        }}
                    />
                </div>

                {/* the question */}
                <motion.div
                    key={current}
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <p className="text-2xl font-semibold text-gray-800 mb-6">
                        {question.question}
                    </p>

                    <textarea
                        rows={6}
                        placeholder="Type your answer here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={submitting || result}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500 resize-none disabled:bg-gray-50"
                    />
                </motion.div>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

                {/* feedback after submitting */}
                {result && (
                    <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="font-semibold text-green-700 mb-1">
                            Score: {result.score} / 10
                        </p>
                        <p className="text-gray-700 text-sm">
                            {result.feedback}
                        </p>
                    </div>
                )}

                <div className="mt-6">
                    {result ? (
                        <button
                            onClick={handleNext}
                            className="w-full py-3 bg-black text-white rounded-lg font-semibold"
                        >
                            {isLast ? "Finish Interview" : "Next Question"}
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50"
                        >
                            {submitting ? "Evaluating..." : "Submit Answer"}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default Step2interview;
