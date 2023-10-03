require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./midleware/logEvents');
const errorHandler = require('./midleware/errorHandler');
const PORT = process.env.PORT || 3500;
const db = require('./model/db');

app.use(logger);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//static files
app.use('/', express.static(path.join(__dirname, 'public')));

//routes
app.use('/', require('./routes/root'));
app.use('/posts', require('./routes/api/posts'));

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

const connect = async () => {
  try {
    await db.sync({ alter: true })
    console.log("Connection has been established successfully.");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

connect();