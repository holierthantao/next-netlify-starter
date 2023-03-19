const openaiApiKey = process.env.OPENAI_API_KEY;

module.exports = {
  apiKey: JSON.stringify({openaiApiKey}),
};

