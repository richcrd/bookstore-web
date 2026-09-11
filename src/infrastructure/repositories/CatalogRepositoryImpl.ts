import type { CatalogPort } from "../../domain/ports";
import { httpClient } from "../http/httpClient";
import { bookSchema, pageSchema } from "../schemas";

export const catalogRepository: CatalogPort = {
  async getBooks(search = "", page = 1, pageSize = 20) {
    const { data } = await httpClient.get("/api/v1/books", {
      params: {
        search,
        page,
        pageSize,
      },
    });
    return pageSchema(bookSchema).parse(data);
  },
};
