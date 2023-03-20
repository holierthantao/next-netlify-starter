//import openai from 'openai';

console.log("generate-article opened");

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    console.log("Going through the OPTIONS request");
    // Set the Access-Control-Allow-Origin header to allow requests from httnews.com
    res.setHeader('Access-Control-Allow-Origin', 'https://www.httnews.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Cache-Control');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).end();
    return;
  }
  console.log("Going through the POST or other request");
  // Set the Access-Control-Allow-Origin header to allow requests from httnews.com
  res.setHeader('Access-Control-Allow-Origin', 'https://www.httnews.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Cache-Control');
  res.setHeader('Cache-Control', 'no-cache');

  console.log("Handler function called!"); 
  try {
    const { authorName, articleTypeSelection, subjectMatter } = req.body;

    const prompt = `write a ${articleTypeSelection} newspaper article in full including a headline and a byline, writing in the style of ${authorName}. The article should be about ${subjectMatter}.`;

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.5,
      maxTokens: 1024,
      n: 1,
      stop: null,
      frequencyPenalty: 0.8,
      presencePenalty: 0.3
    });

    let article = '';
    if (response.choices && response.choices.length > 0) {
      article = response.choices[0].text;
    } else {
      console.log('Unexpected response format');
    }
    console.log(`Posted: Author name: ${authorName} Article type: ${articleTypeSelection} Article: ${article}`);
    res.status(200).send(article);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}
