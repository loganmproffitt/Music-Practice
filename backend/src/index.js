const express = require('express');
const cors = require('cors');
require('dotenv').config();

//const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

//app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});