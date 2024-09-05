import express from "express";
import { studentController } from "./student.controller";
const router = express.Router();

router.post("/create-student", studentController.createStudent);

router.get("/all-students", studentController.getAllStudents);

router.get("/get-student-by-id/:id", studentController.getStudentById);

router.put("/update-student-by-id/:id", studentController.updateStudentById);

router.delete("/delete-student-by-id/:id", studentController.deleteStudentById);

export const studentRoute = router;
