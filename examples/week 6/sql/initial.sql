-- CREATE DATABASE jokes;
CREATE TABLE users (
  id integer PRIMARY KEY,
  display_name varchar(100) NOT NULL,
  username varchar(25) UNIQUE NOT NULL,
  created_on timestamp NOT NULL
             DEFAULT CURRENT_TIMESTAMP,
  last_login timestamp NOT NULL
             DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE jokes (
  id integer PRIMARY KEY,
  title varchar(100) NOT NULL,
  question text NOT NULL,
  answer text,
  created_by integer NOT NULL,
  created_on timestamp NOT NULL
             DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id integer PRIMARY KEY,
  title varchar(100) NOT NULL
);

CREATE TABLE jokes_categories (
  joke_id integer NOT NULL,
  category_id integer NOT NULL
);