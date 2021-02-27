import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) {
      return response.status(400).json({ error: "User does not exist" });
    }

    const survey = await surveysRepository.findOne({ id: survey_id });

    if (!survey) {
      return response.status(400).json({ error: "Survey does not exist" });
    }

    let surveyUser = await surveysUsersRepository.findOne({
      where: [{ user_id: user.id, survey_id, value: null }],
      relations: ["user", "survey"],
    });

    if (!surveyUser) {
      surveyUser = surveysUsersRepository.create({
        user_id: user.id,
        survey_id: survey.id,
      });

      surveyUser = await surveysUsersRepository.save(surveyUser);
    }

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      survey_user_id: surveyUser.id,
      link: `${process.env.API_URL}/answers`,
    };

    const mailProperties: MailProperties = {
      to: email,
      subject: survey.title,
      body: survey.description,
      variables,
      templatePath: ["..", "views", "emails", "npsMail.hbs"],
    };
    await SendMailService.execute(mailProperties);

    return response.json(surveyUser);
  }
}

export { SendMailController };
