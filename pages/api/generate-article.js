
import fetch from 'node-fetch';

console.log("generate-article opened");

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
    const apiKey = process.env.OPENAI_API_KEY;
    const { authorName, articleTypeSelection, subjectMatter } = req.body;

    const prompt = `write a ${articleTypeSelection} newspaper article in full including a headline and a byline, writing in the style of ${authorName}. The article should be about ${subjectMatter}.`;

    //const prompt = 'say this is a test';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    const data = {
      'model': 'text-davinci-003',
      'prompt': prompt,
      'temperature': 0.5,
      'max_tokens': 1024,
      'n': 1,
      'stop': null,
      'frequency_penalty': 0.8,
      'presence_penalty': 0.3
    };

    const responsePromise = new Promise((resolve, reject) => {
      fetch('https://api.openai.com/v1/completions', {
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
      
      setTimeout(() => reject(new Error('API request timed out')), 10000);
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
