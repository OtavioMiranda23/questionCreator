import { CreateAlternatives, CreateCompleteQuestion, CreateResponse, TemplateQuestion } from "../src/question";

test("Deve criar uma questão", () => {
    const law = "Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const finalQuestion = `_____, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:`
    const question = new CreateCompleteQuestion(law).execute();
    expect(question).toBe(finalQuestion);
})

test("Deve dar erro ao criar a questão", () => {
    const noVerbsLaw = "aaaa";
    expect(() => new CreateCompleteQuestion(noVerbsLaw).execute()).toThrow("Verbs not match");
    const emptyString = "";
    expect(() => new CreateCompleteQuestion(emptyString).execute()).toThrow("Verbs not match");
})

test("Deve criar uma questão completa", () => {
    const law = "Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const question = new CreateCompleteQuestion(law).execute();
    const response = new CreateResponse(law).execute();
    const questionComplete = new TemplateQuestion(question, response).createQuestionWithResponse();
    const template = `Complete a lacuna com uma das opções:\n${question}\nResposta: ${response}`;  
    expect(questionComplete).toBe(template);
})


test.only("Deve criar questão com alternativas", async () => {
    const law = "Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const alternatives = new CreateAlternatives("omitir");
    await alternatives.execute();
    expect(alternatives.getThreeAlternatives()).toHaveLength(3);
})