import axios from 'axios';
import * as cheerio from 'cheerio';
import UUID from './ValueObjects/UUID';
import Law from './ValueObjects/Law';
import Article from './ValueObjects/Article';

export enum DifficultyQuestion {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
} 

export class LawQuestion {
    id: UUID;
    law: Law;
    question: string;
    response: string;
    alternatives?: string[] = [];
    difficulty: DifficultyQuestion;
    article: Article;
    errorRate: number;
    successRate: number;
    regexVerbs = /\b(?:\w+(?:ar|er|ir))\b/g;

    constructor (
        id: string, 
        law: string, 
        difficulty: DifficultyQuestion,
        article: string, 
        errorRate: number, 
        successRate: number,
        question?: string, 
        response?: string, 
    ) {
        this.id = new UUID(id);
        this.law = new Law(law);
        this.question = question ? question : "";
        this.response = response ? response : "" ;
        this.difficulty = difficulty;
        this.article = new Article(article);
        this.errorRate = errorRate;
        this.successRate = successRate;
        }

    static create (law: string, difficulty: DifficultyQuestion) {
        const uuid = UUID.create().getValue();
        const lawVO = Law.create(law).getValue();
        return new LawQuestion(uuid, lawVO, difficulty, Article.create(law).getValue(), 0, 0);
    }

    public createGapQuestion () {   
        const match = this.law.getValue().match(this.regexVerbs);        
        if (!match) throw new Error("Verbs not match");
        this.question  = this.law.getValue().replace(match[0], "_____");
    }

    public createResponse () {
        const match = this.law.getValue().match(this.regexVerbs);
        if (!match) throw new Error("Verbs not match");
        this.response = match[0].trim();
    }
    public getTemplate () {
        this.createGapQuestion();
        return `Complete a lacuna com uma das opções:\n${this.question}`;
    } 
    public async createAlternatives () {        
        const regexVerbs =  /\b\w+(ar|er|ir)\b/g;
        const matchVerbs = this.law.getValue().match(regexVerbs);
        if (!matchVerbs) throw new Error("Verbs not match");
        const res = await axios.get<string>(`https://www.sinonimos.com.br/${matchVerbs[0].toLowerCase()}/`);       
        if(!res.data) throw new Error("Word not found");
        const alternatives: string[] = [];        
        //selection
        const $ = cheerio.load(res.data);
        $('.syn-list a').each((i, item) => { 
            if (item) alternatives.push($(item).text().trim())
        })
        //proccess        
        const sufix = matchVerbs[0].slice(-2);
        const regexSufix = new RegExp(`\\b\\w+${sufix}\\b`, 'g');
        this.alternatives = alternatives.filter(alternative => regexSufix.test(alternative));        
    }
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

    public getAlternatives (): string[] {
        return this.alternatives ? this.alternatives : [];
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