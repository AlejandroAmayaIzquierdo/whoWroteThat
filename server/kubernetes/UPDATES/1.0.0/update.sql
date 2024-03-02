INSERT INTO `cron_tasks` (`id`, `name`, `schedule`, `is_active`, `lastEnd`) VALUES (1, 'SessionCron', '0 0 * * *', 1, '2024-03-02 17:00:00');
INSERT INTO `cron_tasks` (`id`, `name`, `schedule`, `is_active`, `lastEnd`) VALUES (2, 'CloseGamesCron', '0 * * * *', 1, '2024-03-02 17:27:00');


INSERT INTO `chats` (`id`, `pack`, `difficulty`) VALUES (1, 'initial', 1);
INSERT INTO `chats` (`id`, `pack`, `difficulty`) VALUES (2, 'initial', 1);
INSERT INTO `chats` (`id`, `pack`, `difficulty`) VALUES (3, 'iniital', 1);
INSERT INTO `chats` (`id`, `pack`, `difficulty`) VALUES (4, 'initial', 1);


INSERT INTO `messages` (`messageID`, `chatID`, `message`, `isMine`) VALUES (1, 1, 'Haha saw a stripper last night that looked exactly like you but a little hotter', 0);
INSERT INTO `messages` (`messageID`, `chatID`, `message`, `isMine`) VALUES (2, 2, 'I enjoyed our date but I know it was you who farted', 0);
INSERT INTO `messages` (`messageID`, `chatID`, `message`, `isMine`) VALUES (3, 3, 'Any last words?', 0);
INSERT INTO `messages` (`messageID`, `chatID`, `message`, `isMine`) VALUES (4, 4, 'Two roads diverged in a wood, and I, I took the one less travveled by, and tha has made all the difference.', 0);
INSERT INTO `messages` (`messageID`, `chatID`, `message`, `isMine`) VALUES (5, 4, 'So how do yoi feel about anal now, babe?', 0);
