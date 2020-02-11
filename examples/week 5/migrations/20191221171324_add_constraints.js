exports.up = async knex => {
  await knex.schema.dropTableIfExists('users');
  await knex.schema.createTable('users', table => {
    table.increments();
    table.string('display_name', 100).unique().notNullable();
    table.string('username', 25).unique().notNullable();
    ['created_on', 'last_login'].forEach(column =>
      table.timestamp(column).defaultTo(knex.fn.now())
        .notNullable());
  });
  await knex.schema.dropTableIfExists('jokes');
  await knex.schema.createTable('jokes', table => {
    table.increments();
    table.string('title', 100).notNullable();
    table.text('question').notNullable();
    table.text('answer');
    table.integer('created_by').notNullable();
    table.timestamp('created_on').defaultTo(knex.fn.now()).notNullable();
    table.unique(['question', 'answer']);
  });
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.createTable('categories', table => {
    table.increments();
    table.string('title', 25).notNullable().unique();
  });
  await knex.schema.dropTableIfExists('jokes_categories');
  await knex.schema.createTable('jokes_categories', table => {
    table.integer('joke_id');
    table.foreign('jokes').references('id');
    table.integer('category_id')
    table.foreign('categories').references('id');
    table.primary(['joke_id', 'category_id']);
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists('users');
  await knex.schema.createTable('users', table => {
    table.specificType('id', 'serial');
    table.string('display_name', 100);
    table.string('username', 25);
    ['created_on', 'last_login'].forEach(column =>
      table.timestamp(column)
    );
  });
  await knex.schema.dropTableIfExists('jokes');
  await knex.schema.createTable('jokes', table => {
    table.specificType('id', 'serial');
    table.string('title', 100);
    table.text('question');
    table.text('answer');
    table.integer('created_by');
    table.timestamp('created_on');
  });
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.createTable('categories', table => {
    table.specificType('id', 'serial');
    table.string('title', 25);
  });
  await knex.schema.dropTableIfExists('jokes_categories');
  await knex.schema.createTable('jokes_categories', table => {
    table.integer('joke_id');
    table.integer('category_id');
  });
};

