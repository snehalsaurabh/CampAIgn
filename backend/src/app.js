const express = require('express');
const cors = require('cors');
const config = require('./config/config');

const app = express();

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
      message: 'Backend is working!',
      timestamp: new Date().toISOString() 
    });
  });

app.use('/api', require('./routes/api'));

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});