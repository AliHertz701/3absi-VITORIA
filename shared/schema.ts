import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  category: text("category").notNull(),
  era: text("era").notNull(), // e.g., "1920s", "Victorian"
  condition: text("condition").notNull(),
  material: text("material").notNull(),
  images: text("images").array().notNull(),
  isFeatured: boolean("is_featured").default(false),
});


export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  address: text("address").notNull(),
  items: jsonb("items").notNull(), // Array of { productId, quantity, price }
  total: integer("total").notNull(),
  status: text("status").notNull().default("pending"),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, status: true });

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
