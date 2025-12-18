CREATE TABLE `availability` (
	`id` varchar(64) NOT NULL,
	`resourceType` enum('venue','hotel') NOT NULL,
	`resourceId` varchar(64) NOT NULL,
	`date` timestamp NOT NULL,
	`availableSlots` int NOT NULL,
	`bookedSlots` int DEFAULT 0,
	`price` int,
	`status` enum('available','booked','blocked') NOT NULL DEFAULT 'available',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `availability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discounts` (
	`id` varchar(64) NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`discountType` enum('percentage','fixed') NOT NULL,
	`discountValue` int NOT NULL,
	`minBookingAmount` int,
	`maxDiscountAmount` int,
	`applicableType` enum('event','venue','hotel','all') NOT NULL,
	`referenceId` varchar(64),
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`usageLimit` int,
	`usageCount` int DEFAULT 0,
	`ownerId` varchar(64) NOT NULL,
	`status` enum('active','inactive','expired') NOT NULL DEFAULT 'active',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `discounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gdsChannels` (
	`id` varchar(64) NOT NULL,
	`channelName` varchar(100) NOT NULL,
	`channelType` enum('ota','gds','metasearch','direct') NOT NULL,
	`apiEndpoint` varchar(500),
	`apiKey` varchar(255),
	`commissionRate` int,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `gdsChannels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `propertyDistribution` (
	`id` varchar(64) NOT NULL,
	`propertyType` enum('venue','hotel') NOT NULL,
	`propertyId` varchar(64) NOT NULL,
	`channelId` varchar(64) NOT NULL,
	`externalId` varchar(255),
	`syncStatus` enum('pending','synced','failed') NOT NULL DEFAULT 'pending',
	`lastSyncAt` timestamp,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `propertyDistribution_id` PRIMARY KEY(`id`)
);
