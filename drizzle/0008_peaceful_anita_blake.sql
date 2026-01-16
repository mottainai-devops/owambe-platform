CREATE TABLE `emailEvents` (
	`id` varchar(64) NOT NULL,
	`eventName` varchar(100) NOT NULL,
	`eventLabel` varchar(255) NOT NULL,
	`eventDescription` text,
	`recipientType` enum('user','partner','admin','custom') NOT NULL,
	`subject` varchar(500) NOT NULL,
	`htmlTemplate` text NOT NULL,
	`textTemplate` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailLogs` (
	`id` varchar(64) NOT NULL,
	`eventName` varchar(100) NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`recipientName` varchar(255),
	`recipientType` varchar(50),
	`subject` varchar(500) NOT NULL,
	`status` enum('pending','sent','failed','bounced') DEFAULT 'pending',
	`sentAt` timestamp,
	`failureReason` text,
	`retryCount` int DEFAULT 0,
	`metadata` json,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `emailLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailSettings` (
	`id` varchar(64) NOT NULL,
	`smtpHost` varchar(255) NOT NULL,
	`smtpPort` int NOT NULL,
	`smtpSecure` boolean DEFAULT true,
	`smtpUser` varchar(255) NOT NULL,
	`smtpPassword` varchar(255) NOT NULL,
	`fromEmail` varchar(320) NOT NULL,
	`fromName` varchar(255) NOT NULL,
	`replyToEmail` varchar(320),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `b2bPartners` ADD `businessTypes` json NOT NULL;--> statement-breakpoint
ALTER TABLE `b2bPartners` ADD `businessDescription` text;--> statement-breakpoint
ALTER TABLE `b2bPartners` ADD `reviewedBy` varchar(64);--> statement-breakpoint
ALTER TABLE `b2bPartners` ADD `reviewedAt` timestamp;--> statement-breakpoint
ALTER TABLE `b2bPartners` ADD `rejectionReason` text;--> statement-breakpoint
ALTER TABLE `b2bPartners` ADD `slug` varchar(255);--> statement-breakpoint
ALTER TABLE `b2bPartners` ADD `updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `events` ADD `slug` varchar(255);--> statement-breakpoint
ALTER TABLE `hotels` ADD `slug` varchar(255);--> statement-breakpoint
ALTER TABLE `venues` ADD `slug` varchar(255);--> statement-breakpoint
ALTER TABLE `b2bPartners` DROP COLUMN `businessType`;