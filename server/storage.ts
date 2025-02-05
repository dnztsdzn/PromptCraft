import { IStorage } from "./types";
import { InsertPrompt, InsertUser, Prompt, User } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private prompts: Map<number, Prompt>;
  sessionStore: session.Store;
  currentUserId: number;
  currentPromptId: number;

  constructor() {
    this.users = new Map();
    this.prompts = new Map();
    this.currentUserId = 1;
    this.currentPromptId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  async createPrompt(insertPrompt: InsertPrompt, userId: number): Promise<Prompt> {
    const id = this.currentPromptId++;
    const prompt: Prompt = { ...insertPrompt, id, createdBy: userId };
    this.prompts.set(id, prompt);
    return prompt;
  }

  async getPrompts(): Promise<Prompt[]> {
    return Array.from(this.prompts.values());
  }

  async getPrompt(id: number): Promise<Prompt | undefined> {
    return this.prompts.get(id);
  }

  async deletePrompt(id: number): Promise<void> {
    this.prompts.delete(id);
  }

  async updatePrompt(id: number, data: Partial<InsertPrompt>): Promise<Prompt> {
    const prompt = this.prompts.get(id);
    if (!prompt) throw new Error("Prompt not found");
    const updatedPrompt = { ...prompt, ...data };
    this.prompts.set(id, updatedPrompt);
    return updatedPrompt;
  }
}

export const storage = new MemStorage();
