CREATE TABLE `cart` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`itemType` enum('event','venue','hotel','vendor') NOT NULL,
	`itemId` varchar(64) NOT NULL,
	`quantity` int DEFAULT 1,
	`selectedOptions` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `cart_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partnerPosts` (
	`id` varchar(64) NOT NULL,
	`partnerId` varchar(64) NOT NULL,
	`partnerType` enum('vendor','venue','hotel') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`images` text,
	`category` varchar(100),
	`tags` text,
	`itemType` enum('product','service','promotion','announcement') NOT NULL,
	`price` int,
	`linkedItemId` varchar(64),
	`likeCount` int DEFAULT 0,
	`commentCount` int DEFAULT 0,
	`viewCount` int DEFAULT 0,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'published',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `partnerPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userInterests` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`category` varchar(100) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `userInterests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlist` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`itemType` enum('event','venue','hotel','vendor') NOT NULL,
	`itemId` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `wishlist_id` PRIMARY KEY(`id`)
);
