const createStudent = `INSERT INTO students (name, email, dob, fatherName, motherName, presentAddress, permanentAddress, age, password, isDeleted, gender)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;

const isExists = "SELECT * FROM students WHERE email = $1";

const getAllStudents = "SELECT * FROM students";
const getStudentById = "SELECT * FROM students WHERE id = $1";
const deleteStudentById = "DELETE FROM students WHERE id = $1";

// const updateStudentById =
//   "UPDATE students SET name = $1, email = $2, dob = $3, fatherName = $4, motherName = $5, presentAddress = $6, permanentAddress = $7, age = $8,  gender = $9 WHERE id = $10 RETURNING *";

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
