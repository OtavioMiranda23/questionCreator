import { PgPromiseAdapter } from "../src/database/DatabaseConnection";
import { LawQuestionDatabase } from "../src/infra/repository/QuestionRepository";
import {  DifficultyQuestion, LawQuestion } from "../src/entity/question";
import AnswerQuestion from "../src/useCase/AnswerQuestion";
import { CreateQuestion } from "../src/useCase/CreateQuestion";
import { ScrapSite } from "../src/useCase/ScrapSite";

let pg: PgPromiseAdapter;
let questionDatabase: LawQuestionDatabase;

beforeAll(() => {
     pg = new PgPromiseAdapter();
     questionDatabase = new LawQuestionDatabase(pg);  
})

test("Deve criar uma questão de direito", () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const finalQuestion = `_____, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:`
    const question = LawQuestion.create(law, DifficultyQuestion.EASY);
    question.createGapQuestion();
    expect(question.getArticle()).toBe("Art. 299");   
    expect(question.getQuestion()).toBe(finalQuestion);
})

test("Deve dar erro ao criar a questão", () => {
    const noVerbsLaw = "aaaa";
    expect(() => LawQuestion.create(noVerbsLaw, DifficultyQuestion.EASY)).toThrow("Verbs not found");
    const emptyString = "";
    expect(() => LawQuestion.create(emptyString, DifficultyQuestion.EASY)).toThrow("Law not valid");
})

test("Deve criar uma resposta", () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const question = LawQuestion.create(law, DifficultyQuestion.EASY);
    question.createResponse();
    expect(question.getResponse()).toBe("Omitir");   
})

test("Deve criar uma questão com template", () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const question = LawQuestion.create(law, DifficultyQuestion.EASY).getTemplate();   
    const template = `Complete a lacuna com uma das opções:\n_____, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:`;  
    expect(question).toBe(template);
})

test("Deve criar questão com alternativas", async () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const question = LawQuestion.create(law, DifficultyQuestion.EASY);
    await question.createAlternatives();
    expect(question.getAlternatives().length).toBeGreaterThan(0);
})

test("Deve criar uma questão com alternativas e simular uma resposta com feedback", async () => {
    const url = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm';
    const cp = new ScrapSite(url)
    const articles = ["299", "298", "297"];
    const answer = "Omitir";
    const outputCreateQuestion: string = await new CreateQuestion(articles[0], cp, questionDatabase).execute();
    expect(outputCreateQuestion).toBeDefined();
    const outputAnswerQuestion: boolean = await new AnswerQuestion(outputCreateQuestion, answer, questionDatabase).execute();
    expect(outputAnswerQuestion).toBeTruthy();
});

afterAll(() => {
    pg.close();
})