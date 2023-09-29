const whiteList = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3500',
  'http://localhost:3500',
  'https://plan-eat-client.onrender.com'

];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccesStatus: 200
}

module.exports = corsOptions;