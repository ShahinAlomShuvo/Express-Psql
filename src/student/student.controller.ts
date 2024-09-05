import { Request, Response } from "express";
import { studentService } from "./student.service";
import pool from "../server";
import bcrypt from "bcrypt";
import config from "../config";
const createStudent = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      dob,
      fatherName,
      motherName,
      presentAddress,
      permanentAddress,
      age,
      password,
      isDeleted,
      gender,
    } = req.body;

    const isExists = await pool.query(studentService.isExists, [email]);
    if (isExists.rows.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(
      password,
      Number(config.SALT_ROUNDS)
    );

    const result = await pool.query(studentService.createStudent, [
      name,
      email,
      dob,
      fatherName,
      motherName,
      presentAddress,
      permanentAddress,
      age,
      hashPassword,
      isDeleted,
      gender,
    ]);

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
    const result = await pool.query(studentService.getAllStudents);
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
    const result = await pool.query(studentService.getStudentById, [id]);
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
    const isExists = await pool.query(studentService.getStudentById, [id]);
    if (isExists.rows.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Student not found with this id",
      });
    }
    const result = await pool.query(studentService.deleteStudentById, [id]);
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

// const updateStudentById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const {
//       name,
//       email,
//       dob,
//       fatherName,
//       motherName,
//       presentAddress,
//       permanentAddress,
//       age,
//       gender,
//     } = req.body;
//     const isExists = await pool.query(studentService.getStudentById, [id]);
//     if (isExists.rows.length === 0) {
//       return res.status(400).json({
//         status: "error",
//         message: "Student not found with this id",
//       });
//     }
//     const result = await pool.query(studentService.updateStudentById, [
//       name,
//       email,
//       dob,
//       fatherName,
//       motherName,
//       presentAddress,
//       permanentAddress,
//       age,
//       gender,
//       id,
//     ]);
//     res.status(200).json({
//       status: "success",
//       message: "Student updated successfully",
//       data: result.rows,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       status: "error",
//       message: error.message || "Something went wrong",
//       error: error,
//     });
//   }
// };

const updateStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fieldsToUpdate = req.body;

    const allowedFields = [
      "name",
      "email",
      "dob",
      "fatherName",
      "motherName",
      "presentAddress",
      "permanentAddress",
      "age",
      "gender",
    ];

    // Filter fields that are allowed and present in the request
    const validFields = Object.keys(fieldsToUpdate).filter((field) =>
      allowedFields.includes(field)
    );

    if (validFields.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No valid fields provided for update",
      });
    }

    // Check if the student exists
    const isExists = await pool.query(studentService.getStudentById, [id]);
    if (isExists.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Student not found with this id",
      });
    }

    // Dynamically generate the update query based on valid fields
    const updateQuery = studentService.updateStudentById(validFields);
    const values = validFields.map((field) => fieldsToUpdate[field]);
    values.push(id); // Add the ID for the WHERE clause

    // Perform the update
    const result = await pool.query(updateQuery, values);

    res.status(200).json({
      status: "success",
      message: "Student updated successfully",
      data: result.rows[0],
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
