CREATE TABLE "shared_html" (
	"id" text PRIMARY KEY NOT NULL,
	"share_id" text NOT NULL,
	"title" text,
	"markdown" text NOT NULL,
	"html" text NOT NULL,
	"user_id" text,
	"view_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shared_html_share_id_unique" UNIQUE("share_id")
);
--> statement-breakpoint
ALTER TABLE "shared_html" ADD CONSTRAINT "shared_html_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shared_html_share_id_idx" ON "shared_html" USING btree ("share_id");--> statement-breakpoint
CREATE INDEX "shared_html_user_id_idx" ON "shared_html" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "shared_html_created_at_idx" ON "shared_html" USING btree ("created_at");