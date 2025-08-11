import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@notionhq/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.body;
    
    if (!token || typeof token !== "string") {
      return res.status(400).json({ 
        success: false, 
        message: "Token is required" 
      });
    }

    // Validate token by attempting to connect to Notion API
    try {
      const notion = new Client({ auth: token });
      await notion.users.me({}); // This will throw if token is invalid
      
      return res.json({ 
        success: true,
        message: "Token is valid"
      });
    } catch (notionError) {
      return res.json({ 
        success: false,
        message: "Invalid Notion token"
      });
    }
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to validate token" 
    });
  }
}