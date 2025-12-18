CREATE TABLE `b2bPartners` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`businessType` enum('venue_owner','hotel_owner','event_organizer','agent') NOT NULL,
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`status` enum('pending','approved','rejected','suspended') NOT NULL DEFAULT 'pending',
	`credits` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `b2bPartners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`bookingType` enum('event','venue','hotel') NOT NULL,
	`referenceId` varchar(64) NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`quantity` int DEFAULT 1,
	`totalAmount` int NOT NULL,
	`status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
	`paymentStatus` enum('pending','paid','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` varchar(64) NOT NULL,
	`postId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('concert','conference','wedding','party','sports','festival','other') NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`location` varchar(255),
	`venueId` varchar(64),
	`organizerId` varchar(64) NOT NULL,
	`capacity` int,
	`price` int NOT NULL,
	`imageUrl` varchar(500),
	`status` enum('draft','published','cancelled','completed') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `follows` (
	`id` varchar(64) NOT NULL,
	`followerId` varchar(64) NOT NULL,
	`followingId` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `follows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hotels` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`address` varchar(500) NOT NULL,
	`city` varchar(100) NOT NULL,
	`state` varchar(100),
	`country` varchar(100) NOT NULL,
	`starRating` int,
	`pricePerNight` int,
	`amenities` text,
	`imageUrl` varchar(500),
	`ownerId` varchar(64) NOT NULL,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `hotels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` varchar(64) NOT NULL,
	`postId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(64) NOT NULL,
	`bookingId` varchar(64) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(10) DEFAULT 'USD',
	`paymentMethod` varchar(50),
	`transactionId` varchar(255),
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`imageUrl` varchar(500),
	`eventId` varchar(64),
	`likesCount` int DEFAULT 0,
	`commentsCount` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `venues` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`address` varchar(500) NOT NULL,
	`city` varchar(100) NOT NULL,
	`state` varchar(100),
	`country` varchar(100) NOT NULL,
	`capacity` int,
	`pricePerDay` int,
	`amenities` text,
	`imageUrl` varchar(500),
	`ownerId` varchar(64) NOT NULL,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `venues_id` PRIMARY KEY(`id`)
);
