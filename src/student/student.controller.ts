import { Request, Response } from "express";
import { studentService } from "./student.service";
import pool from "../server";
const createStudent = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      dateOfBirth,
      fatherName,
      fatherOccupation,
      fatherContactNo,
      motherName,
      motherOccupation,
      motherContactNo,
      presentAddress,
      permanentAddress,
      localGuardianName,
      localGuardianOccupation,
      localGuardianContactNo,
      localGuardianAddress,
      contactNo,
      emergencyContactNo,
      bloodGroup,
      password,
      gender,
      profileImg,
    } = req.body;

    // Check if the student already exists by email
    const isExists = await studentService.isExists(email);
    if (isExists.rows.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    // Create the student
    const result = await studentService.createStudent(
      firstName,
      middleName,
      lastName,
      email,
      dateOfBirth,
      fatherName,
      fatherOccupation,
      fatherContactNo,
      motherName,
      motherOccupation,
      motherContactNo,
      presentAddress,
      permanentAddress,
      localGuardianName,
      localGuardianOccupation,
      localGuardianContactNo,
      localGuardianAddress,
      contactNo,
      emergencyContactNo,
      bloodGroup,
      password,
      gender,
      profileImg
    );

    // Exclude the password from the result
    const { password: _, ...data } = result.rows[0];

    res.status(200).json({
      status: "success",
      message: "Student created successfully",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await studentService.getAllStudents();
    res.status(200).json({
      status: "success",
      message: "Students fetched successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await studentService.getStudentById(id);
    if (result.rows.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Student not found with this id",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Students fetched successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

const deleteStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isExists = await studentService.getStudentById(id);
    if (isExists.rows.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Student not found with this id",
      });
    }
    const result = await studentService.deleteStudentById(id);
    res.status(200).json({
      status: "success",
      message: "Student deleted successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

const updateStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ID
    if (!parseInt(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid student ID",
      });
    }

    // Update the student
    const result = await studentService.updateStudentById(
      parseInt(id),
      updates
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }

    // Exclude the password from the result
    const { password: _, ...data } = result.rows[0];

    res.status(200).json({
      status: "success",
      message: "Student updated successfully",
      data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

export const studentController = {
  createStudent,
  getAllStudents,
  getStudentById,
  deleteStudentById,
  updateStudentById,
};
