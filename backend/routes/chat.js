const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    const systemInstruction = context
      ? `You are Lumina, an intelligent AI Study Buddy. The student has provided the following study material as context:\n\n---\n${context}\n---\n\nAnswer questions primarily based on this material when relevant. If the question is outside the material, still help using your knowledge. Be concise, clear, and educational. Format responses with markdown where helpful.`
      : `You are Lumina, an intelligent AI Study Buddy. Help students understand concepts, answer questions, and explain topics clearly and concisely. Be encouraging and educational. Format responses with markdown where helpful.`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
    });

    // Separate the last user message from the history
    const lastMessage = messages[messages.length - 1];

    // Build history from all messages except the last one
    // Filter out the first assistant message (welcome message) since Gemini requires history to start with 'user'
    const rawHistory = messages.slice(0, -1).filter((msg) => msg.role === 'user' || msg.role === 'assistant');

    // Remove leading assistant messages
    let startIndex = 0;
    while (startIndex < rawHistory.length && rawHistory[startIndex].role === 'assistant') {
      startIndex++;
    }
    const cleanHistory = rawHistory.slice(startIndex);

    // Build pairs: must alternate user/model starting with user
    const history = cleanHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;

    res.json({ reply: response.text() });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get response', details: error.message });
  }
});

module.exports = router;
