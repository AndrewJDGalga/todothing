import express from 'express';

const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send("Test");
});

app.listen(port);
console.log(`Running on 127.0.0.1:${port}`);