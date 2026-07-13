import { MOCK_SUPPLEMENTS } from "@/mocks/supplements";
import type { Supplement } from "@/types";
import { fetchMock } from "./mock-api";

export const supplementsService = {
  async getSupplements(): Promise<Supplement[]> {
    return fetchMock(MOCK_SUPPLEMENTS);
  },
};
