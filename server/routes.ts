import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data
  const seedData = [
    {
      name: "1890s Victorian Silk Bodice",
      description: "An exquisite example of late Victorian craftsmanship. This silk bodice features intricate lace overlay, boned construction, and original glass buttons. A true collector's piece.",
      price: 45000,
      category: "Tops",
      era: "Victorian",
      condition: "Excellent",
      material: "Silk, Lace",
      images: [
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=1000"
      ],
      isFeatured: true
    },
    {
      name: "1920s Beaded Flapper Dress",
      description: "Authentic Roaring Twenties jazz age dress. Heavy beading on silk chiffon. The geometric art deco pattern is stunning and intact. Some minor bead loss consistent with age.",
      price: 120000,
      category: "Dresses",
      era: "1920s",
      condition: "Very Good",
      material: "Silk Chiffon, Glass Beads",
      images: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000"
      ],
      isFeatured: true
    },
    {
      name: "Edwardian Tea Gown",
      description: "Light and airy white cotton tea gown with pintucks and Valenciennes lace. Perfect for a summer afternoon. Features a high collar and bishop sleeves.",
      price: 38000,
      category: "Dresses",
      era: "Edwardian",
      condition: "Excellent",
      material: "Cotton, Lace",
      images: [
        "https://images.unsplash.com/photo-1549416867-b8a36371cb52?auto=format&fit=crop&q=80&w=1000"
      ],
      isFeatured: false
    },
    {
      name: "1950s New Look Wool Jacket",
      description: "Structured wool jacket with a nipped waist and peplum, characteristic of the 1950s New Look silhouette. Fully lined in silk.",
      price: 28000,
      category: "Outerwear",
      era: "1950s",
      condition: "Mint",
      material: "Wool",
      images: [
        "https://images.unsplash.com/photo-1550614000-4b9519e09d94?auto=format&fit=crop&q=80&w=1000"
      ],
      isFeatured: false
    }
  ];

  await storage.seedProducts(seedData);

  return httpServer;
}
