import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const widgets = pgTable("widgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  token: text("token").notNull().unique(),
  notionToken: text("notion_token").notNull(),
  databaseUrl: text("database_url").notNull(),
  title: text("title").notNull(),
  gridSize: text("grid_size").notNull().default("3x3"),
  instagramHandle: text("instagram_handle"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWidgetSchema = createInsertSchema(widgets).pick({
  notionToken: true,
  databaseUrl: true,
  title: true,
  gridSize: true,
  instagramHandle: true,
});

export const widgetSetupSchema = z.object({
  notionToken: z.string().min(1, "Notion token is required").refine((token) => token.startsWith("ntn_") || token.startsWith("secret_"), {
    message: "Token must start with 'ntn_' or 'secret_'",
  }),
  databaseUrl: z.string().url("Must be a valid URL").refine((url) => url.includes("notion.so"), {
    message: "Must be a Notion database URL",
  }),
  title: z.string().min(1, "Widget title is required"),
  gridSize: z.literal("3x3").default("3x3"),
  instagramHandle: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWidget = z.infer<typeof insertWidgetSchema>;
export type Widget = typeof widgets.$inferSelect;
export type WidgetSetup = z.infer<typeof widgetSetupSchema>;
