import { PgPromiseAdapter } from "../../src/database/DatabaseConnection";
import { LawQuestionDatabase } from "../../src/infra/repository/QuestionRepository";
import AnswerQuestion from "../../src/useCase/AnswerQuestion";
import { CreateQuestion } from "../../src/useCase/CreateQuestion";
import { ScrapSite } from "../../src/useCase/ScrapSite";

let pg: PgPromiseAdapter;
let questionDatabase: LawQuestionDatabase;
let cp: ScrapSite;
beforeAll(() => {
    pg = new PgPromiseAdapter();
    questionDatabase = new LawQuestionDatabase(pg);  
    let url = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm';
    cp = new ScrapSite(url);
})

test("Deve criar uma questão com alternativas e simular uma resposta certa", async () => {
    const articles = "299";
    const answer = "Omitir";
    const outputCreateQuestion: string = await new CreateQuestion(articles, cp, questionDatabase).execute();
    expect(outputCreateQuestion).toBeDefined();
    const outputAnswerQuestion: boolean = await new AnswerQuestion(outputCreateQuestion, answer, questionDatabase).execute();
    expect(outputAnswerQuestion).toBeTruthy();
});

test("Deve criar uma questão e simular uma resposta errada", async () => {
    const articles = "298";
    const answer = "Omitir";
    const outputCreateQuestion: string = await new CreateQuestion(articles, cp, questionDatabase).execute();
    expect(outputCreateQuestion).toBeDefined();
    const outputAnswerQuestion: boolean = await new AnswerQuestion(outputCreateQuestion, answer, questionDatabase).execute();
    expect(outputAnswerQuestion).toBeFalsy();
})

// test("Cria questão baseado em pena", async () => {
//     const article = "298";
//     const answer = "reclusão";
//     const outputCreatePenaQuestion: string = await new CreatePenaQuestion(article,cp, questionDatabase).execute();
//     expect(outputCreatePenaQuestion).toBeDefined();
//     const outputAnswerQuestion: boolean = await new AnswerPenaQuestion(outputCreatePenaQuestion, answer, questionDatabase).execute();
//     expect(outputAnswerQuestion).toBeTruthy();
// });

//TODO: Criar bateria de questões. Se acertar, vai para a proximo, senão repete as questões
//enquanto tiverem vidas restantes

afterAll(() => {
    pg.close();
})