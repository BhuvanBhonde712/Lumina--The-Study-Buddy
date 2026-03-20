const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { content, numCards = 15 } = req.body;
    if (!content || content.trim().length < 50) {
      return res.status(400).json({ error: 'Please provide sufficient study material' });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are an expert flashcard creator. Based on the study material below, generate exactly ${numCards} flashcards to help the student memorize key concepts, terms, and ideas.

Study Material:
${content}

Return ONLY a valid JSON object — no markdown, no backticks, no extra text:
{
  "title": "Flashcard set title based on the content",
  "cards": [
    {
      "id": 1,
      "front": "Question, term, or concept (keep concise)",
      "back": "Answer, definition, or explanation (clear and complete)",
      "category": "Optional topic tag (1-2 words)"
    }
  ]
}

Rules:
- Front side should be a question or a term to define
- Back side should be a clear, complete answer
- Cover the most important concepts from the material
- Vary between definitions, concepts, cause/effect, and application questions
- Generate exactly ${numCards} cards`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?|\n?```|```/g, '').trim();
    const flashcardData = JSON.parse(cleaned);
    res.json(flashcardData);
  } catch (error) {
    console.error('Flashcard generation error:', error);
    res.status(500).json({ error: 'Failed to generate flashcards', details: error.message });
  }
});

module.exports = router;