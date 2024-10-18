import * as iconv from 'iconv-lite'; 
import axios from "axios";

export interface ScrapData {
    run(): Promise<string>
} 
export class ScrapSite implements ScrapData {
    constructor (readonly url: string) {

    }
    public async run (): Promise<string> {
        const res = await axios<Buffer>({
            method: 'get',
            url: this.url,
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const data = iconv.decode(res.data, 'ISO-8859-1');
        if (!data) throw new Error("Failed to load data");   
        return data;
    }
}