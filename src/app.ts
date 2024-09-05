import express from "express";
import { studentRoute } from "./student/student.route";
const app = express();

app.use(express.json());

app.use("/api/v1/students", studentRoute);

app.get("/", (req, res) => {
  res.send("Welcome to express-psql server");
});

export default app;
