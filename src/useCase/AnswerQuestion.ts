import LawQuestionRepository from "../infra/repository/QuestionRepository";

export default class AnswerQuestion {
    constructor (
        readonly questionId: string, 
        readonly answer: string, 
        readonly questionRepository: LawQuestionRepository
    ) {}
    
    public async execute(): Promise<boolean> {
        console.log(this.questionId);
        
        const question = await this.questionRepository.getById(this.questionId);
        return question.getResponse() === this.answer.trim();
    }
}