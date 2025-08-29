CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TABLE "likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_user_id" text NOT NULL,
	"to_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "likes_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user1_id" text NOT NULL,
	"user2_id" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "matches_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"full_name" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text DEFAULT '',
	"male" "gender" NOT NULL,
	"birthdate" date NOT NULL,
	"bio" text,
	"avatar_url" text,
	"preferences" jsonb DEFAULT '{"age_range":{"min":18,"max":50},"distance":25,"gender_preference":[]}'::jsonb,
	"location_lat" numeric(10, 8),
	"location_lng" numeric(11, 8),
	"last_active" timestamp with time zone DEFAULT now(),
	"is_verified" boolean DEFAULT false,
	"is_online" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_user1_id_users_id_fk" FOREIGN KEY ("user1_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_user2_id_users_id_fk" FOREIGN KEY ("user2_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "likes_unique" ON "likes" USING btree ("from_user_id","to_user_id");--> statement-breakpoint
CREATE INDEX "idx_likes_from_user" ON "likes" USING btree ("from_user_id");--> statement-breakpoint
CREATE INDEX "idx_likes_to_user" ON "likes" USING btree ("to_user_id");--> statement-breakpoint
CREATE INDEX "idx_likes_created_at" ON "likes" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "matches_unique" ON "matches" USING btree ("user1_id","user2_id");--> statement-breakpoint
CREATE INDEX "idx_matches_user1" ON "matches" USING btree ("user1_id");--> statement-breakpoint
CREATE INDEX "idx_matches_user2" ON "matches" USING btree ("user2_id");--> statement-breakpoint
CREATE INDEX "idx_matches_created_at" ON "matches" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_users_username" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_gender" ON "users" USING btree ("male");--> statement-breakpoint
CREATE INDEX "idx_users_birthdate" ON "users" USING btree ("birthdate");--> statement-breakpoint
CREATE INDEX "idx_users_location" ON "users" USING btree ("location_lat","location_lng");--> statement-breakpoint
CREATE INDEX "idx_users_last_active" ON "users" USING btree ("last_active");--> statement-breakpoint
CREATE INDEX "idx_users_created_at" ON "users" USING btree ("created_at");