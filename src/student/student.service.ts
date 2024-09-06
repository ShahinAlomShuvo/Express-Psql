import pool from "../server";
import bcrypt from "bcrypt";
import config from "../config";

const createStudent = async (
  firstName: string,
  middleName: string | null,
  lastName: string,
  email: string,
  dateOfBirth: string | null,
  fatherName: string,
  fatherOccupation: string | null,
  fatherContactNo: string,
  motherName: string,
  motherOccupation: string | null,
  motherContactNo: string,
  presentAddress: string,
  permanentAddress: string,
  localGuardianName: string,
  localGuardianOccupation: string | null,
  localGuardianContactNo: string,
  localGuardianAddress: string,
  contactNo: string,
  emergencyContactNo: string,
  bloodGroup: string | null,
  password: string,
  gender: string,
  profileImg: string | null
) => {
  const query = `INSERT INTO students 
    (first_name, middle_name, last_name, email, date_of_birth, father_name, father_occupation, father_contact_no, 
     mother_name, mother_occupation, mother_contact_no, present_address, permanent_address, 
     local_guardian_name, local_guardian_occupation, local_guardian_contact_no, local_guardian_address, 
     contact_no, emergency_contact_no, blood_group, password, gender, profile_img)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
    RETURNING *`;

  const hashPassword = await bcrypt.hash(password, Number(config.SALT_ROUNDS));

  return pool.query(query, [
    firstName,
    middleName || null,
    lastName,
    email,
    dateOfBirth || null,
    fatherName,
    fatherOccupation || null,
    fatherContactNo,
    motherName,
    motherOccupation || null,
    motherContactNo,
    presentAddress,
    permanentAddress,
    localGuardianName,
    localGuardianOccupation || null,
    localGuardianContactNo,
    localGuardianAddress,
    contactNo,
    emergencyContactNo,
    bloodGroup || null,
    hashPassword,
    gender,
    profileImg || null,
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

const updateStudentById = async (
  id: number,
  updates: Partial<{
    firstName: string;
    middleName: string | null;
    lastName: string;
    email: string;
    dateOfBirth: string | null;
    fatherName: string;
    fatherOccupation: string | null;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string | null;
    motherContactNo: string;
    presentAddress: string;
    permanentAddress: string;
    localGuardianName: string;
    localGuardianOccupation: string | null;
    localGuardianContactNo: string;
    localGuardianAddress: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup: string | null;
    gender: string;
    profileImg: string | null;
  }>
) => {
  const setString = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const query = `UPDATE students SET ${setString} WHERE id = $${
    Object.keys(updates).length + 1
  } RETURNING *`;

  const values = [...Object.values(updates), id];

  return pool.query(query, values);
};

export const studentService = {
  createStudent,
  isExists,
  getAllStudents,
  getStudentById,
  deleteStudentById,
  updateStudentById,
};
