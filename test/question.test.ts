import { createAlternatives, createQuestion, createResponse, createTemplate } from "../src/question";

test("Deve criar uma questão", () => {
    const law = "Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const finalQuestion = `_____, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:`
    expect(createQuestion(law)).toBe(finalQuestion);
})
test("Deve criar uma questão completa", () => {
    const law = "Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const finalQuestion = `_____, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:`
    const response = createResponse(law);
    const template = `Complete a lacuna com uma das opções:
    ${finalQuestion}
    Resposta: ${response}`;
    const question = createQuestion(law);
    expect(createTemplate(question, response)).toBe(template);
})
test("Deve dar erro ao criar a questão", () => {
    const noVerbsLaw = "aaaa";
    expect(() => createQuestion(noVerbsLaw)).toThrow("Verbs not match");
    const emptyString = "";
    expect(() => createQuestion(emptyString)).toThrow("Verbs not match");
})

test("Deve criar questão com alternativas", async () => {
    const law = "Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const alternatives = await createAlternatives("omitir");
    expect(alternatives).toHaveLength(3);
})