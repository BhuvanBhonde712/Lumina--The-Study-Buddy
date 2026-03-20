const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

router.post('/pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    const data = await pdfParse(req.file.buffer);
    if (!data.text || data.text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from this PDF. It may be a scanned image.' });
    }
    res.json({
      text: data.text.trim(),
      pages: data.numpages,
      filename: req.file.originalname,
      characters: data.text.trim().length,
    });
  } catch (error) {
    console.error('PDF parse error:', error);
    res.status(500).json({ error: 'Failed to parse PDF', details: error.message });
  }
});

module.exports = router;