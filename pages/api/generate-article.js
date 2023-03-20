import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

console.log("generate-article opened");

export default async function handler(req, res) {
  // Set the Access-Control-Allow-Origin header to allow requests from httnews.com
  res.setHeader('Access-Control-Allow-Origin', 'https://www.httnews.com');

  console.log("Handler function called!"); 
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const { authorName, articleTypeSelection, subjectMatter } = req.body;

    const prompt = `write a ${articleTypeSelection} newspaper article in full including a headline and a byline, writing in the style of ${authorName}. The article should be about the following subject matter as the topic and elaborating on it with other facts and context: ${subjectMatter}.`;

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
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });
    const responseDict = await response.json();
    
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
