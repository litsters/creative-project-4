
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('searches', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('keywords');
      table.string('location');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    }),
  ]);  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('searches'),
  ]);  
};
