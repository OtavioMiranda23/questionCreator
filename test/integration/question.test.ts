import { PgPromiseAdapter } from "../../src/database/DatabaseConnection";
import { LawQuestionDatabase } from "../../src/infra/repository/QuestionRepository";
import AnswerQuestion from "../../src/useCase/AnswerQuestion";
import CreatePenaQuestion from "../../src/useCase/CreatePenaQuestion";
import { CreateQuestion } from "../../src/useCase/CreateQuestion";
import { ScrapLaw, ScrapPena } from "../../src/services/ScrapLaw";
import AnswerPenaQuestion from "../../src/useCase/AnswerPenaQuestion";

let pg: PgPromiseAdapter;
let questionDatabase: LawQuestionDatabase;
let url: string;
beforeAll(() => {
    pg = new PgPromiseAdapter();
    questionDatabase = new LawQuestionDatabase(pg);  
    url = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm';
})

test("Deve criar uma questão com alternativas e simular uma resposta certa", async () => {
    const article = "299";
    const answer = "Omitir";
    const law = await new ScrapPena(url, article).run();
    //@ts-ignore
    const outputCreateQuestion: string = await new CreateQuestion(law[0], questionDatabase).execute();
    expect(outputCreateQuestion).toBeDefined();
    const outputAnswerQuestion: boolean = await new AnswerQuestion(outputCreateQuestion, answer, questionDatabase).execute();
    expect(outputAnswerQuestion).toBeTruthy();
});

test("Deve criar uma questão e simular uma resposta errada", async () => {
    const article = "298";
    const answer = "Omitir";
    const law = await new ScrapPena(url, article).run();
    //@ts-ignore
    const outputCreateQuestion: string = await new CreateQuestion(law[0], questionDatabase).execute();
    expect(outputCreateQuestion).toBeDefined();
    const outputAnswerQuestion: boolean = await new AnswerQuestion(outputCreateQuestion, answer, questionDatabase).execute();
    expect(outputAnswerQuestion).toBeFalsy();
})

test("Cria questão baseado em pena", async () => {
    const article = "298";
    const answer = "reclusão";
    const law = await new ScrapPena(url, article).run();
    //@ts-ignore
    const outputCreatePenaQuestion: string = await new CreatePenaQuestion(law[0], questionDatabase).execute();
    expect(outputCreatePenaQuestion).toBeDefined();
    const outputAnswerQuestion: boolean = await new AnswerPenaQuestion(outputCreatePenaQuestion, answer, questionDatabase).execute();
    expect(outputAnswerQuestion).toBeTruthy();
});

test("Cria questão baseado em pena", async () => {
    const article = "298";
    const answer = "reclusão";
    const law = await new ScrapPena(url, article).run();
    //@ts-ignore
    const outputCreatePenaQuestion: string = await new CreatePenaQuestion(law[0], questionDatabase).execute();
    expect(outputCreatePenaQuestion).toBeDefined();
    const outputAnswerQuestion: boolean = await new AnswerPenaQuestion(outputCreatePenaQuestion, answer, questionDatabase).execute();
    expect(outputAnswerQuestion).toBeTruthy();
});

test("Cria com erro questão baseado em pena", () => {
    //@ts-ignore
    expect(async () => { await new CreatePenaQuestion(null, questionDatabase).execute() }).rejects.toThrow(new Error("Not found law"));
});

//TODO: Criar bateria de questões. Se acertar, vai para a proximo, senão repete as questões
//enquanto tiverem vidas restantes


afterAll(() => {
    pg.close();
})