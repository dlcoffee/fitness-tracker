CREATE TABLE `workout_logs` (
	`id` integer PRIMARY KEY NOT NULL,
	`weight` integer,
	`repetitions` integer,
	`workout_id` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
