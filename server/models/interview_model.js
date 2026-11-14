import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    feedback: { type: String, default: "" },
    score: { type: Number, default: 0, min: 0, max: 10 },
});

const interviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: { type: String, required: true },
        experience: { type: String, required: true },
        mode: {
            type: String,
            enum: ["Technical", "HR"],
            default: "Technical",
        },
        skills: { type: [String], default: [] },
        projects: { type: [String], default: [] },
        resumeText: { type: String, default: "" },
        questions: { type: [questionSchema], default: [] },
        finalScore: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["incomplete", "completed"],
            default: "incomplete",
        },
    },
    { timestamps: true },
);

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
