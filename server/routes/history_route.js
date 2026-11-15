import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getHistory } from "../controllers/history_controller.js";

const historyRouter = express.Router();

historyRouter.get("/", isAuth, getHistory);

export default historyRouter;
