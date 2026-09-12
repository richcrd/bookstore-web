import type { CreateOrderItems } from "../../domain/models";
import type { OrdersPort } from "../../domain/ports";
import { httpClient } from "../http/httpClient";
import { orderSchema, pageSchema } from "../schemas";

export const orderRepository: OrdersPort = {
  async getOrders(customerId: string, page = 1, pageSize = 10) {
    const { data } = await httpClient.get("/api/v1/orders", {
      params: { customerId, page, pageSize },
    });
    return pageSchema(orderSchema).parse(data);
  },

  async getOrder(id: string) {
    const { data } = await httpClient.get(`/api/v1/orders/${id}`);
    return orderSchema.parse(data);
  },

  async createOrder(input: CreateOrderItems) {
    const { data } = await httpClient.post("/api/v1/orders", input, {
      headers: { "Idempotency-Key": crypto.randomUUID() },
    });
    return orderSchema.parse(data);
  },
};
