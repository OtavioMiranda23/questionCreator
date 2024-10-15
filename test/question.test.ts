import {  DifficultyQuestion, LawQuestion } from "../src/question";
import { CreateQuestion } from "../src/useCase/CreateQuestion";

test("Deve criar uma questão de direito", () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const finalQuestion = `_____, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:`
    const question = new LawQuestion(law, DifficultyQuestion.EASY);
    question.createGapQuestion();
    expect(question.getArticle()).toBe("Art. 299");   
    expect(question.getQuestion()).toBe(finalQuestion);
})

test("Deve dar erro ao criar a questão", () => {
    const noVerbsLaw = "aaaa";
    expect(() => new LawQuestion(noVerbsLaw, DifficultyQuestion.EASY)).toThrow("Law not valid");
    const emptyString = "";
    expect(() => new LawQuestion(emptyString, DifficultyQuestion.EASY)).toThrow("Law not valid");
})

test("Deve criar uma resposta", () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const question = new LawQuestion(law, DifficultyQuestion.EASY);
    question.createResponse();
    expect(question.getResponse()).toBe("Omitir");   
})

test("Deve criar uma questão com template", () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const question = new LawQuestion(law, DifficultyQuestion.EASY).getTemplate();   
    const template = `Complete a lacuna com uma das opções:\n_____, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:`;  
    expect(question).toBe(template);
})

test("Deve criar questão com alternativas", async () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const question = new LawQuestion(law, DifficultyQuestion.EASY);
    await question.createAlternatives();
    expect(question.getAlternatives().length).toBeGreaterThan(0);
})

test("Deve criar uma questão com alternativas e simular uma resposta com feedback", async () => {
    const article = "299";
    const questions = await new CreateQuestion(article).execute();
    expect(questions).toBeDefined();
})