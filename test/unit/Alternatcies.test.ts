import Alternatives from "../../src/entity/Alternatives";

test("Deve criar questão com alternativas", async () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    const alternatives = new Alternatives(law, 3);
    await alternatives.genarate();    
    expect(alternatives.getAlternatives().length).toBeGreaterThan(0);
})

test("Não deve criar questão com número de alternativas inválido", async () => {
    const law = "Art. 299 - Omitir, em documento público ou particular, declaração que dele devia constar, ou nele inserir ou fazer inserir declaração falsa ou diversa da que devia ser escrita, com o fim de prejudicar direito, criar obrigação ou alterar a verdade sobre fato juridicamente relevante:";
    expect(() => { new Alternatives(law, 0) }).toThrow(new Error("Invalid quantity"));
})
