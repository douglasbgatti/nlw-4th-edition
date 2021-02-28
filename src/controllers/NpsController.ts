import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
  /**
   * values 1- 10
   * detractors => 0- 6
   * passive => 7 - 8
   * promoters => 9 -10
   *
   * (promoters - detractors) / (number of answers) x 100
   */
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    console.log("survey_id", survey_id);

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysSent = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractors = surveysSent.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;
    const passives = surveysSent.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;
    const promoters = surveysSent.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const totalAnswers = surveysSent.length;

    const npsScore = ((promoters - detractors) / totalAnswers) * 100;

    return response.json({
      detractors,
      passives,
      promoters,
      totalAnswers,
      npsScore,
    });
  }
}

export { NpsController };
