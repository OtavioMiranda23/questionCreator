import { GapQuestion } from "../../src/entity/GapQuestion";
import { DifficultyQuestion } from "../../src/entity/LawQuestion";

test("Deve criar uma questão de direito", () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const finalQuestion = `Complete a lacuna com uma das opções:\n_____, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:`
    const question = GapQuestion.create(law, DifficultyQuestion.EASY);
    question.createQuestion();
    expect(question.getArticle()).toBe("Art. 299");   
    expect(question.getQuestion()).toBe(finalQuestion);
})

test("Deve dar erro ao criar a questão", () => {
    const noVerbsLaw = "aaaa";
    expect(() => GapQuestion.create(noVerbsLaw, DifficultyQuestion.EASY)).toThrow("Regex verbs not found");
    const emptyString = "";
    expect(() => GapQuestion.create(emptyString, DifficultyQuestion.EASY)).toThrow("Law not valid");
})

test("Deve criar uma resposta", () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const question = GapQuestion.create(law, DifficultyQuestion.EASY);
    question.createResponse();
    expect(question.getResponse()).toBe("Omitir");   
})

test("Deve criar uma questão com template", () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const question = GapQuestion.create(law, DifficultyQuestion.EASY);
    question.createQuestion();   
    const template = `Complete a lacuna com uma das opções:\n_____, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:`;  
    expect(question.getQuestion()).toBe(template);
})

