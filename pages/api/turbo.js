
import fetch from 'node-fetch';

console.log("generate-article opened");

export default async function handler(req, res) {
  req.setTimeout(60000); // set the timeout to 60 seconds 
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
    const apiKey = process.env.OPENAI_API_KEY;
const { authorName, articleTypeSelection, subjectMatter } = req.body;

const messages = [
  {"role": "system", "content": `You are a journalist writing a ${articleTypeSelection} newspaper article in the style of ${authorName}. The article should not mention specific dates and be about the following subject matter as the topic and elaborating on it with other known facts and context: ${subjectMatter}.`},
  {"role": "user", "content": "Can you give me some ideas to start with?"},
  {"role": "assistant", "content": "Sure! How about we start with the history of this topic?"},
  {"role": "user", "content": "That sounds like a good starting point. What are some key events or facts that I should mention?"},
  {"role": "assistant", "content": "Well, there was the famous incident that happened in ..."},
  {"role": "user", "content": "Great, thanks for that information. Anything else I should keep in mind?"},
  {"role": "assistant", "content": "Yes, you might also want to consider the impact that this topic has had on society or the economy."}
];

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`
};
const data = {
  'model': 'text-davinci-002',
  'temperature': 0.2,
  'presence_penalty': 0.6,
  'frequency_penalty': 0.6,
  'messages': messages
};

const responsePromise = new Promise((resolve, reject) => {
  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
    timeout: 20000
  }).then(response => {
    if (response.ok) {
      response.json().then(json => resolve(json));
    } else {
      reject(new Error(`Response error: ${response.status} ${response.statusText}`));
    }
  }).catch(error => reject(error));
  
  setTimeout(() => reject(new Error('API request timed out')), 20000);
});

    });

    const responseDict = await responsePromise;
    
    let article = '';
    if (responseDict.choices && responseDict.choices.length > 0) {
      article = responseDict.choices[0].text;
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
