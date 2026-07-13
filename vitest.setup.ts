import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

/**
 * Cada teste começa com o armazenamento limpo: as stores usam persist, e um
 * teste não pode herdar o estado do anterior.
 */
beforeEach(() => {
  window.localStorage.clear();
});
