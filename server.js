const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('dist'))

let savedSearches = [];

savedSearches.push({id: 'test', keywords: 'these are keywords', location: 'this is a location'});

function getIndex(id){
  for(var i = 0; i < savedSearches.length; ++i){
    if(savedSearches[i].id === id) return i;
  }
  return -1;
}

app.get('/api/searches', (req,res) => {
  res.send(savedSearches);
});

app.put('/api/searches/:id', (req,res) => {
  let id = req.params.id;
  let targetIndex = getIndex(id);
  let target = savedSearches[targetIndex];
  // Assuming target has been found
  target.keywords = req.body.keywords;
  target.location = req.body.location;
  res.send(target);
}); 

app.post('/api/searches/', (req,res) => {
  let item = {id: req.body.id, keywords: req.body.keywords, location: req.body.location};
  let index = getIndex(item.id);
  if(index > -1){
    res.status(404).send('Sorry, that id is already in use.');
  } else {
    savedSearches.push(item);
    res.send(item);
  }
});

app.delete('/api/searches/:id', (req,res) => {
  let id = req.params.id;
  let removeIndex = savedSearches.map(item => { return item.id; }).indexOf(id);
  savedSearches.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
