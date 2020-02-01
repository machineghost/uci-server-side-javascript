INSERT INTO users
(display_name, username)
VALUES
('Jeremy Walker', 'jwalker'),
('Testy McFakington' , 'test');

INSERT INTO jokes (title, question, answer, created_by) VALUES
('Cross Twice?', 'Why did the chicken cross the road twice?', 'Because he was a double-crosser!', 1),
('Turkey Cross?','Why did the turkey cross the road?', 'To prove he wasn''t chicken!', 1),
('When life gives ...', 'When life gives you melons, you''re dyslexic!', NULL, 1),
('What do you call a bee ...', 'What do you call a bee that can''t make up its mind?', 'A maybe!', 1),
('Cow', 'Knock knock. Who''s there? Cow. Cow who?', 'No, a cow says moo!', 1);

INSERT INTO categories (title)
VALUES
('Chicken'),
('Knock Knock'),
('One-Line'),
('Long Form'),
('Pun');

INSERT INTO jokes_categories
(joke_id, category_id) VALUES
(1, 1), (2, 1), (2, 3), (3, 5),
(4, 5), (5, 2);
