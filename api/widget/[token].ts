import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { getDatabasePages } from '../../server/notion';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: "Token is required" 
      });
    }

    const widget = await storage.getWidgetByToken(token);
    
    if (!widget) {
      return res.status(404).json({ 
        success: false, 
        message: "Widget not found" 
      });
    }

    // Get data from Notion (with caching)
    try {
      const pages = await getDatabasePages(widget.notionToken, widget.databaseUrl);
      
      // Set cache headers for browser caching (2 minutes)
      res.setHeader('Cache-Control', 'public, max-age=120');
      res.setHeader('ETag', `"${widget.token}-${Date.now()}"`);
      res.setHeader('Access-Control-Allow-Origin', '*');
      
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
}