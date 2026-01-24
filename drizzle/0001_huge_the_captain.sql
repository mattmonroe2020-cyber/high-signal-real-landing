CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` varchar(50) NOT NULL,
	`eventData` json,
	`sessionId` varchar(64),
	`leadId` int,
	`source` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_sequences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`sequenceNumber` int NOT NULL,
	`emailType` enum('playbook','followup-1','followup-2','followup-3') NOT NULL,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`scheduledFor` timestamp NOT NULL,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_sequences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`company` varchar(200),
	`stage` enum('pre-seed','seed','series-a','other'),
	`isNeurodivergent` boolean DEFAULT false,
	`source` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`hasBookedCall` boolean DEFAULT false,
	`bookedCallAt` timestamp,
	`playbookSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `leads_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `page_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`page` varchar(200) NOT NULL,
	`referrer` text,
	`source` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `page_views_id` PRIMARY KEY(`id`)
);
