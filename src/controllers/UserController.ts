import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from "yup";

class UserController {
  static async validate(values: any) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });

    await schema.validate(values, { abortEarly: false });
  }

  async create(request: Request, response: Response) {
    try {
      await UserController.validate(request.body);
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error });
    }

    const { name, email } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({
      email,
    });

    if (userAlreadyExists) {
      return response.status(400).json({ message: "user already exists" });
    }

    const user = usersRepository.create({ name, email });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}

export { UserController };
