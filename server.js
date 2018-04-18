// Set up express
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('dist'));

// Knex setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];  
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

// jwt setup
const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}

// API

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if(!token){
    return res.status(403).send({error: 'No token provided.'});
  }
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if(err){
      console.log('AUTHENTICATE: ' + err);
      return res.status(500).send({error: 'Failed to authenticate token.'});
    }
    req.userID = decoded.id;
    next();
  });
}

// Log in
app.post('/api/login', (req,res) => {
  if(!req.body.username || !req.body.password) return res.status(400).send();
  knex('users').where('username', req.body.username).first().then(user => {
    if(user === undefined){
      res.status(403).send('Invalid credentials');
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.hash), user];
  }).spread((result, user) => {
    if(result){
      let jwtToken = jwt.sign({id: user.id}, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
      });

      let token = {
        username: user.username,
        id: user.id,
        jwt: jwtToken
      };
      res.status(200).json(token);
    }
    else res.status(403).send('Invalid credentials');
    return;
  }).catch(error => {
    if(error.message !== 'abort'){
      console.log('LOGIN: ' + error);
      res.status(500).json({error});
    } 
  });
});

// Register
app.post('/api/register', (req,res) => {
  if(!req.body.username || !req.body.password) return res.status(400).send();
  knex('users').where('username', req.body.username).first().then(user => {
    if(user !== undefined){
      res.status(409).send('Username already exists');
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return knex('users').insert({username: req.body.username, hash: hash});
  }).then(ids => {
    return knex('users').where('id', ids[0]).first().select('username', 'id');
  }).then(user => {
    let jwtToken = jwt.sign({id: user.id}, jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });
    let token = {
      username: user.username,
      id: user.id,
      jwt: jwtToken
    };
    res.status(200).json(token);
    return;
  }).catch(error => {
    if(error.message !== 'abort'){
      console.log('REGISTER: ' + error);
      res.status(500).json({error});
    }
  });
});

// Get searches for a user
app.get('/api/searches/:id', verifyToken, (req,res) => {
  let id = parseInt(req.params.id);
  if(id !== req.userID){
    res.status(403).send();
    return;
  }
  knex('users').join('searches', 'users.id', 'searches.user_id')
    .where('users.id',id)
    .select('searches.id', 'title', 'keywords', 'location').then(searches => {
      res.status(200).json({searches: searches});
    }).catch(error => {
      console.log('GET: ' + error);
      res.status(500).json({error});
    });
});

// Edit search
app.put('/api/searches/:id/:search_id', verifyToken, (req,res) => {
  let id = parseInt(req.params.id);
  if(id !== req.userID){
    res.status(403).send();
    return;
  }
  let search_id = parseInt(req.params.search_id);
  knex('users').where('id', id).first().then(user => {
    return knex('searches').where('id', search_id).update({'keywords': req.body.keywords, 'location': req.body.location});
  }).then(ids => {
    return knex('searches').where('id', ids).first();
  }).then(editedSearch => {
    res.status(200).send(editedSearch);
  }).catch(error => {
    console.log('EDIT: ' + error);
    res.status(500).json({error});
  });
}); 

// Save new search
app.post('/api/searches/:id', verifyToken, (req,res) => {
  let id = parseInt(req.params.id);
  if(id !== req.userID){
    res.status(403).send();
    return;
  }
  knex('users').where('id',id).first().then(user => {
    return knex('searches').insert({title: req.body.title, keywords: req.body.keywords, location: req.body.location, user_id: id});
  }).then(ids => {
    return knex('searches').where('id',ids[0]).first();
  }).then(newSearch => {
    res.status(200).send(newSearch);
  }).catch(error => {
    console.log('SAVE: ' + error);
    res.status(500).json({error});
  });
});

// Delete search
app.delete('/api/searches/:id/:search_id', verifyToken, (req,res) => {
  let id = parseInt(req.params.id);
  if(id !== req.userID){
    res.status(403).send();
    return;
  }
  let search_id = parseInt(req.params.search_id);
  knex('users').where('id', id).first().then(user => {
    return knex('searches').where({'id': search_id, 'user_id': id}).first().del();
  }).then(ids => {
    res.sendStatus(200);
  }).catch(error => {
    console.log('DELETE: ' + error);
    res.status(500).json({error});
  });
});

app.listen(8000, () => console.log('Server listening on port 8000!'));
