// Importa o módulo Express
import express, { Request, Response} from 'express';
import { CreateQuestion } from './useCase/CreateQuestion';
import { ScrapPena } from './services/ScrapLaw';
import { PgPromiseAdapter } from './database/DatabaseConnection';
import { LawQuestionDatabase } from './infra/repository/QuestionRepository';

const app = express();
const port = 5013;
app.use(express.json());

app.post('/questions', async (req: Request, res: Response) => {
    const input: { article: string } = req.body;
    console.log(req.body);
    const pg = new PgPromiseAdapter();
    const questionDatabase = new LawQuestionDatabase(pg);  
    const url = 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm';
    const law = await new ScrapPena(url, input.article).run();
    if (!law) throw new Error("Not found law");    
    const questionId = await new CreateQuestion(law[0], questionDatabase).execute();
    res.send({questionId});
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
