import * as cheerio from 'cheerio';
import Law from './ValueObjects/Law';
import axios from 'axios';

//TODO: REFATORAR
export default class Alternatives {
    private alternatives: string [] = [];
    private law: Law; 
    private quantity;
    constructor (law: string, quantity: number) {
        this.law = Law.create(law);
        if (quantity < 1) throw new Error("Invalid quantity");
        
        this.quantity = quantity;
    }
    
    async genarate () {        
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
        this.alternatives = alternatives;
        // const sufix = matchVerbs[0].slice(-2);
        // const regexSufix = new RegExp(`\\b\\w+${sufix}\\b`, 'g');
        // this.alternatives = alternatives.filter(alternative => regexSufix.test(alternative));        
    }

    getAlternatives(): string[] {
        if (this.quantity > this.alternatives.length) this.quantity =  this.alternatives.length; 
        return this.alternatives.slice(this.quantity);
    }
}