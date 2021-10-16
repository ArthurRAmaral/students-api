import { getConnection } from "typeorm";
import { Student } from "../entities/Student";

/**
 * Add new student to list
 * @param student New student
 * @returns new student
 */
function addStudent(student: Student) {
  return getConnection().getRepository(Student).save(student);
}

/**
 * Update an existing student from list
 * @param id Existing student ID
 * @param student Student data
 * @returns new student
 */
async function updateStudent(id: number, body: Student) {
  const student = await getConnection().getRepository(Student).findOne(id);

  if (!student) return;

  Object.assign(student, body);

  const result = await getConnection()
    .getRepository(Student)
    .update(id, student);

  if (result.affected && result.affected > 0) {
    return getConnection().getRepository(Student).findOne(id);
  }
  return;
}

/**
 * Delete an existing student from list
 * @param id Existing student ID
 * @param student Student data
 * @returns new student
 */
async function deleteStudent(id: number): Promise<boolean> {
  const result = await getConnection().getRepository(Student).delete(id);

  return !!result.affected && result.affected > 0;
}

/**
 * Returns student list
 * @returns Students
 */
function getStudents() {
  return getConnection().getRepository(Student).find();
}

export { addStudent, getStudents, updateStudent, deleteStudent };
