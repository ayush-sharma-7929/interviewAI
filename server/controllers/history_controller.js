import Interview from "../models/interview_model.js";

// GET /api/history
export const getHistory = async (req, res) => {
    try {
        const interviews = await Interview.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .select("role experience mode questions createdAt");

        const history = interviews.map((interview) => {
            const answered = interview.questions.filter((q) => q.answer);
            const total = answered.reduce((sum, q) => sum + q.score, 0);

            return {
                id: interview._id,
                role: interview.role,
                experience: interview.experience,
                mode: interview.mode,
                createdAt: interview.createdAt,
                totalQuestions: interview.questions.length,
                answeredQuestions: answered.length,
                averageScore: answered.length
                    ? Number((total / answered.length).toFixed(1))
                    : 0,
            };
        });

        res.json(history);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
