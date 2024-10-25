import { DifficultyQuestion } from "../entity/LawQuestion";
import PenaQuestion from "../entity/PenaQuestion";
import LawQuestionRepository from "../infra/repository/QuestionRepository";
import { ScrapData } from "../services/ScrapLaw";

export default class CreatePenaQuestion {
    constructor (readonly law: string, readonly questionRepository: LawQuestionRepository) {}
   async execute(): Promise<string> {
        if (!this.law || !this.law.length) throw new Error("Not found law");
        const question: PenaQuestion = PenaQuestion.create(this.law, DifficultyQuestion.MEDIUM);
        question.createQuestion();
        question.createResponse();
        await this.questionRepository.save(question);
        return question.getId();
    }
}