import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method === 'GET') {
    try {
      // Return existing widget for demonstration
      const widgets = [{
        id: "ca1a183a-0a6c-4f4a-8b3a-123456789abc",
        title: "Instagram Grid Widget",
        token: "c9a60321a9f7",
        isActive: true,
        instagramHandle: null,
        createdAt: new Date().toISOString()
      }];
      res.json({ success: true, widgets });
    } catch (error) {
      console.error("Error fetching widgets:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch widgets" 
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, notionToken, databaseUrl, gridSize, instagramHandle } = req.body;
      
      if (!title || !notionToken || !databaseUrl) {
        return res.status(400).json({ 
          success: false, 
          message: "Required fields missing" 
        });
      }

      // Simple validation
      const tokenValid = notionToken.startsWith('ntn_') || notionToken.startsWith('secret_');
      const dbValid = databaseUrl.includes('notion.so');

      if (!tokenValid || !dbValid) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid token or database URL" 
        });
      }

      // Create a new widget token
      const token = Math.random().toString(36).substring(2, 14);
      
      const widget = {
        id: `widget-${Date.now()}`,
        title,
        token,
        notionToken,
        databaseUrl,
        gridSize: gridSize || "3x3",
        instagramHandle: instagramHandle || null,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      res.json({ 
        success: true, 
        widget,
        message: "Widget created successfully" 
      });
    } catch (error) {
      console.error("Error creating widget:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to create widget" 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}