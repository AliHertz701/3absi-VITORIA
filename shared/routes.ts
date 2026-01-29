// shared/routes.ts
import { z } from "zod";

// --- Schemas ---
export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  isFeatured: z.boolean().optional(),
  year: z.number(),
  origin: z.string(),
  fabric: z.string(),
  image: z.string(),
  description: z.string(),
});

export const insertOrderSchema = z.object({
  customerName: z.string(),
  customerEmail: z.string(),
  address: z.string(),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
    })
  ),
  total: z.number(),
});

export const orderSchema = z.object({
  id: z.number(),
  customerName: z.string(),
  customerEmail: z.string(),
  address: z.string(),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
    })
  ),
  total: z.number(),
  createdAt: z.string(),
});

// --- Routes object ---
export const api = {
  products: {
    list: {
      method: "GET" as const,
      path: "http://127.0.0.1:8000/api/products/", // Django endpoint
      responses: {
        200: z.array(productSchema),
      },
    },
    get: {
      method: "GET" as const,
      path: "http://127.0.0.1:8000/api/products/:id/",
      responses: {
        200: productSchema,
        404: z.object({ message: z.string() }),
      },
    },
  },
  orders: {
    create: {
      method: "POST" as const,
      path: "http://127.0.0.1:8000/api/orders/",
      input: insertOrderSchema,
      responses: {
        201: orderSchema,
        400: z.object({ message: z.string() }),
      },
    },
  },
};

// --- URL helper ---
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}
