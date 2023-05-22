const express = require('express');
const app = express();

const { Configuration, OpenAIApi } = require("openai");

// set the port
const port = process.env.PORT || 3000;

// setup .env variables using dotenv
require('dotenv').config();

// Setup cors policy for dev environment
const cors = require('cors');
app.use(cors({ origin: `http://localhost:${port}`, credentials: true }))

// middleware to parse the body
app.use(express.json());

// configure the openai api
const configuration = new Configuration({
  apiKey: process.env.apiKey,
});
const openai = new OpenAIApi(configuration);

// make an async function to call the openai api and return the response
// using the async await syntax and passing the prompt and model

app.post('/calling-grammar-editor', async (req, res) => {
  // Making a call to the openai api you need to pass the model and the messages
  //  calling-grammar-editor
  // { model: 'gpt-3.5-turbo', messages:
  //  [{'role': 'system', 'content': 'you are a grammar editor bot'},
  //   {'role': 'bot', 'content': 'I am a grammar editor bot'},
  //  {'role', 'user', 'content': 'Can you fix my essays grammar?'}]}
  const { model, messages } = req.body;
  // parse the body and get the prompt and model
  // make a try catch block to catch any errors
  console.log(req.body);
  try {
    const gptResponse = await openai.createChatCompletion({ model: model, messages: messages, temperature: 0.5 });
    console.log(gptResponse.data.choices[0].message, "the response");
    res.status(200).json({ response: gptResponse.data.choices[0].message['content'] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch completion from OpenAI' });
  }
});

//get route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start the server and give the host and port
// give the path to the server
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
});