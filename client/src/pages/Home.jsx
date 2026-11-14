import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { IoSparkles } from "react-icons/io5";
import { BsMic, BsBarChart, BsFileEarmarkText } from "react-icons/bs";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";

const features = [
    {
        icon: <BsMic size={22} />,
        title: "Practice Real Interviews",
        path: "/interview",
        text: "Answer AI-generated questions tailored to your role and experience level.",
    },
    {
        icon: <BsFileEarmarkText size={22} />,
        title: "Instant Feedback",
        text: "Get clear feedback on every answer so you know exactly what to improve.",
    },
    {
        icon: <BsBarChart size={22} />,
        title: "Track Your Progress",
        text: "See detailed performance insights and watch your skills grow over time.",
    },
];

function Home() {
    const userData = useSelector((state) => state.user.userdata);
    const navigate = useNavigate();
    const location = useLocation();
    const [clicked, setClicked] = useState(false);

    // popup shows after a redirect from /interview, or after a click while signed out
    const showAlert = clicked || location.state?.signInRequired;

    useEffect(() => {
        if (!showAlert) return;
        const timer = setTimeout(() => {
            setClicked(false);
            navigate("/", { replace: true, state: null });
        }, 3000);
        return () => clearTimeout(timer);
    }, [showAlert, navigate]);

    const handleFeatureClick = (path) => {
        if (!path) return;
        if (!userData) return setClicked(true);
        navigate(path);
    };

    return (
        <div className="w-full min-h-screen bg-[#f3f3f3] flex flex-col">
            <Navbar />

            {showAlert && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg font-medium">
                    Sign in before starting the interview
                </div>
            )}

            <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-20">
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex flex-col items-center text-center"
                >
                    <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full inline-flex items-center gap-2 text-sm font-medium mb-6">
                        <IoSparkles size={16} /> AI Smart Interview
                    </span>

                    <h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-3xl">
                        Ace your next interview with{" "}
                        <span className="text-green-600">InterviewAI</span>
                    </h1>

                    <p className="text-gray-500 text-base md:text-lg max-w-2xl mt-6 leading-relaxed">
                        Practice with AI-powered mock interviews, get instant
                        feedback and track your progress to walk into the real
                        thing with confidence.
                    </p>

                    {userData ? (
                        <>
                            <p className="mt-10 text-lg font-medium">
                                Welcome back, {userData.name}!
                            </p>
                            <button
                                className="mt-4 px-8 py-3 bg-black text-white rounded-full shadow-md font-medium"
                                onClick={() => navigate("/history")}
                            >
                                View History
                            </button>
                        </>
                    ) : (
                        <motion.button
                            whileHover={{ opacity: 0.9, scale: 1.03 }}
                            whileTap={{ opacity: 0.8, scale: 0.98 }}
                            onClick={() => navigate("/auth")}
                            className="mt-10 px-8 py-3 bg-black text-white rounded-full shadow-md font-medium"
                        >
                            Get Started
                        </motion.button>
                    )}
                </motion.section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.1 * index,
                                ease: "easeInOut",
                            }}
                            onClick={() => handleFeatureClick(feature.path)}
                            className={`bg-white rounded-3xl border border-gray-200 shadow-md p-8 ${
                                feature.path ? "cursor-pointer hover:shadow-lg" : ""
                            }`}
                        >
                            <div className="bg-black text-white w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                                {feature.icon}
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {feature.text}
                            </p>
                        </motion.div>
                    ))}
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Home;
