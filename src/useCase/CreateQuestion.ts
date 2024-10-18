import * as cheerio from 'cheerio';
import { DifficultyQuestion, LawQuestion } from "../entity/question";
import LawQuestionRepository from "../infra/repository/QuestionRepository";
import { ScrapData } from './ScrapSite';

export class CreateQuestion {
    constructor(readonly article: string, readonly getSite: ScrapData, readonly questionRepository: LawQuestionRepository) {}

    public async execute(): Promise<string> {
        const cp = await this.getSite.run();      
        const $ = cheerio.load(cp);
        let law: string[] = [];
        $("p").each((i, item) => {
            const text = $(item).text().replace(/\n/g, " ").replace(/\s+/g, " ").trim(); // Remove quebras de linha e espaços extras
            if (text.includes(`Art. ${this.article}`)) {
                law.push(text);
            }
        });
        const question = LawQuestion.create(law[0], DifficultyQuestion.EASY);
        question.createGapQuestion();
        question.createResponse();
        await this.questionRepository.save(question);
        return question.getId();       
    }
}