// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages, model = 'deepseek-chat' } = req.body;

  // 从环境变量读取 API Key（安全，不会暴露在前端）
  const API_KEY = process.env.QINIU_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'Missing API key' });
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
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}