import express from 'express';
import * as path from 'path';
import axios from 'axios';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to rule-creator-api!' });
});

// Endpoint to prompt GPT
// @ts-ignore
app.post('/api/gpt', async (req, res) => {
  const { message, apiKey } = req.body;

  if (!message || !apiKey) {
    return res.status(400).send({ error: 'Message and API key are required.' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.send(response.data);
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).send({ error: 'Failed to communicate with OpenAI.' });
  }
});

const port = process.env['PORT'] || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
