import LawQuestionRepository from "../infra/repository/QuestionRepository";

export default class AnswerPenaQuestion {
    constructor (
        readonly questionId: string, 
        readonly answer: string, 
        readonly questionRepository: LawQuestionRepository
    ) {}
    
    public async execute(): Promise<boolean> {       
        const question = await this.questionRepository.getById(this.questionId);
        return question.getResponse().trim().toLowerCase() === this.answer.trim().toLowerCase();
    }
}