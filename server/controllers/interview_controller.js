import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askGemini } from "../services/gemini_service.js";
import Interview from "../models/interview_model.js";
import User from "../models/user_model.js";

const INTERVIEW_COST = 20; // credits taken for each interview
export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume required" });
        }
        const filepath = req.file.path;
        const filebuffer = await fs.promises.readFile(filepath);
        const uint8Array = new Uint8Array(filebuffer);

        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        let resumeText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();

            const pageText = content.items.map((item) => item.str).join(" ");
            resumeText += pageText + "\n";
        }
        resumeText = resumeText.replace(/\s+/g, " ").trim();

        const prompt = `Extract structured data from this resume.

Return strictly JSON, with no extra text:

{
    "role": "string",
    "experience": "string",
    "projects": ["project1", "project2"],
    "skills": ["skill1", "skill2"]
}

Resume:
${resumeText}`;

        const aiResponse = await askGemini(prompt);

        const parsed = JSON.parse(aiResponse.replace(/```json|```/g, "").trim());

        fs.unlinkSync(filepath);

        res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText,
        });
    } catch (error) {
        console.log(error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
};

// POST /api/interview/generate-questions
export const generateQuestion = async (req, res) => {
    try {
        const {
            role,
            experience,
            mode = "Technical",
            skills = [],
            projects = [],
            resumeText = "",
        } = req.body;

        if (!role?.trim() || !experience?.trim()) {
            return res
                .status(400)
                .json({ message: "Role and experience are required" });
        }

        // stop early if the user cannot afford an interview
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.credits < INTERVIEW_COST) {
            return res.status(400).json({
                message: `Not enough credits. An interview costs ${INTERVIEW_COST} credits.`,
            });
        }

        const prompt = `You are an interviewer. Generate exactly 5 ${mode} interview questions
for a candidate applying as "${role}" with ${experience} of experience.
${skills.length ? `Skills: ${skills.join(", ")}` : ""}
${projects.length ? `Projects: ${projects.join(", ")}` : ""}
${resumeText ? `Resume: ${resumeText.slice(0, 4000)}` : ""}

Order them from easy to hard. Each question must be one clear sentence.
Return strictly a JSON array of 5 strings, with no extra text.`;

        const aiResponse = await askGemini(prompt);
        const questions = JSON.parse(
            aiResponse.replace(/```json|```/g, "").trim(),
        );

        if (!Array.isArray(questions) || questions.length === 0) {
            return res
                .status(500)
                .json({ message: "AI did not return any questions" });
        }

        const interview = await Interview.create({
            userId: req.userId,
            role,
            experience,
            mode,
            skills,
            projects,
            resumeText,
            questions: questions.map((q) => ({ question: String(q) })),
        });

        // take the credits only after the questions were created successfully
        // ($gte in the filter keeps credits from going below zero)
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.userId, credits: { $gte: INTERVIEW_COST } },
            { $inc: { credits: -INTERVIEW_COST } },
            { new: true },
        );
        if (!updatedUser) {
            await Interview.findByIdAndDelete(interview._id);
            return res.status(400).json({
                message: `Not enough credits. An interview costs ${INTERVIEW_COST} credits.`,
            });
        }

        res.json({
            interviewId: interview._id,
            questions: interview.questions,
            credits: updatedUser.credits,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// POST /api/interview/submit-answer
export const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionId, answer } = req.body;

        if (!interviewId || !questionId) {
            return res
                .status(400)
                .json({ message: "interviewId and questionId are required" });
        }

        // only the owner of the interview can answer it
        const interview = await Interview.findOne({
            _id: interviewId,
            userId: req.userId,
        });
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        const question = interview.questions.id(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const userAnswer = (answer || "").trim();

        // no answer given, so no need to ask the AI
        if (!userAnswer) {
            question.answer = "";
            question.score = 0;
            question.feedback = "No answer was given.";
        } else {
            const prompt = `You are an interviewer for the role "${interview.role}" (${interview.mode} interview, ${interview.experience} of experience).

Question: ${question.question}
Candidate's answer: ${userAnswer}

Score the answer from 0 to 10 and give short, helpful feedback (2-3 sentences).
Also rate confidence, communication and correctness, each from 0 to 10.
Return strictly JSON, with no extra text:
{"score": 0, "confidence": 0, "communication": 0, "correctness": 0, "feedback": "string"}`;

            const aiResponse = await askGemini(prompt);
            const result = JSON.parse(
                aiResponse.replace(/```json|```/g, "").trim(),
            );

            question.answer = userAnswer;
            const clamp = (n) => Math.max(0, Math.min(10, Number(n) || 0));
            question.score = clamp(result.score);
            question.confidence = clamp(result.confidence);
            question.communication = clamp(result.communication);
            question.correctness = clamp(result.correctness);
            question.feedback = String(result.feedback || "");
        }

        await interview.save();

        res.json({
            score: question.score,
            confidence: question.confidence,
            communication: question.communication,
            correctness: question.correctness,
            feedback: question.feedback,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
