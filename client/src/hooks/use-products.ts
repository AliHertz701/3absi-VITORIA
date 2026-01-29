import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// --- Define schemas matching Django API responses ---
const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  isFeatured: z.boolean().optional(),
  year: z.number(),
  origin: z.string(),
  fabric: z.string(),
  image: z.string(),
  description: z.string(),
});

// --- Base URL for Django API ---
const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

// --- Dummy data ---
const dummyProducts = [
  {
    id: 1,
    name: "Dummy Product 1",
    isFeatured: true,
    year: 2023,
    origin: "Libya",
    fabric: "Cotton",
    image: "https://via.placeholder.com/150",
    description: "This is a dummy product",
  },
  {
    id: 2,
    name: "Dummy Product 2",
    isFeatured: false,
    year: 2022,
    origin: "Libya",
    fabric: "Silk",
    image: "https://via.placeholder.com/150",
    description: "This is another dummy product",
  },
];

// --- Hooks ---
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        const parsed = z.array(productSchema).parse(data);
        return parsed.length ? parsed : dummyProducts; // fallback if empty
      } catch (err) {
        console.warn("Fetching products failed, using dummy data:", err);
        return dummyProducts;
      }
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}/`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        return productSchema.parse(data);
      } catch (err) {
        console.warn(`Fetching product ${id} failed, using dummy product:`, err);
        return dummyProducts.find((p) => p.id === id) || dummyProducts[0];
      }
    },
  });
}
