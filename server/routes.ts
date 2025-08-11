import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { widgetSetupSchema } from "@shared/schema";
import { validateNotionToken, validateNotionDatabase, getDatabaseSchema, getDatabasePages } from "./notion";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Validate Notion token
  app.post("/api/validate-token", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token || typeof token !== "string") {
        return res.status(400).json({ 
          success: false, 
          message: "Token is required" 
        });
      }

      const isValid = await validateNotionToken(token);
      
      res.json({ 
        success: isValid,
        message: isValid ? "Token is valid" : "Invalid token"
      });
    } catch (error) {
      console.error("Token validation error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to validate token" 
      });
    }
  });

  // Validate Notion database
  app.post("/api/validate-database", async (req, res) => {
    try {
      const { token, databaseUrl } = req.body;
      
      if (!token || !databaseUrl) {
        return res.status(400).json({ 
          success: false, 
          message: "Token and database URL are required" 
        });
      }

      const isValid = await validateNotionDatabase(token, databaseUrl);
      
      res.json({ 
        success: isValid,
        message: isValid ? "Database is accessible" : "Cannot access database"
      });
    } catch (error) {
      console.error("Database validation error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to validate database" 
      });
    }
  });

  // Create widget
  app.post("/api/widgets", async (req, res) => {
    try {
      const validatedData = widgetSetupSchema.parse(req.body);
      
      // Validate token and database access
      const [tokenValid, dbValid] = await Promise.all([
        validateNotionToken(validatedData.notionToken),
        validateNotionDatabase(validatedData.notionToken, validatedData.databaseUrl)
      ]);

      if (!tokenValid) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid Notion token" 
        });
      }

      if (!dbValid) {
        return res.status(400).json({ 
          success: false, 
          message: "Cannot access Notion database" 
        });
      }

      const widget = await storage.createWidget(validatedData);
      
      res.json({ 
        success: true, 
        widget: {
          id: widget.id,
          token: widget.token,
          title: widget.title,
          gridSize: widget.gridSize,
          instagramHandle: widget.instagramHandle,
          createdAt: widget.createdAt
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation failed",
          errors: error.errors
        });
      }
      
      console.error("Widget creation error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to create widget" 
      });
    }
  });

  // Get widget by token for embedding
  app.get("/api/widget/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const { refresh } = req.query; // Check for refresh parameter
      const widget = await storage.getWidgetByToken(token);
      
      if (!widget) {
        return res.status(404).json({ 
          success: false, 
          message: "Widget not found" 
        });
      }

      // Get data from Notion (bypass cache if refresh=true)
      try {
        const bypassCache = refresh === 'true';
        if (bypassCache) {
          console.log(`Cache bypass requested for widget ${token}`);
        }
        const pages = await getDatabasePages(widget.notionToken, widget.databaseUrl, bypassCache);
        
        // Minimal caching for Notion embedding - forces refresh more frequently
        const now = new Date().toUTCString();
        res.set({
          'Cache-Control': 'public, max-age=60, must-revalidate',
          'ETag': `"${widget.token}-${Date.now()}"`,
          'Last-Modified': now,
          'Vary': 'Accept-Encoding',
          'X-Widget-Updated': now
        });
        
        res.json({ 
          success: true, 
          widget: {
            id: widget.id,
            title: widget.title,
            instagramHandle: widget.instagramHandle,
            isActive: widget.isActive
          },
          posts: pages
        });
      } catch (notionError) {
        console.error("Failed to fetch Notion data:", notionError);
        res.json({ 
          success: true, 
          widget: {
            id: widget.id,
            title: widget.title,
            instagramHandle: widget.instagramHandle,
            isActive: widget.isActive
          },
          posts: [],
          error: "Failed to fetch content from Notion: " + (notionError as Error).message
        });
      }
    } catch (error) {
      console.error("Widget fetch error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch widget" 
      });
    }
  });

  // Get widget by token with content
  app.get("/api/widgets/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const widget = await storage.getWidgetByToken(token);
      
      if (!widget) {
        return res.status(404).json({ 
          success: false, 
          message: "Widget not found" 
        });
      }

      // Get fresh data from Notion
      try {
        const pages = await getDatabasePages(widget.notionToken, widget.databaseUrl);
        
        res.json({ 
          success: true, 
          widget: {
            id: widget.id,
            title: widget.title,
            gridSize: widget.gridSize,
            instagramHandle: widget.instagramHandle,
            isActive: widget.isActive
          },
          content: pages
        });
      } catch (notionError) {
        console.error("Failed to fetch Notion data:", notionError);
        res.json({ 
          success: true, 
          widget: {
            id: widget.id,
            title: widget.title,
            gridSize: widget.gridSize,
            instagramHandle: widget.instagramHandle,
            isActive: widget.isActive
          },
          content: [],
          error: "Failed to fetch content from Notion"
        });
      }
    } catch (error) {
      console.error("Widget fetch error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch widget" 
      });
    }
  });

  // List all widgets
  app.get("/api/widgets", async (req, res) => {
    try {
      const widgets = await storage.listWidgets();
      
      res.json({ 
        success: true, 
        widgets: widgets.map(widget => ({
          id: widget.id,
          token: widget.token,
          title: widget.title,
          gridSize: widget.gridSize,
          instagramHandle: widget.instagramHandle,
          isActive: widget.isActive,
          createdAt: widget.createdAt
        }))
      });
    } catch (error) {
      console.error("Widgets list error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch widgets" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
