import User from "../models/user_model.js";
import generate_Token from "../config/token.js";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days, matches the token expiry in config/token.js

const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

// POST /api/auth/google  { name, email }
// Finds the user by email (or creates one) and sets a JWT cookie.
export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res
                .status(400)
                .json({ message: "Name and email are required" });
        }

        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            user = await User.create({ name, email: email.toLowerCase() });
        }

        const token = await generate_Token(user._id);
        if (!token) {
            return res
                .status(500)
                .json({ message: "Could not generate auth token" });
        }

        res.cookie(COOKIE_NAME, token, {
            ...cookieOptions(),
            maxAge: COOKIE_MAX_AGE,
        });

        return res.status(200).json(user);
    } catch (error) {
        return res
            .status(500)
            .json({ message: `Google auth error: ${error.message}` });
    }
};

export const logout = async (req, res) => {
    try {
        await res.clearCookie(COOKIE_NAME, cookieOptions());
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: `Logout error: ${error.message}` });
    }
};
