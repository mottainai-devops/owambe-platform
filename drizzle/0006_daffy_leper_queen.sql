CREATE TABLE `reviewHelpful` (
	`id` varchar(64) NOT NULL,
	`reviewId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `reviewHelpful_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviewResponses` (
	`id` varchar(64) NOT NULL,
	`reviewId` varchar(64) NOT NULL,
	`responderId` varchar(64) NOT NULL,
	`responderType` enum('partner','vendor','admin') NOT NULL,
	`response` text NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `reviewResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`itemType` enum('event','venue','hotel','vendor') NOT NULL,
	`itemId` varchar(64) NOT NULL,
	`bookingId` varchar(64),
	`rating` int NOT NULL,
	`title` varchar(255),
	`comment` text,
	`pros` text,
	`cons` text,
	`photos` text,
	`isVerifiedPurchase` boolean DEFAULT false,
	`helpfulCount` int DEFAULT 0,
	`status` enum('pending','approved','rejected') DEFAULT 'pending',
	`moderatorNotes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
