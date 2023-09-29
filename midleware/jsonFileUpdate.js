const path = require('path');
const fsPromises = require('fs').promises;

const jsonFileUpdate = async (data, jsonFilePath) => {
  try {

    await fsPromises.writeFile(path.join(jsonFilePath), JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
}

module.exports = jsonFileUpdate;