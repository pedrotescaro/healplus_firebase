const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/wounds/:woundId/assessments', (req, res) => {
  return res.status(201).json({ assessmentId: 'mock-assessment-123' });
});

app.get('/assessments/:id/analysis', (req, res) => {
  return res.json({
    segmentationMaskUri: 's3://mock/mask.png',
    tissueQuant: [{ class: 'granulation', percent: 45 }],
    area: { value: 12.3, unit: 'cm2' },
    perimeter: { value: 14.8, unit: 'cm' },
    gradcamUri: 's3://mock/gradcam.png'
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`api-gateway listening on ${port}`));


