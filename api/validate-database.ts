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
    const { token, databaseUrl } = req.body;
    
    if (!token || !databaseUrl) {
      return res.status(400).json({ 
        success: false, 
        message: "Token and database URL are required" 
      });
    }

    // Extract database ID from URL
    const databaseId = databaseUrl.includes('?v=') 
      ? databaseUrl.split('?v=')[0].split('/').pop()?.replace(/-/g, '') 
      : databaseUrl.split('/').pop()?.replace(/-/g, '');

    if (!databaseId) {
      return res.json({ 
        success: false, 
        message: "Invalid database URL format" 
      });
    }

    try {
      const notion = new Client({ auth: token });
      
      // Try to query the database to verify access
      const response = await notion.databases.retrieve({ 
        database_id: databaseId 
      });

      // Check if database has required properties for Instagram content
      const properties = response.properties;
      const hasRequiredProps = 'Name' in properties && 'Cover Photo' in properties;
      
      res.json({ 
        success: true,
        message: hasRequiredProps 
          ? "Database is accessible and properly configured" 
          : "Database is accessible but may need 'Name' and 'Cover Photo' properties",
        properties: Object.keys(properties)
      });
    } catch (notionError: any) {
      res.json({ 
        success: false,
        message: notionError?.message || "Cannot access database. Check permissions."
      });
    }
  } catch (error) {
    console.error("Database validation error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to validate database" 
    });
  }
}