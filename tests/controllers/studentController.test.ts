import app from "..";
import supertest from "supertest";

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
});
