import { Ports } from "../domain/ports";
import { cartStorage } from "./repositories/CartStorageImpl";
import { catalogRepository } from "./repositories/CatalogRepositoryImpl";
import { inventoryRepository } from "./repositories/InventoryRepositoryImpl";
import { orderRepository } from "./repositories/OrderRepositoryImpl";

export const ports: Ports = {
  catalog: catalogRepository,
  orders: orderRepository,
  inventory: inventoryRepository,
  cart: cartStorage,
};
