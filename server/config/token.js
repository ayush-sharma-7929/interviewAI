import jwt from "jsonwebtoken";
const generate_Token = async (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
    }
};

export default generate_Token;
