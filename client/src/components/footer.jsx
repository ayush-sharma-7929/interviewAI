import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsRobot } from "react-icons/bs";

function Footer() {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user.userdata);

    return (
        <footer className="w-full bg-gray-200 text-white mt-24">
            <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                    <div
                        className="flex items-center gap-3 cursor-pointer mb-4"
                        onClick={() => navigate("/")}
                    >
                        <div className="bg-black text-white p-2 rounded-lg">
                            <BsRobot size={18} />
                        </div>
                        <h2 className="font-semibold text-black text-lg">
                            InterviewAI
                        </h2>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                        AI-powered mock interviews with instant feedback, so you
                        can walk into the real thing with confidence.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold text-black mb-4">
                        Quick Links
                    </h3>
                    <ul className="flex flex-col gap-2 text-sm text-gray-400">
                        <li>
                            <button
                                onClick={() => navigate("/")}
                                className="hover:text-white"
                            >
                                Home
                            </button>
                        </li>
                        {!userData && (
                            <li>
                                <button
                                    onClick={() => navigate("/auth")}
                                    className="hover:text-white"
                                >
                                    Sign in
                                </button>
                            </li>
                        )}
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-black mb-4">
                        Why InterviewAI
                    </h3>
                    <ul className="flex flex-col gap-2 text-sm text-gray-400">
                        <li>Practice real interview questions</li>
                        <li>Get instant, detailed feedback</li>
                        <li>Track your progress over time</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10">
                <p className="max-w-6xl mx-auto px-6 py-5 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} InterviewAI. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
