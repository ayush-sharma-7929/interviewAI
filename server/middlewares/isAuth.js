import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        let { token } = req.cookies;
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized: No token provided" });
        }
        const verify_token = jwt.verify(token, process.env.JWT_SECRET);

        if (!verify_token) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Invalid token" });
        }
        req.userId = verify_token.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
export default isAuth;
