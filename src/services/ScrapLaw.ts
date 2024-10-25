import * as iconv from 'iconv-lite'; 
import axios from "axios";
import * as cheerio from 'cheerio';

export interface ScrapData {
    run(): Promise<string[] | null>,
} 

export class ScrapLaw implements ScrapData {

    constructor (readonly url: string, readonly article: string) {
    }

    private async connect (): Promise<string | null> {        
        const res = await axios<Buffer>({
            method: 'get',
            url: this.url,
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const data = iconv.decode(res.data, 'ISO-8859-1');        
        if (!data) return null;
        return data; 
    }

    public async run (): Promise<string[] | null> {
        const data = await this.connect();
        if (!data) return null;
        const $ = cheerio.load(data);
        let law: string[] = [];
        $("p").each((i, item) => {
            const text = $(item).text().replace(/\n/g, " ").replace(/\s+/g, " ").trim(); // Remove quebras de linha e espaços extras
            if (text.includes(`Art. ${this.article}`)) {
                law.push(text);
            }
        });
        return law;
    }
}

export class ScrapPena implements ScrapData {

    constructor (readonly url: string, readonly article: string) {
    }

    private async connect (): Promise<string | null> {        
        const res = await axios<Buffer>({
            method: 'get',
            url: this.url,
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const data = iconv.decode(res.data, 'ISO-8859-1');        
        if (!data) return null;
        return data; 
    }

    public async run (): Promise<string[] | null> {
        const data = await this.connect();
        if (!data) return null;   
        const $ = cheerio.load(data);
        let law: string[] = [];
        $("p").each((i, item) => {
            const currentText = $(item).text().replace(/\n/g, " ").replace(/\s+/g, " ").trim();
            if (currentText.includes(`Art. ${this.article}`)) {
                const nextP = $(item).nextAll("p").first();
                const nextText = nextP.text().trim();
                law.push(`${currentText}\n${nextText}`);
            }
        });
        return law;
    }
    
    

    
}