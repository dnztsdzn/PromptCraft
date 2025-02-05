import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { processPrompt } from "./openai";
import { insertPromptSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Admin check middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.user?.isAdmin) {
      return res.status(403).send("Admin access required");
    }
    next();
  };

  // Prompts management (admin only)
  app.post("/api/prompts", requireAdmin, async (req, res) => {
    try {
      const data = insertPromptSchema.parse(req.body);
      const prompt = await storage.createPrompt(data, req.user!.id);
      res.status(201).json(prompt);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/prompts", async (req, res) => {
    const prompts = await storage.getPrompts();
    res.json(prompts);
  });

  app.delete("/api/prompts/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deletePrompt(parseInt(req.params.id));
      res.sendStatus(200);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/prompts/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertPromptSchema.partial().parse(req.body);
      const prompt = await storage.updatePrompt(parseInt(req.params.id), data);
      res.json(prompt);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Process user input with prompt
  app.post("/api/process/:promptId", async (req, res) => {
    try {
      const prompt = await storage.getPrompt(parseInt(req.params.promptId));
      if (!prompt) {
        return res.status(404).send("Prompt not found");
      }

      const response = await processPrompt(prompt.template, req.body.input);
      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
