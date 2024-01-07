const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/addIP', (req, res) => {
  const newIP = req.body.ip;

  if (newIP) {
    // Read the existing AccessList.json file
    let accessList = [];
    try {
      const data = fs.readFileSync('AccessList.json', 'utf8');
      accessList = JSON.parse(data);
    } catch (err) {
      console.error('Error reading AccessList.json:', err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if the IP already exists in the access list
    if (!accessList.find(entry => entry.Ip === newIP)) {
      // Add the new IP to the list
      accessList.push({ Ip: newIP });
      try {
        // Write the updated list back to AccessList.json
        fs.writeFileSync('AccessList.json', JSON.stringify(accessList, null, 2));
        res.status(200).json({ message: 'IP added successfully' });
      } catch (err) {
        console.error('Error writing to AccessList.json:', err.message);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.status(400).json({ error: 'Duplicate IP' });
    }
  } else {
    res.status(400).json({ error: 'Invalid IP' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
