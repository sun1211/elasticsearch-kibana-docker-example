import 'dotenv/config';
import cors from 'cors';
import axios from 'axios';
import express from 'express';
import client from "./client";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Routes
app.get('/check', (req, res) => {
    res.status(200).send('heath check OK');
});

app.get('/check-es', async (req, res) => {
    const data = await client.cluster.health();
    res.status(200).json(data);
});

app.get('/search', async (req, res) => {
    await client.indices.refresh({ index: `${req.query.index}` })
    const { body } = await client.search({
        index: `${req.query.index}`,
        body: {
          query: {
            match: { quote: `${req.query.quote}` }
          }
        }
      })
    res.status(200).json(body);
});

app.get('/add-document', async (req, res) => {
    await client.index({
        index: `${req.query.index}`,
        body: {
          character: `${req.query.character}`,
          quote: `${req.query.quote}`
        }
      })
    res.status(200).json("OK");
});

// Start
const appPort = 4000;
app.listen(appPort, () => {
    console.info(`Example app listening on port ${appPort}!`);
});
