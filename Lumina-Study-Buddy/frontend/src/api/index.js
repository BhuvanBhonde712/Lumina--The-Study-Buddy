import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 90000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const chatAPI = {
  send: (messages, context = '') =>
    api.post('/chat', { messages, context }),
};

export const quizAPI = {
  generate: (content, numQuestions = 10, difficulty = 'medium') =>
    api.post('/quiz', { content, numQuestions, difficulty }),
};

export const flashcardsAPI = {
  generate: (content, numCards = 15) =>
    api.post('/flashcards', { content, numCards }),
};

export const studyPlanAPI = {
  generate: (topic, duration, level, goals, hoursPerDay) =>
    api.post('/studyplan', { topic, duration, level, goals, hoursPerDay }),
};

export const summarizeAPI = {
  summarize: (content, style) =>
    api.post('/summarize', { content, style }),
};

export const explainAPI = {
  explain: (concept, level, subject) =>
    api.post('/explain', { concept, level, subject }),
};

export const uploadAPI = {
  pdf: (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    return api.post('/upload/pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};