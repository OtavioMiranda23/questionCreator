import * as cheerio from 'cheerio';
import { DifficultyQuestion } from "../entity/LawQuestion";
import LawQuestionRepository from "../infra/repository/QuestionRepository";
import { ScrapData } from '../services/ScrapLaw';
import { GapQuestion } from '../entity/GapQuestion';

export class CreateQuestion {
    constructor(readonly law: string, readonly questionRepository: LawQuestionRepository) {}

    public async execute(): Promise<string> {
        if (!this.law || !this.law.length) throw new Error("Not found law");
        const question = GapQuestion.create(this.law, DifficultyQuestion.EASY);
        question.createQuestion();
        question.createResponse();
        await this.questionRepository.save(question);
        return question.getId();       
    }
}