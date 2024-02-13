CREATE TABLE `chats` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`pack` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`difficulty` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=MyISAM
;

CREATE TABLE `messages` (
	`messageID` INT(11) NOT NULL AUTO_INCREMENT,
	`chatID` INT(11) NOT NULL,
	`message` VARCHAR(300) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`isMine` TINYINT(4) NOT NULL DEFAULT '0',
	PRIMARY KEY (`messageID`) USING BTREE,
	INDEX `chat` (`chatID`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=MyISAM
;