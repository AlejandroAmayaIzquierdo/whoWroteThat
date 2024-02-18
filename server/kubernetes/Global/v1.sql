CREATE DATABASE IF NOT EXISTS who_wrote_that;

USE who_wrote_that;

CREATE TABLE users (
    id VARCHAR(15) NOT NULL PRIMARY KEY,
    userName VARCHAR(60) NOT NULL DEFAULT '',
    CONSTRAINT UC_userName UNIQUE (userName)
);

CREATE TABLE user_key (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(15) NOT NULL,
    hashed_password VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE user_session (
    id VARCHAR(127) NOT NULL PRIMARY KEY,
    user_id VARCHAR(15) NOT NULL,
    active_expires BIGINT UNSIGNED NOT NULL,
    idle_expires BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE `rooms` (
	`id` VARCHAR(200) NOT NULL COLLATE 'latin1_swedish_ci',
	`players` VARCHAR(200) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`maxUsers` INT(11) NOT NULL DEFAULT '2',
	`isActive` BIT(1) NOT NULL,
	`isEnded` BIT(1) NOT NULL,
	`endedAt` VARCHAR(100) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`gameData` TEXT NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`winnerUser` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci';

CREATE TABLE `cron_tasks` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
    `schedule` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
    `is_active` TINYINT(1) UNSIGNED NOT NULL DEFAULT '0',
    `lastEnd` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
    PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci';

CREATE TABLE `chats` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `pack` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
    `difficulty` INT(11) NULL DEFAULT NULL,
    PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci';

CREATE TABLE `messages` (
    `messageID` INT(11) NOT NULL AUTO_INCREMENT,
    `chatID` INT(11) NOT NULL,
    `message` VARCHAR(300) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
    `isMine` TINYINT(4) NOT NULL DEFAULT '0',
    PRIMARY KEY (`messageID`) USING BTREE,
    INDEX `chat` (`chatID`) USING BTREE
)
COLLATE='latin1_swedish_ci';

CREATE TABLE `storage` (
	`storageId` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(200) NOT NULL COLLATE 'latin1_swedish_ci',
	`type` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`path` MEDIUMTEXT NOT NULL COLLATE 'latin1_swedish_ci',
	`hash` VARCHAR(300) NOT NULL COLLATE 'latin1_swedish_ci',
	PRIMARY KEY (`storageId`) USING BTREE
)
COLLATE='latin1_swedish_ci';

INSERT INTO `cron_tasks` (`name`, `schedule`, `is_active`, `lastEnd`) VALUES ('SessionCron', '0 * * * *', 1, '2023-12-03 17:33:43');


INSERT INTO `chats` (`id`, `pack`, `difficulty`) VALUES (1, 'initial', 1);
INSERT INTO `chats` (`id`, `pack`, `difficulty`) VALUES (2, 'initial', 1);
INSERT INTO `chats` (`id`, `pack`, `difficulty`) VALUES (3, 'iniital', 1);
INSERT INTO `chats` (`id`, `pack`, `difficulty`) VALUES (4, 'initial', 1);


INSERT INTO `messages` (`messageID`, `chatID`, `message`, `isMine`) VALUES (1, 1, 'Haha saw a stripper last night that looked exactly like you but a little hotter', 0);
INSERT INTO `messages` (`messageID`, `chatID`, `message`, `isMine`) VALUES (2, 2, 'I enjoyed our date but I know it was you who farted', 0);
INSERT INTO `messages` (`messageID`, `chatID`, `message`, `isMine`) VALUES (3, 3, 'Any last words?', 0);
INSERT INTO `messages` (`messageID`, `chatID`, `message`, `isMine`) VALUES (4, 4, 'Two roads diverged in a wood, and I, I took the one less travveled by, and tha has made all the difference.', 0);
INSERT INTO `messages` (`messageID`, `chatID`, `message`, `isMine`) VALUES (5, 4, 'So how do yoi feel about anal now, babe?', 0);
