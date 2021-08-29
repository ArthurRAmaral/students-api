import { Student } from "../types/Student";

const students: Student[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    city: "Belo Horizonte",
    birth: new Date("11/13/1999"),
  },
];

/**
 * Add new student to list
 * @param student New student
 * @returns new student
 */
function addStudent(student: Student) {
  const newStudent = {
    id: students.length ? students[students.length - 1].id! + 1 : 1,
    ...student,
  };
  students.push(newStudent);
  return Promise.resolve(newStudent);
}

/**
 * Update an existing student from list
 * @param id Existing student ID
 * @param student Student data
 * @returns new student
 */
function updateStudent(id: number, body: Student) {
  const student = students.find((student) => student.id === id);

  if (!student) return Promise.resolve(null);

  Object.assign(student, body);

  return Promise.resolve(student);
}

/**
 * Delete an existing student from list
 * @param id Existing student ID
 * @param student Student data
 * @returns new student
 */
function deleteStudent(id: number): Promise<boolean> {
  const studentIndex = students.findIndex((student) => student.id === id);

  if (studentIndex < 0) return Promise.resolve(false);

  const removedUsers = students.splice(studentIndex, 1);

  return Promise.resolve(removedUsers.length > 0);
}

/**
 * Returns student list
 * @returns Students
 */
const getStudents = () => Promise.resolve(Object.freeze([...students]));

export { addStudent, getStudents, updateStudent, deleteStudent };
