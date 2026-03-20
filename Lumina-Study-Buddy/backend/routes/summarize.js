const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const styleGuides = {
  concise: 'Create a clear, concise bullet-point summary. Extract only the most critical information. Use headers for major sections. Aim for about 20% of the original length.',
  detailed: 'Create a comprehensive, structured summary with all important details preserved. Use clear headings, sub-points, and maintain the logical flow of information.',
  eli5: 'Explain this in extremely simple terms as if the reader is a complete beginner with no background knowledge. Use everyday analogies, simple language, and relatable examples. Avoid all jargon.',
  cornell: `Format this as Cornell Notes with three sections:
    ## Main Notes
    [Key concepts and details in organized bullet points]
    ## Cue Questions
    [5-8 questions a student might ask while reviewing]
    ## Summary
    [2-3 sentence summary of the entire content]`,
};

router.post('/', async (req, res) => {
  try {
    const { content, style = 'concise' } = req.body;
    if (!content || content.trim().length < 50) {
      return res.status(400).json({ error: 'Please provide sufficient content to summarize' });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are an expert study assistant helping a student understand and retain information.

${styleGuides[style] || styleGuides.concise}

Content to summarize:
---
${content}
---

Provide a well-structured, study-optimized summary using markdown formatting.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    res.json({ summary, style });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Failed to summarize content', details: error.message });
  }
});

module.exports = router;