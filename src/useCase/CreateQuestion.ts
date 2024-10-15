import axios from "axios";
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';  // Importa o iconv-lite
import { DifficultyQuestion, LawQuestion } from "../question";

export class CreateQuestion {
    constructor(readonly article: string) {}

    public async execute(): Promise<string> {
        const res = await axios<Buffer>({
            method: 'get',
            url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm",
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const cp = iconv.decode(res.data, 'ISO-8859-1');
        if (!cp) throw new Error("Failed to load data");       
        const $ = cheerio.load(cp);
        let law: string[] = [];
        $("p").each((i, item) => {
            const text = $(item).text().replace(/\n/g, " ").replace(/\s+/g, " ").trim(); // Remove quebras de linha e espaços extras
            if (text.includes(`Art. ${this.article}`)) {
                law.push(text);
            }
        });
        const question = new LawQuestion(law[0], DifficultyQuestion.EASY);
        question.createGapQuestion();
        return question.getTemplate();
        
    }
}
