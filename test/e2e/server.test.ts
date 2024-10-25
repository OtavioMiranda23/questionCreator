
import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test ("Criar bateria de questões, acertando todas", async () => {
    const input = {
        article: "299"
    }
    const resQuestions = await axios.post<{ questionId: string }>("http://localhost:5013/questions", input);
    const outputQuestions = resQuestions.data;
    console.log({outputQuestions});
    expect(outputQuestions.questionId).toBeDefined();
})