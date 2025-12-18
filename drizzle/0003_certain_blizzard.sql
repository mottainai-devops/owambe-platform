CREATE TABLE `vendorBookings` (
	`id` varchar(64) NOT NULL,
	`vendorId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`eventDate` timestamp NOT NULL,
	`eventType` varchar(100),
	`guestCount` int,
	`selectedPackage` text,
	`customRequirements` text,
	`totalAmount` int NOT NULL,
	`depositAmount` int,
	`depositPaid` int DEFAULT 0,
	`status` enum('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
	`paymentStatus` enum('pending','deposit_paid','fully_paid','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `vendorBookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendorReviews` (
	`id` varchar(64) NOT NULL,
	`vendorId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`bookingId` varchar(64),
	`rating` int NOT NULL,
	`review` text,
	`images` text,
	`response` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `vendorReviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` varchar(64) NOT NULL,
	`ownerId` varchar(64) NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`vendorType` enum('catering','photography','entertainment','decoration','planning','equipment','security','transportation','other') NOT NULL,
	`description` text,
	`serviceArea` varchar(255),
	`basePrice` int,
	`priceUnit` varchar(50),
	`portfolio` text,
	`offerings` text,
	`perks` text,
	`rating` int DEFAULT 0,
	`reviewCount` int DEFAULT 0,
	`totalBookings` int DEFAULT 0,
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`website` varchar(500),
	`verified` int DEFAULT 0,
	`featured` int DEFAULT 0,
	`status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `vendors_id` PRIMARY KEY(`id`)
);
