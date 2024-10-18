export default class Law {
    private value;

    constructor (law: string) {
        this.value = law;
    }

    static create(law: string): Law {
        if (!law) throw new Error("Law not valid");
        const regexVerbs = /\b(?:\w+(?:ar|er|ir))\b/g;
        if (!law.match(regexVerbs)) throw new Error("Verbs not found");
        const regexArticle = /^(Art\. \d{1,6}(?:-[A-Za-z])? - )/;
        const lawEdit = law.replace(regexArticle, "");
        return new Law(lawEdit);
    }

    getValue() {
        return this.value;
    }
} 