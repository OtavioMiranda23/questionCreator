import axios from 'axios';
import * as cheerio from 'cheerio';

export class CreateAlternatives {
    private threeAlternatives: string[] = [];
    constructor (readonly word: string) {}
    
    public async execute () {
        //axios
        const res = await axios.get<string>(`https://www.sinonimos.com.br/${this.word}`);       
        if(!res.data) throw new Error("Word not found");
        const alternatives: string[] = [];        
        //selection
        const $ = cheerio.load(res.data);
        $('.syn-list a').each((i, item) => { 
            if (item) alternatives.push($(item).text().trim())
        })
        //proccess
        const sufix = this.word.slice(-2);
        const regexSufix = new RegExp(`\\b\\w+${sufix}\\b`, 'g');
        const alternativesSufix = alternatives.filter(alternative => regexSufix.test(alternative));        
        //mount alternatives
        this.threeAlternatives.push(this.word);
        this.threeAlternatives.push(alternativesSufix[0]);
        this.threeAlternatives.push(alternativesSufix[1]);
    }

    public getThreeAlternatives() {
        return this.threeAlternatives;
    }
}

export class CreateCompleteQuestion {
    constructor (readonly law: string) {
    }
    public execute (): string {
        const regexVerbs =  /\b\w+(ar|er|ir)\b/g;
        const match = this.law.match(regexVerbs);
        if (!match) throw new Error("Verbs not match");
        const question = this.law.replace(match[0], "_____");
        return question;
    }
}

export class CreateResponse {
    constructor (readonly law: string) {
    }
    public execute (): string {
        const regexVerbs =  /\b\w+(ar|er|ir)\b/g;
        const match = this.law.match(regexVerbs);
        if (!match) throw new Error("Verbs not match");
        const response = match[0].trim();
        return response;
    }
}

export class TemplateQuestion {
    private question: string;
    private response: string;

    constructor (question: string, response: string ) {
        this.question = question;
        this.response = response;
    }

    public createQuestionWithResponse() {
        return `Complete a lacuna com uma das opções:\n${this.question}\nResposta: ${this.response}`
    }
}