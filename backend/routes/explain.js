const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const levelGuides = {
  beginner: 'Use very simple language, avoid all jargon, and rely on everyday analogies. Assume the reader has zero prior knowledge.',
  intermediate: 'Use clear explanations with some technical terms (define them when introduced). Assume basic familiarity with the subject area.',
  advanced: 'Provide a technically rigorous, comprehensive explanation with full depth, nuance, edge cases, and connections to related concepts.',
  feynman: 'Use the Feynman Technique: explain the concept as if teaching it to someone for the first time. Start from first principles, use powerful analogies, identify and address potential points of confusion.',
};

router.post('/', async (req, res) => {
  try {
    const { concept, level = 'intermediate', subject = '' } = req.body;
    if (!concept || concept.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a concept to explain' });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are an exceptional tutor known for making complex ideas crystal clear.

Explanation level: ${level}
${levelGuides[level] || levelGuides.intermediate}

${subject ? `Subject area: ${subject}` : ''}
Concept to explain: ${concept}

Structure your explanation using markdown with these sections:

## What is ${concept}?
[Clear, direct definition or introduction]

## Core Explanation
[The main explanation with examples]

## Real-World Example / Analogy
[A concrete, memorable example or analogy]

## Key Takeaways
[3-5 bullet points of the most important things to remember]`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();
    res.json({ explanation, concept, level });
  } catch (error) {
    console.error('Explain error:', error);
    res.status(500).json({ error: 'Failed to explain concept', details: error.message });
  }
});

module.exports = router;