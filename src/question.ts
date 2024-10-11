import axios from 'axios';
import * as cheerio from 'cheerio';

export function createQuestion(law: string): string {
    const regexVerbs =  /\b\w+(ar|er|ir)\b/g;
    const match = law.match(regexVerbs);
    if (!match) throw new Error("Verbs not match");
    const question = law.replace(match[0], "_____");
    return question;
}
export function createResponse(law: string): string {
    const regexVerbs =  /\b\w+(ar|er|ir)\b/g;
    const match = law.match(regexVerbs);
    if (!match) throw new Error("Verbs not match");
    const response = match[0].trim();
    return response;
}

export function createTemplate(question: string, response: string) {
    return `Complete a lacuna com uma das opções:
    ${question}
    Resposta: ${response}`
}

export async function createAlternatives(word: string) {
    const res = await axios.get<string>(`https://www.sinonimos.com.br/${word}`);
    if(!res.data) throw new Error("Word not found");
    const alternatives: string[] = [];
    const $ = cheerio.load(res.data);
    $('.syn-list a').each((i, item) => { 
        if (item) alternatives.push($(item).text().trim())
    })
    const sufix = word.slice(-2);
    const regexSufix = new RegExp(`\\b\\w+${sufix}\\b`, 'g');
    const alternativesSufix = alternatives.filter(alternative => regexSufix.test(alternative));
    const threeAlternatives = [word, alternativesSufix[0], alternativesSufix[1]];
    return threeAlternatives;
    
}