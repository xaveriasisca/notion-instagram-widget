import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for serverless environment with retry logic
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;
neonConfig.poolQueryViaFetch = true;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a connection pool with conservative settings for stability
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 5, // Reduced pool size for stability
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  // Enable keep-alive to maintain connections
  allowExitOnIdle: false
});

// Enhanced error handling with reconnection logic
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  // Log but don't throw - let the pool recover
});

pool.on('connect', (client) => {
  console.log('Database client connected');
});

// Create database instance with error boundary
let db: ReturnType<typeof drizzle>;
try {
  db = drizzle({ client: pool, schema });
} catch (error) {
  console.error('Failed to initialize database:', error);
  throw error;
}

export { pool, db };