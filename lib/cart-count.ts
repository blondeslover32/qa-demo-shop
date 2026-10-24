import type { CartLine } from "./catalog";

export function cartQuantity(items: CartLine[]) {
  return items.length;
}
