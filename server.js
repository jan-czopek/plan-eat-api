require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger, logEvents } = require('./midleware/logEvents');
const errorHandler = require('./midleware/errorHandler');
const verifyJWT = require('./midleware/verifyJWT');
const credentials = require('./midleware/credentials');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3500;
const db = require('./model/db');

app.use(logger);

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//static files
app.use('/', express.static(path.join(__dirname, 'public')));

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/api/register'));
app.use('/login', require('./routes/api/login'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

// app.use(verifyJWT);
app.use('/posts', require('./routes/api/posts'));
app.use('/users', require('./routes/api/users'));

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
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    logEvents(`${err.original.errno}: ${err.original.code}\t${err.original.syscall}\t${err.original.hostname}`, 'postgresErrLog.log');
  }
}

connect();