import { celebrate, Joi } from "celebrate";
import express from "express";
import { StudentsController } from "./controllers/studentController";
import { StudentSchema, UpdateStudentSchema } from "./entities/Student";

const routes = express.Router();

const studentsController = new StudentsController();

routes.get("/ping", (_, res) => res.send("pong"));

routes.get("/students", studentsController.get);
routes.post(
  "/students",
  celebrate({ body: Joi.object().keys(StudentSchema) }),
  studentsController.create
);
routes.put(
  "/students/:id",
  celebrate({ body: Joi.object().keys(UpdateStudentSchema) }),
  studentsController.update
);
routes.delete("/students/:id", studentsController.delete);

export default routes;
