import type { InventoryPort } from "../../domain/ports";
import { httpClient } from "../http/httpClient";
import { pageSchema, stockItemSchema } from "../schemas";

export const inventoryRepository: InventoryPort = {
  async getStockItems() {
    const { data } = await httpClient.get("/api/v1/stock-items", {
      params: { page: 1, pageSize: 50 },
    });
    return pageSchema(stockItemSchema).parse(data);
  },

  async addStock(bookId: string, quantity: number) {
    const { data } = await httpClient.post(
      `/api/v1/stock-items/${bookId}/add`,
      { quantity },
    );
    return stockItemSchema.parse(data);
  },
};
