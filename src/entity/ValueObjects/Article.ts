import Law from "./Law";

export default class Article {
    private value: string;

    constructor (article: string) {
        this.value = article;
    }

    static create(lawRow: string): Article {
        const regexArticle = /^(Art\. \d{1,6}(?:-[A-Za-z])? - )/;
        const matchArticle = lawRow.match(regexArticle);
        if (!matchArticle) throw new Error("Law not valid");
        const articleNormalized = matchArticle[0].replace(" - ", "");
        return new Article(articleNormalized);
    }

    getValue (): string {
        return this.value;
    }
}