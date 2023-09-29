const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  const logFolder = path.join(__dirname, '..');
  try {
    if (!fs.existsSync(path.join(logFolder, 'logs'))) {
      await fsPromises.mkdir(path.join(logFolder, 'logs'));
    }
    await fsPromises.appendFile(path.join(logFolder, 'logs', logName), logItem);
  } catch (err) {
    console.log(err);
  }
}
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
  console.log(`${req.method} ${req.path}`);
  next();
}


module.exports = { logEvents, logger };