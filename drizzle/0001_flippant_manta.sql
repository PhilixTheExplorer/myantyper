CREATE TABLE "history" (
	"seq" bigint GENERATED ALWAYS AS IDENTITY (sequence name "history_seq_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"id" text NOT NULL,
	"schema_version" integer NOT NULL,
	"completed_at" bigint NOT NULL,
	"lesson_id" text NOT NULL,
	"title" text NOT NULL,
	"wpm" double precision NOT NULL,
	"accuracy" double precision NOT NULL,
	"seconds" double precision NOT NULL,
	"keystrokes" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "history_user_id_id_pk" PRIMARY KEY("user_id","id"),
	CONSTRAINT "history_seq_unique" UNIQUE("seq")
);
--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "history_user_id_seq_idx" ON "history" USING btree ("user_id","seq");--> statement-breakpoint
CREATE INDEX "history_user_id_completed_at_idx" ON "history" USING btree ("user_id","completed_at");