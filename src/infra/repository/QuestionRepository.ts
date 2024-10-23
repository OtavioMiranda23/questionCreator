import DatabaseConnection from "../../database/DatabaseConnection";
import { GapQuestion } from "../../entity/GapQuestion";
import { LawQuestion } from "../../entity/LawQuestion";

export default interface LawQuestionRepository {
    save (question: GapQuestion): Promise<void>;
    getById (id: string): Promise<LawQuestion>;
}

export class LawQuestionDatabase implements LawQuestionRepository {
    constructor (readonly connection: DatabaseConnection) {
    }
    
    public async save(question: LawQuestion): Promise<void> {
        await this.connection?.query(
            "insert into ccca.question (question_id, question, response, difficulty, article, error_rate, success_rate) values ($1, $2, $3, $4, $5, $6, $7)", [
            question.getId(), question.getQuestion(), question.getResponse(), question.getDifficulty(), question.getArticle(), question.getErrorRate(), question.getSuccessRate()
        ]);        
    }
    
    public async getById(id: string): Promise<GapQuestion> {
        const [question] = await this.connection?.query(
            "SELECT * FROM ccca.question WHERE question_id = $1", [id]);
        if (!question) throw new Error("Question not found");
        return new GapQuestion(question.question_id, question.law, question.question, question.response, question.difficulty, question.article,question.error_rate, question.success_rate);	
    }
}