import app from "..";
import supertest from "supertest";
import { Student } from "../../src/entities/Student";

const students: Student[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    city: "Belo Horizonte",
    birth: new Date("11/13/1999"),
  },
];

jest.mock("../../src/db/students.ts", () => {
  const originalModule = jest.requireActual("../../src/db/students.ts");

  return {
    ...originalModule,
    addStudent: (student: Student) => {
      const newStudent = {
        id: students.length ? students[students.length - 1].id! + 1 : 1,
        ...student,
      };
      students.push(newStudent);
      return Promise.resolve(newStudent);
    },
    updateStudent: (id: number, body: Student) => {
      const student = students.find((student) => student.id === id);

      if (!student) return Promise.resolve(null);

      Object.assign(student, body);

      return Promise.resolve(student);
    },
    deleteStudent: (id: number): Promise<boolean> => {
      const studentIndex = students.findIndex((student) => student.id === id);

      if (studentIndex < 0) return Promise.resolve(false);

      const removedUsers = students.splice(studentIndex, 1);

      return Promise.resolve(removedUsers.length > 0);
    },
    getStudents: () => Promise.resolve(Object.freeze([...students])),
  };
});

describe("Test student requests", () => {
  it("should return the example student", async () => {
    await supertest(app)
      .get("/students")
      .expect(200)
      .then((res) =>
        expect(res.body).toMatchObject([
          {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            city: "Belo Horizonte",
            birth: new Date("11/13/1999").toISOString(),
          },
        ])
      );
  });

  it("should create a new student", async () => {
    const newStudent = {
      name: "John Doe 2",
      email: "john.doe.2@example.com",
      city: "Belo Horizonte",
      birth: new Date("11/13/1999").toISOString(),
    };

    await supertest(app)
      .post("/students")
      .send(newStudent)
      .then((res) => expect(res.body).toMatchObject({ id: 2, ...newStudent }));
  });

  it("should return the example student if body's student doesn't exist", async () => {
    const updatedStudent = {
      id: 1,
    };

    await supertest(app)
      .put(`/students/${updatedStudent.id}`)
      .send(updatedStudent)
      .then((res) =>
        expect(res.body).toStrictEqual({
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          city: "Belo Horizonte",
          birth: new Date("11/13/1999").toISOString(),
        })
      );
  });

  it("should update a student", async () => {
    const updatedStudent = {
      id: 1,
      name: "John Doe Update",
      email: "john.doe.update@example.com",
      city: "Belo Horizonte",
      birth: new Date("11/13/1999").toISOString(),
    };

    await supertest(app)
      .put(`/students/${updatedStudent.id}`)
      .send(updatedStudent)
      .then((res) => expect(res.body).toMatchObject({ ...updatedStudent }));
  });

  it("should return 404 if student doesn't exist", async () => {
    const updatedStudent = {
      id: -1,
      name: "John Doe Update",
      email: "john.doe.update@example.com",
      city: "Belo Horizonte",
      birth: new Date("11/13/1999").toISOString(),
    };

    await supertest(app)
      .put(`/students/${updatedStudent.id}`)
      .send(updatedStudent)
      .then((res) => expect(res.status).toBe(404));
  });

  it("should return 400 if body's id doesn't exist", async () => {
    const updatedStudent = {
      name: "John Doe Update",
      email: "john.doe.update@example.com",
      city: "Belo Horizonte",
      birth: new Date("11/13/1999").toISOString(),
    };

    await supertest(app)
      .put(`/students/1`)
      .send(updatedStudent)
      .then((res) => expect(res.status).toBe(400));
  });

  it("should return 400 if body's id is different than url's id", async () => {
    const updatedStudent = {
      id: 1,
      name: "John Doe Update",
      email: "john.doe.update@example.com",
      city: "Belo Horizonte",
      birth: new Date("11/13/1999").toISOString(),
    };

    await supertest(app)
      .put(`/students/2`)
      .send(updatedStudent)
      .then((res) => expect(res.status).toBe(400));
  });

  it("should return 400 if the query id doesn't exist", async () => {
    await supertest(app)
      .delete(`/students/0`)
      .then((res) => expect(res.status).toBe(400));
  });

  it("should return 400 if the query id isn't a number", async () => {
    await supertest(app)
      .delete(`/students/shulambs`)
      .then((res) => expect(res.status).toBe(400));
  });

  it("should return 204 if the student is successfully deleted", async () => {
    const id = 1;

    await supertest(app)
      .delete(`/students/${id}`)
      .then((res) => expect(res.status).toBe(204));
  });

  it("should return 404 if the student doesn't exists", async () => {
    const id = -1;

    await supertest(app)
      .delete(`/students/${id}`)
      .then((res) => expect(res.status).toBe(404));
  });
});
