import { users, widgets, type User, type InsertUser, type Widget, type InsertWidget } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWidget(id: string): Promise<Widget | undefined>;
  getWidgetByToken(token: string): Promise<Widget | undefined>;
  createWidget(widget: InsertWidget): Promise<Widget>;
  updateWidget(id: string, updates: Partial<InsertWidget>): Promise<Widget | undefined>;
  deleteWidget(id: string): Promise<boolean>;
  listWidgets(): Promise<Widget[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, id: randomUUID() })
      .returning();
    return user;
  }

  async getWidget(id: string): Promise<Widget | undefined> {
    const [widget] = await db.select().from(widgets).where(eq(widgets.id, id));
    return widget || undefined;
  }

  async getWidgetByToken(token: string): Promise<Widget | undefined> {
    const [widget] = await db.select().from(widgets).where(eq(widgets.token, token));
    return widget || undefined;
  }

  async createWidget(insertWidget: InsertWidget): Promise<Widget> {
    const id = randomUUID();
    const token = randomUUID().replace(/-/g, '').substring(0, 12);
    const newWidget = { 
      ...insertWidget, 
      id, 
      token,
      gridSize: insertWidget.gridSize || "3x3",
      instagramHandle: insertWidget.instagramHandle || null,
      isActive: true,
      createdAt: new Date()
    };
    
    const [widget] = await db
      .insert(widgets)
      .values(newWidget)
      .returning();
    return widget;
  }

  async updateWidget(id: string, updates: Partial<InsertWidget>): Promise<Widget | undefined> {
    const [widget] = await db
      .update(widgets)
      .set(updates)
      .where(eq(widgets.id, id))
      .returning();
    return widget || undefined;
  }

  async deleteWidget(id: string): Promise<boolean> {
    const result = await db
      .delete(widgets)
      .where(eq(widgets.id, id))
      .returning();
    return result.length > 0;
  }

  async listWidgets(): Promise<Widget[]> {
    return await db.select().from(widgets);
  }
}

export const storage = new DatabaseStorage();
