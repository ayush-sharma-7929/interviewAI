import User from "../models/user_model.js";

// GET /api/user/current_user
// Expects an auth middleware to have set req.userId from the JWT cookie.
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res
            .status(500)
            .json({ message: `Get current user error: ${error.message}` });
    }
};
