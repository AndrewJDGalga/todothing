import express from 'express';
import path, {dirname} from 'node:path';
import { fileURLToPath } from 'node:url';

const front_prod = path.join(dirname(fileURLToPath(import.meta.url)), '/front-prod/');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.sendFile(path.join(front_prod, 'index.html'));
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(front_prod));
app.use((req, res)=>{
    //vue router appears to expect default to be home
    res.status(404).sendFile(path.join(front_prod, 'index.html'));
});

app.listen(port);
console.log(`Running on 127.0.0.1:${port}`);