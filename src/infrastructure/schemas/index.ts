import { z } from 'zod';

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  isbn: z.string(),
  description: z.string(),
  author: z.string(),
  price: z.number(),
  currency: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export const orderItemSchema = z.object({
  bookId: z.string().uuid(),
  title: z.string(),
  unitPrice: z.number(),
  currency: z.string(),
  quantity: z.number().int().positive(),
  lineTotal: z.number(),
});

export const orderSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  status: z.string(),
  total: z.number(),
  currency: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  items: z.array(orderItemSchema),
});

export const stockItemSchema = z.object({
  id: z.string().uuid(),
  bookId: z.string().uuid(),
  quantityOnHand: z.number().int(),
  reservedQuantity: z.number().int(),
  available: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export const pageSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    totalCount: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
  });