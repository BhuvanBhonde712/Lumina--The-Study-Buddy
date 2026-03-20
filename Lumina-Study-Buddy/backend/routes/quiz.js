const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { content, numQuestions = 10, difficulty = 'medium' } = req.body;
    if (!content || content.trim().length < 50) {
      return res.status(400).json({ error: 'Please provide sufficient study material (at least 50 characters)' });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are an expert quiz generator. Based on the study material below, generate exactly ${numQuestions} multiple choice questions at ${difficulty} difficulty.

Study Material:
${content}

Return ONLY a valid JSON object — no markdown, no backticks, no extra text whatsoever. Use this exact structure:
{
  "title": "A specific quiz title based on the content topic",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Clear question text here",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correct": 0,
      "explanation": "Why this answer is correct, briefly explained"
    }
  ]
}

Rules:
- "correct" is the 0-based index of the correct option (0, 1, 2, or 3)
- Questions must be distinct and cover different parts of the material
- Options should be plausible but clearly have one best answer
- Explanations should be educational and concise
- Generate exactly ${numQuestions} questions`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?|\n?```|```/g, '').trim();
    const quizData = JSON.parse(cleaned);
    res.json(quizData);
  } catch (error) {
    console.error('Quiz generation error:', error);
    if (error instanceof SyntaxError) {
      res.status(500).json({ error: 'Failed to parse quiz response. Try again.' });
    } else {
      res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
    }
  }
});

module.exports = router;