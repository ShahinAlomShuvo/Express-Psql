import pool from "../server";
import bcrypt from "bcrypt";
import config from "../config";

const createStudent = async (
  name: string,
  email: string,
  dob: string,
  fatherName: string,
  motherName: string,
  presentAddress: string,
  permanentAddress: string,
  age: number,
  password: string,
  isDeleted: boolean,
  gender: string
) => {
  const query = `INSERT INTO students 
    (name, email, dob, fatherName, motherName, presentAddress, permanentAddress, age, password, isDeleted, gender)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;

  const hashPassword = await bcrypt.hash(password, Number(config.SALT_ROUNDS));

  return pool.query(query, [
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
};

const isExists = async (email: string) => {
  const query = "SELECT * FROM students WHERE email = $1";
  return pool.query(query, [email]);
};

const getAllStudents = async () => {
  const query = "SELECT * FROM students";
  return await pool.query(query);
};
const getStudentById = async (id: string) => {
  const query = "SELECT * FROM students WHERE id = $1";
  return await pool.query(query, [id]);
};
const deleteStudentById = async (id: string) => {
  const query = "DELETE FROM students WHERE id = $1 RETURNING *";
  return await pool.query(query, [id]);
};

const updateStudentById = (fieldsToUpdate: string[]) => {
  const setClause = fieldsToUpdate
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  return `UPDATE students SET ${setClause} WHERE id = $${
    fieldsToUpdate.length + 1
  } RETURNING *`;
};

export const studentService = {
  createStudent,
  isExists,
  getAllStudents,
  getStudentById,
  deleteStudentById,
  updateStudentById,
};
