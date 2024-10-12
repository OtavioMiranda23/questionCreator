import axios from 'axios';
import * as cheerio from 'cheerio';

export enum DifficultyQuestion {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
} 

export class LawQuestion {
    private law: string;
    private question: string = "";
    private response: string = "";
    private alternatives: string[] = [];
    private difficulty: DifficultyQuestion;
    private article: string = "";
    private errorRate = 0;
    private successRate = 0;
    private regexVerbs =  /\b\w+(ar|er|ir)\b/g;

    constructor (law: string, difficulty: DifficultyQuestion) {
        this.difficulty = difficulty;
        const regexArticle = /^Art\. \d{1,6}(-[A-Za-z])?\.?\s*-\s*/;
        const matchArticle = law.match(regexArticle);
        if (!matchArticle) throw new Error("Law not valid");
        this.article = matchArticle[0].replace("-", "").trim();
        if (!law) throw new Error("Law not valid");
        if (!law.match(this.regexVerbs)) throw new Error("Verbs not found");
        this.law = law.replace(regexArticle, "");
    }

    public createGapQuestion () {
        const regexVerbs =  /\b\w+(ar|er|ir)\b/g;
        const match = this.law.match(regexVerbs);
        if (!match) throw new Error("Verbs not match");
        this.question  = this.law.replace(match[0], "_____");
    }

    public createResponse () {
        const match = this.law.match(this.regexVerbs);
        if (!match) throw new Error("Verbs not match");
        this.response = match[0].trim();
    }
    public getTemplate () {
        this.createGapQuestion();
        return `Complete a lacuna com uma das opções:\n${this.question}`;
    } 
    public async createAlternatives () {        
        const regexVerbs =  /\b\w+(ar|er|ir)\b/g;
        const matchVerbs = this.law.match(regexVerbs);
        if (!matchVerbs) throw new Error("Verbs not match");
        console.log(matchVerbs[0]);
        
        const res = await axios.get<string>(`https://www.sinonimos.com.br/${matchVerbs[0]}`);       
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
    public getQuestion (): string {
        return this.question;
    }

    public getArticle(): string {
        return this.article;
    }

    public getResponse (): string {
        return this.response;
    }

    public getAlternatives (): string[] {
        return this.alternatives;
    }
}