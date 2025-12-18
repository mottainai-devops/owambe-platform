CREATE TABLE `adminActivityLogs` (
	`id` varchar(64) NOT NULL,
	`adminId` varchar(64) NOT NULL,
	`action` varchar(255) NOT NULL,
	`targetType` varchar(50),
	`targetId` varchar(64),
	`details` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `adminActivityLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `adminRoles` (
	`id` varchar(64) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`permissions` text,
	`level` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `adminRoles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admins` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`roleId` varchar(64) NOT NULL,
	`permissions` text,
	`status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
	`createdAt` timestamp DEFAULT (now()),
	`lastLoginAt` timestamp,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agentCommissions` (
	`id` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`referralId` varchar(64) NOT NULL,
	`bookingId` varchar(64) NOT NULL,
	`productType` enum('event','venue','hotel','vendor') NOT NULL,
	`productId` varchar(64) NOT NULL,
	`bookingAmount` int NOT NULL,
	`commissionRate` int NOT NULL,
	`commissionAmount` int NOT NULL,
	`status` enum('pending','approved','paid','cancelled','disputed') NOT NULL DEFAULT 'pending',
	`approvedBy` varchar(64),
	`approvedAt` timestamp,
	`paidAt` timestamp,
	`payoutId` varchar(64),
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `agentCommissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agentCustomers` (
	`id` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`customerId` varchar(64),
	`customerName` varchar(255),
	`customerEmail` varchar(320),
	`customerPhone` varchar(50),
	`leadStatus` enum('lead','prospect','customer','inactive') NOT NULL DEFAULT 'lead',
	`leadSource` varchar(100),
	`totalBookings` int DEFAULT 0,
	`totalSpent` int DEFAULT 0,
	`lastContactAt` timestamp,
	`notes` text,
	`tags` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `agentCustomers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agentReferrals` (
	`id` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`referralCode` varchar(100) NOT NULL,
	`productType` enum('event','venue','hotel','vendor','general') NOT NULL,
	`productId` varchar(64),
	`customerId` varchar(64),
	`bookingId` varchar(64),
	`clickCount` int DEFAULT 0,
	`conversionStatus` enum('pending','converted','cancelled') NOT NULL DEFAULT 'pending',
	`conversionValue` int,
	`commissionAmount` int,
	`commissionStatus` enum('pending','approved','paid','cancelled') NOT NULL DEFAULT 'pending',
	`metadata` text,
	`createdAt` timestamp DEFAULT (now()),
	`convertedAt` timestamp,
	CONSTRAINT `agentReferrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `agentReferrals_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `agentTargets` (
	`id` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`targetType` enum('sales','bookings','customers','revenue') NOT NULL,
	`targetValue` int NOT NULL,
	`currentValue` int DEFAULT 0,
	`period` enum('daily','weekly','monthly','quarterly','yearly') NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`reward` text,
	`status` enum('active','achieved','failed','cancelled') NOT NULL DEFAULT 'active',
	`achievedAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `agentTargets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agentWalletTransactions` (
	`id` varchar(64) NOT NULL,
	`walletId` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`transactionType` enum('credit','debit','withdrawal','adjustment') NOT NULL,
	`amount` int NOT NULL,
	`balanceBefore` int NOT NULL,
	`balanceAfter` int NOT NULL,
	`referenceType` varchar(50),
	`referenceId` varchar(64),
	`description` text,
	`metadata` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `agentWalletTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agentWallets` (
	`id` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`balance` int DEFAULT 0,
	`pendingBalance` int DEFAULT 0,
	`totalEarned` int DEFAULT 0,
	`totalWithdrawn` int DEFAULT 0,
	`currency` varchar(10) DEFAULT 'NGN',
	`lastTransactionAt` timestamp,
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `agentWallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `agentWallets_agentId_unique` UNIQUE(`agentId`)
);
--> statement-breakpoint
CREATE TABLE `agentWithdrawals` (
	`id` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`walletId` varchar(64) NOT NULL,
	`amount` int NOT NULL,
	`bankName` varchar(255) NOT NULL,
	`accountNumber` varchar(50) NOT NULL,
	`accountName` varchar(255) NOT NULL,
	`withdrawalMethod` enum('bank_transfer','mobile_money','paypal','other') NOT NULL,
	`status` enum('pending','processing','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`processedBy` varchar(64),
	`transactionReference` varchar(255),
	`failureReason` text,
	`processedAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `agentWithdrawals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agents` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`agentCode` varchar(50) NOT NULL,
	`businessName` varchar(255),
	`phoneNumber` varchar(50),
	`address` text,
	`city` varchar(100),
	`state` varchar(100),
	`country` varchar(100),
	`territory` text,
	`tier` enum('bronze','silver','gold','platinum') NOT NULL DEFAULT 'bronze',
	`commissionRate` int,
	`totalSales` int DEFAULT 0,
	`totalCommission` int DEFAULT 0,
	`totalCustomers` int DEFAULT 0,
	`rating` int DEFAULT 0,
	`reviewCount` int DEFAULT 0,
	`bankName` varchar(255),
	`accountNumber` varchar(50),
	`accountName` varchar(255),
	`taxId` varchar(100),
	`status` enum('pending','active','suspended','terminated') NOT NULL DEFAULT 'pending',
	`verifiedAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `agents_id` PRIMARY KEY(`id`),
	CONSTRAINT `agents_agentCode_unique` UNIQUE(`agentCode`)
);
--> statement-breakpoint
CREATE TABLE `commissionRates` (
	`id` varchar(64) NOT NULL,
	`entityType` enum('partner','agent') NOT NULL,
	`productType` enum('event','venue','hotel','vendor','all') NOT NULL,
	`rateType` enum('percentage','fixed') NOT NULL,
	`rateValue` int NOT NULL,
	`minAmount` int,
	`maxAmount` int,
	`tierName` varchar(100),
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`effectiveFrom` timestamp NOT NULL,
	`effectiveTo` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `commissionRates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `paymentDisputes` (
	`id` varchar(64) NOT NULL,
	`paymentId` varchar(64) NOT NULL,
	`bookingId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`disputeType` enum('chargeback','inquiry','fraud','other') NOT NULL,
	`amount` int NOT NULL,
	`reason` text,
	`evidence` text,
	`gatewayReference` varchar(255),
	`status` enum('open','under_review','won','lost','closed') NOT NULL DEFAULT 'open',
	`assignedTo` varchar(64),
	`resolution` text,
	`resolvedAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `paymentDisputes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `paymentGateways` (
	`id` varchar(64) NOT NULL,
	`gatewayName` varchar(100) NOT NULL,
	`gatewayType` enum('paystack','flutterwave','stripe','paypal','other') NOT NULL,
	`publicKey` varchar(255),
	`secretKey` varchar(255),
	`webhookSecret` varchar(255),
	`supportedCurrencies` text,
	`supportedMethods` text,
	`isDefault` int DEFAULT 0,
	`priority` int DEFAULT 0,
	`status` enum('active','inactive','testing') NOT NULL DEFAULT 'active',
	`config` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `paymentGateways_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `paymentMethods` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`methodType` enum('card','bank_account','mobile_money','wallet') NOT NULL,
	`provider` varchar(100),
	`last4` varchar(4),
	`brand` varchar(50),
	`expiryMonth` int,
	`expiryYear` int,
	`bankName` varchar(255),
	`accountName` varchar(255),
	`isDefault` int DEFAULT 0,
	`token` varchar(255),
	`metadata` text,
	`status` enum('active','expired','removed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `paymentMethods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payouts` (
	`id` varchar(64) NOT NULL,
	`recipientType` enum('partner','agent') NOT NULL,
	`recipientId` varchar(64) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(10) DEFAULT 'NGN',
	`payoutMethod` enum('bank_transfer','mobile_money','wallet','paypal') NOT NULL,
	`bankName` varchar(255),
	`accountNumber` varchar(50),
	`accountName` varchar(255),
	`transactionReference` varchar(255),
	`gatewayReference` varchar(255),
	`status` enum('pending','processing','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`processedBy` varchar(64),
	`failureReason` text,
	`metadata` text,
	`scheduledFor` timestamp,
	`processedAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `payouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platformSettings` (
	`id` varchar(64) NOT NULL,
	`settingKey` varchar(100) NOT NULL,
	`settingValue` text NOT NULL,
	`settingType` enum('string','number','boolean','json') NOT NULL,
	`category` varchar(100),
	`description` text,
	`updatedBy` varchar(64),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `platformSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `platformSettings_settingKey_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` varchar(64) NOT NULL,
	`paymentId` varchar(64) NOT NULL,
	`bookingId` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(10) DEFAULT 'NGN',
	`reason` text,
	`refundMethod` enum('original_payment','wallet','bank_transfer') NOT NULL,
	`gatewayReference` varchar(255),
	`status` enum('pending','processing','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`processedBy` varchar(64),
	`failureReason` text,
	`processedAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `refunds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supportTickets` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` enum('booking','payment','account','technical','other') NOT NULL,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`assignedTo` varchar(64),
	`attachments` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	`resolvedAt` timestamp,
	CONSTRAINT `supportTickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticketMessages` (
	`id` varchar(64) NOT NULL,
	`ticketId` varchar(64) NOT NULL,
	`senderId` varchar(64) NOT NULL,
	`senderType` enum('user','admin') NOT NULL,
	`message` text NOT NULL,
	`attachments` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `ticketMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `walletTransactions` (
	`id` varchar(64) NOT NULL,
	`walletType` enum('user','partner','agent') NOT NULL,
	`walletOwnerId` varchar(64) NOT NULL,
	`transactionType` enum('credit','debit','refund','withdrawal','commission','adjustment') NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(10) DEFAULT 'NGN',
	`balanceBefore` int NOT NULL,
	`balanceAfter` int NOT NULL,
	`referenceType` varchar(50),
	`referenceId` varchar(64),
	`description` text,
	`metadata` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `walletTransactions_id` PRIMARY KEY(`id`)
);
