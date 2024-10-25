import { GapQuestion } from "./GapQuestion";
import { DifficultyQuestion, LawQuestion } from "./LawQuestion"
import Article from "./ValueObjects/Article";
import Law from "./ValueObjects/Law";
import UUID from "./ValueObjects/UUID";

export default class PenaQuestion extends LawQuestion {
    constructor (
        id: string, 
        law: string, 
        question: string,
        response: string,
        difficulty: DifficultyQuestion,
        article: string, 
        errorRate: number, 
        successRate: number, 
    ) {
        super(id, law,question,response, difficulty, article, errorRate, successRate,) 
    }

    static create (law: string, difficulty: DifficultyQuestion) {
        const uuid = UUID.create().getValue();
        const lawVO = Law.create(law).getValue();
        return new PenaQuestion(uuid, lawVO, "", "", difficulty, Article.create(law).getValue(), 0, 0);
    }
    createQuestion() {
        const regexVerbs =  /\b(reclusão|detenção)\b/gi;
        const match = this.law.getValue().match(regexVerbs);        
        if (!match) throw new Error("Regex verbs not match");
        const question  = this.law.getValue().replace(match[0], "_____");        
        this.question = `Complete a lacuna com uma das opções:\n${question}`;
    }

    createResponse () {
        const regexPena =  /\b(reclusão|detenção)\b/gi;
        const match = this.law.getValue().match(regexPena);
        if (!match) throw new Error("Pena not match");
        this.response = match[0].trim();
    }
}