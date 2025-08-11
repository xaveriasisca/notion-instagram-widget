import { Client } from "@notionhq/client";

// In-memory cache for Notion data (5 minute TTL)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(token: string, databaseUrl: string): string {
  return `${token}-${databaseUrl}`;
}

function getFromCache(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key); // Clean up expired cache
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Extract the page ID from the Notion page URL
function extractPageIdFromUrl(pageUrl: string): string {
  const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
  if (match && match[1]) {
    return match[1];
  }

  throw Error("Failed to extract page ID from URL");
}

// Validate Notion integration token by making a test API call
export async function validateNotionToken(token: string): Promise<boolean> {
  try {
    const notion = new Client({ auth: token });
    await notion.users.me({});
    return true;
  } catch (error) {
    console.error("Notion token validation failed:", error);
    return false;
  }
}

// Validate that the database URL is accessible with the given token
export async function validateNotionDatabase(token: string, databaseUrl: string): Promise<boolean> {
  try {
    const notion = new Client({ auth: token });
    const databaseId = extractPageIdFromUrl(databaseUrl);
    
    await notion.databases.retrieve({ database_id: databaseId });
    return true;
  } catch (error) {
    console.error("Notion database validation failed:", error);
    return false;
  }
}

// Get database schema for content calendar validation
export async function getDatabaseSchema(token: string, databaseUrl: string) {
  try {
    const notion = new Client({ auth: token });
    const databaseId = extractPageIdFromUrl(databaseUrl);
    
    const database = await notion.databases.retrieve({ database_id: databaseId });
    return database;
  } catch (error) {
    console.error("Failed to get database schema:", error);
    throw error;
  }
}

// Get pages from the database for content calendar integration
export async function getDatabasePages(token: string, databaseUrl: string, bypassCache = false) {
  try {
    const cacheKey = getCacheKey(token, databaseUrl);
    
    // Check cache first (unless bypassing)
    if (!bypassCache) {
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }
    
    const notion = new Client({ auth: token });
    const databaseId = extractPageIdFromUrl(databaseUrl);
    
    // Get database schema and pages in parallel for better performance
    const [database, response] = await Promise.all([
      notion.databases.retrieve({ database_id: databaseId }),
      notion.databases.query({
        database_id: databaseId,
        page_size: 20, // Reduce initial page size for faster response
        filter: {
          property: "Cover Photo",
          files: {
            is_not_empty: true
          }
        }
      })
    ]);
    
    console.log("Database properties:", Object.keys(database.properties));
    console.log(`Found ${response.results.length} pages in database`);
    
    // Transform the raw Notion data into a clean format for the widget
    const posts = response.results.map((page: any) => {
      const properties = page.properties;
      // Extract cover photo URL - try multiple possible property names
      let coverPhoto = null;
      const photoProperty = properties["Cover Photo"] || properties["cover photo"] || 
                           properties["Cover"] || properties["Photo"] || properties["Image"];
      
      if (photoProperty?.files && photoProperty.files.length > 0) {
        coverPhoto = photoProperty.files[0].file?.url || photoProperty.files[0].external?.url;
      }
      
      // Extract date - try multiple possible property names
      let date = null;
      const dateProperty = properties["Date"] || properties["date"] || 
                          properties["Created"] || properties["Published"];
      
      if (dateProperty?.date?.start) {
        date = dateProperty.date.start;
      } else if (dateProperty?.created_time) {
        date = dateProperty.created_time;
      }
      
      // Extract title/name - try multiple approaches
      let title = "Untitled Post";
      const titleProperty = properties["Name"] || properties["Title"] || properties["name"] || properties["title"];
      
      if (titleProperty?.title && titleProperty.title.length > 0) {
        title = titleProperty.title[0].plain_text;
      } else if (titleProperty?.rich_text && titleProperty.rich_text.length > 0) {
        title = titleProperty.rich_text[0].plain_text;
      }
      

      
      return {
        id: page.id,
        title,
        coverPhoto,
        date,
        url: page.url
      };
    });
    
    // Sort by date (newest first) and limit to 9
    const sortedPosts = posts
      .filter(post => post.coverPhoto) // Only posts with cover photos
      .sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 9);
    
    console.log(`Returning ${sortedPosts.length} posts with cover photos`);
    
    // Cache the result for 5 minutes
    setCache(cacheKey, sortedPosts);
    
    return sortedPosts;
    
  } catch (error) {
    console.error("Failed to get database pages:", error);
    console.error("Error details:", error);
    throw error;
  }
}
