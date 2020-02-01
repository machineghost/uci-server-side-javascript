INSERT INTO users
(id, display_name, username)
VALUES
(1, 'Jeremy Walker', 'jwalker'),
(2, 'Testy McFakington' , 'test');

INSERT INTO jokes (id, title, question, answer, created_by) VALUES
(1, 'Cross Twice?', 'Why did the chicken cross the road twice?', 'Because he was a double-crosser!', 1),
(2, 'Turkey Cross?','Why did the turkey cross the road?', 'To prove he wasn''t chicken!', 1),
(3, 'When life gives ...', 'When life gives you melons, you''re dyslexic!', NULL, 1),
(4, 'What do you call a bee ...', 'What do you call a bee that can''t make up its mind?', 'A maybe!', 1),
(5, 'Cow', 'Knock knock. Who''s there? Cow. Cow who?', 'No, a cow says moo!', 1);

INSERT INTO categories (id, title)
VALUES
(1, 'Chicken'),
(2, 'Knock Knock'),
(3, 'One-Line'),
(4, 'Long Form'),
(5, 'Pun');

INSERT INTO jokes_categories
(joke_id, category_id) VALUES
(1, 1), (2, 1), (2, 3), (3, 5),
(4, 5), (5, 2);