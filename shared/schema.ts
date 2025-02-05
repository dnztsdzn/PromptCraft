import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  template: text("template").notNull(),
  createdBy: integer("created_by")
    .notNull()
    .references(() => users.id),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPromptSchema = createInsertSchema(prompts).pick({
  title: true,
  description: true,
  template: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type User = typeof users.$inferSelect;
export type Prompt = typeof prompts.$inferSelect;
