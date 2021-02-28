import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {
  /**
   * /answers/{value}?survey={survey_user_id}
   */
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { survey: survey_user_id } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(survey_user_id),
    });

    if (!surveyUser) {
      return response
        .status(400)
        .json({ error: "Survey answered does not exist" });
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController };
