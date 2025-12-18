CREATE TABLE `conversations` (
	`id` varchar(64) NOT NULL,
	`participant1Id` varchar(64) NOT NULL,
	`participant2Id` varchar(64) NOT NULL,
	`lastMessageAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loyaltyPoints` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`points` int DEFAULT 0,
	`tier` enum('bronze','silver','gold','platinum') DEFAULT 'bronze',
	`lifetimePoints` int DEFAULT 0,
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `loyaltyPoints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(64) NOT NULL,
	`conversationId` varchar(64) NOT NULL,
	`senderId` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notificationSettings` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`emailNotifications` boolean DEFAULT true,
	`smsNotifications` boolean DEFAULT false,
	`pushNotifications` boolean DEFAULT true,
	`bookingUpdates` boolean DEFAULT true,
	`paymentUpdates` boolean DEFAULT true,
	`promotions` boolean DEFAULT true,
	`reviews` boolean DEFAULT true,
	`messages` boolean DEFAULT true,
	CONSTRAINT `notificationSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`type` enum('booking','payment','review','message','system','promotion') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`actionUrl` varchar(512),
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pointTransactions` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`points` int NOT NULL,
	`type` enum('earned','redeemed','expired') NOT NULL,
	`reason` varchar(255),
	`referenceId` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `pointTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userReferrals` (
	`id` varchar(64) NOT NULL,
	`referrerId` varchar(64) NOT NULL,
	`referredUserId` varchar(64),
	`referralCode` varchar(32) NOT NULL,
	`status` enum('pending','completed') DEFAULT 'pending',
	`rewardPoints` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `userReferrals_id` PRIMARY KEY(`id`)
);
