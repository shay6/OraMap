const express = require('express');
const app = express();
const families = require('./data/families.json');

app.use(express.static('public'));

app.get('/search', (req, res) => {
  const query = req.query.family?.toLowerCase();
  if (!query) {
    return res.json([]);
  }
  const matches = families.filter(fam => fam.family.toLowerCase().includes(query));
  res.json(matches);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});