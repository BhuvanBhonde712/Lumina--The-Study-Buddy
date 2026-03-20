const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { topic, duration, level, goals, hoursPerDay = 2 } = req.body;
    if (!topic || !duration || !level) {
      return res.status(400).json({ error: 'Topic, duration, and level are required' });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `You are an expert educational planner. Create a detailed, realistic, and actionable personalized study plan.

Topic: ${topic}
Total Duration: ${duration}
Current Level: ${level}
Learning Goals: ${goals || 'Gain thorough understanding of the topic'}
Available Study Time: ${hoursPerDay} hours per day

Return ONLY a valid JSON object — no markdown, no backticks, no extra text:
{
  "title": "Personalized Study Plan: [Topic]",
  "topic": "${topic}",
  "duration": "${duration}",
  "level": "${level}",
  "totalHours": "estimated total study hours",
  "overview": "2-3 sentence overview of the plan and approach",
  "milestones": [
    { "id": 1, "title": "Milestone name", "description": "What student achieves here" }
  ],
  "weeks": [
    {
      "week": 1,
      "theme": "Week focus/theme",
      "objective": "What student will accomplish this week",
      "days": [
        {
          "day": "Day 1",
          "focus": "Specific topic for this day",
          "tasks": ["Specific task 1", "Specific task 2", "Specific task 3"],
          "resources": ["Resource or method suggestion"],
          "duration": "${hoursPerDay} hours"
        }
      ]
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?|\n?```|```/g, '').trim();
    const planData = JSON.parse(cleaned);
    res.json(planData);
  } catch (error) {
    console.error('Study plan error:', error);
    res.status(500).json({ error: 'Failed to generate study plan', details: error.message });
  }
});

module.exports = router;