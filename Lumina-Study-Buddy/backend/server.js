require('dotenv').config();
const express = require('express');
const cors = require('cors');

const chatRoutes = require('./routes/chat');
const quizRoutes = require('./routes/quiz');
const flashcardsRoutes = require('./routes/flashcards');
const studyplanRoutes = require('./routes/studyplan');
const summarizeRoutes = require('./routes/summarize');
const explainRoutes = require('./routes/explain');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/chat', chatRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/flashcards', flashcardsRoutes);
app.use('/api/studyplan', studyplanRoutes);
app.use('/api/summarize', summarizeRoutes);
app.use('/api/explain', explainRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', message: 'Lumina backend running' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Lumina backend running on port ${PORT}`);
});