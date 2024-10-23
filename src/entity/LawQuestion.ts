import axios from 'axios';
import UUID from './ValueObjects/UUID';
import Law from './ValueObjects/Law';
import Article from './ValueObjects/Article';

export enum DifficultyQuestion {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
} 

export abstract class LawQuestion {
    protected id: UUID;
    protected law: Law;
    protected question: string;
    protected response: string;
    protected difficulty: DifficultyQuestion;
    protected article: Article;
    protected errorRate: number;
    protected successRate: number;

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
        this.id = new UUID(id);
        this.law = new Law(law);
        this.question = question;
        this.response = response;
        this.difficulty = difficulty;
        this.article = new Article(article);
        this.errorRate = errorRate;
        this.successRate = successRate;
    }

    abstract createQuestion(): void;

    abstract createResponse(): void;

    public getId(): string {
        return this.id.getValue();
    }
    public getQuestion (): string {
        return this.question;
    }

    public getArticle(): string {
        return this.article.getValue();
    }

    public getResponse (): string {
        return this.response;
    }

    public getDifficulty(): string {
        return this.difficulty;
    }

    public getErrorRate(): number {
        return this.errorRate;
    }

    public getSuccessRate(): number {
        return this.successRate;
    }
}