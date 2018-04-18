// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[env];  
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

let savedSearches = [];
savedSearches.push({title: 'test', keywords: 'these are keywords', location: 'this is a location', username: 'sam'});

let users = [];
users.push({username: 'sam'});

let deleteSearches = () => {
  return knex('searches').del();
}

let deleteUsers = () => {
  return knex('users').del();
}

let insertSearches = () => {
  let promises = [];
  savedSearches.forEach(savedSearch => {
    //promises.push(knex('searches').insert({keywords: savedSearch.keywords, location: savedSearch.location, userID:  }));
    promises.push(knex('users').where('username', savedSearch.username).first().then(user => {
      return knex('searches').insert({keywords: savedSearch.keywords, location: savedSearch.location, title: savedSearch.title, user_id: user.id})
    }));
  });
  return Promise.all(promises);
}

let insertUsers = () => {
  let promises = [];
  users.forEach(user => {
    let hash = bcrypt.hashSync('test', saltRounds);
    promises.push(knex('users').insert({username: user.username, hash: hash}));
  });
  return Promise.all(promises);
}

deleteSearches().then(() => {
  return deleteUsers();
}).then(() => {
  return insertUsers();
}).then(() => {
  return insertSearches();
}).then(() => {
  console.log('OK, searches created');
});
