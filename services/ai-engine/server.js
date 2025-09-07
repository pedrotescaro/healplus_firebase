const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/analysis/vision', (req, res) => {
  return res.status(202).json({ jobId: 'mock-job-vision-001', modelVersion: 'vision-0.1.0' });
});

app.post('/analysis/risk', (req, res) => {
  return res.json({
    infection: { level: 'Medium', score: 0.62, factors: ['diabetes', 'high exudate'] },
    healing: { probHeal30: 0.48, timeToHeal: 63, stagnation: false, factors: ['granulation up'] },
    modelVersion: 'risk-0.1.0'
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`ai-engine listening on ${port}`));


