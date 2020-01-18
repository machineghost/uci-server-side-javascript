# Database Setup Instructions

(**Step #0:** If you've previously created the database in this project and wish to re-create it, first run `dropdb jokes`.)

1. `createdb jokes`
    * normally you will begin with this step, which creates the database
2. `psql -d jokes -f sql/initial.sql`
    * this step creates our *schema*, by running the SQL commands in initial.sql
3. `psql -d jokes -f sql/seed.sql`
    * this step creates *seed data* in our databasem by running the SQL commands in seed.sql
4. `psql -d jokes`
    * start the interactive prompt
4. `psql -d jokes -f someFile.sql`
    * applies the commands in `someFile.sql` to the database

# Example Queries

To "play" with your new database you may wish to try running some queries, using either a file or the interactive prompt:

* List all categories
  * `SELECT * FROM categories;`
* List all jokes, with their creator's data 
  * `SELECT * FROM jokes JOIN users u ON jokes.created_by = u.id;`
* List all jokes, with their categories (one record per joke + category combination)
    * `SELECT * FROM jokes j JOIN jokes_categories jc ON j.id = jc.joke_id JOIN categories c ON jc.category_id = c.id;`
* List all jokes, with their categories where that category is "Chicken" jokes
    * `SELECT * FROM jokes j JOIN jokes_categories jc ON j.id = jc.joke_id JOIN categories c ON jc.category_id = c.id WHERE c.title = 'Chicken';`

* See me, as a precursor to repalcing me: remember to always SELECT before UPDATE-ing
  * `SELECT * FROM users WHERE display_name='Jeremy Walker';`
* Replace my entry with your name/username
  * `UPDATE users set display_name='Your Name', username='Your_Username' WHERE display_name='Jeremy Walker';`

* Add a joke
  * `INSERT INTO jokes (id, title, question, answer, created_by, created_on) VALUES (6, 'your joke title', 'your joke question', 'your joke answer', 1, CURRENT_TIMESTAMP);`

* See joke #3 (before removing it)
  * `SELECT * FROM jokes WHERE id = 3;`
* Remove joke #3 
  * `DELETE FROM jokes WHERE id = 3;`


# Web Application
The example web application from last week is also still available, although neither it nor its test have changed since last week.

To see the example server please follow these steps:
1. `npm i`
2. `npm run start`
3. Browse to http://localhost:8000/

To see the tests for the example server please follow these steps:

1. `npm i`
2. `npm run test`
