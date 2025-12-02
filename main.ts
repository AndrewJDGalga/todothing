import express, {Request, Response} from 'express';

const app = express();
const port = 8080;

app.get('/', (_req:Request, res:Response) => {
    res.send('Test');
});

app.listen(port);
console.log(`Running on 127.0.0.1:${port}`);