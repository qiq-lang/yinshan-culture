// netlify/functions/chat.js
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { messages, model = 'deepseek-chat' } = JSON.parse(event.body);
  const API_KEY = process.env.QINIU_API_KEY;

  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing API key' }) };
  }

  try {
    const response = await fetch('https://api.qnaigc.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API error');

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};