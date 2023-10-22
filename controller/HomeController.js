const path = require('path');

exports.getHomePage = (req, res) => {
  const filePath = path.join(__dirname, '../view', 'index.html');
  res.sendFile(filePath);
};

