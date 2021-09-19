import * as StudentsDB from "../db/students";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class StudentsController {
  async get(_: Request, res: Response) {
    const students = await StudentsDB.getStudents();

    return res.status(StatusCodes.OK).json(students);
  }

  async create(req: Request, res: Response) {
    const newStudent = await StudentsDB.addStudent(req.body);

    return res.status(StatusCodes.CREATED).json(newStudent);
  }

  async update(req: Request, res: Response) {
    const { id: stringId } = req.params;
    const id = parseInt(stringId);

    if (!id || !req.body.id || (req.body.id && req.body.id !== id))
      return res.status(StatusCodes.BAD_REQUEST).send();

    const updatedStudent = await StudentsDB.updateStudent(id, req.body);

    if (!updatedStudent) return res.status(StatusCodes.NOT_FOUND).send();

    return res.status(StatusCodes.OK).json(updatedStudent);
  }

  async delete(req: Request, res: Response) {
    const { id: stringId } = req.params;
    const id = parseInt(stringId);

    if (!id) return res.status(StatusCodes.BAD_REQUEST).send();

    const studentWasDeleted = await StudentsDB.deleteStudent(id);

    if (!studentWasDeleted) return res.status(StatusCodes.NOT_FOUND).send();

    return res.status(StatusCodes.NO_CONTENT).send();
  }
}
