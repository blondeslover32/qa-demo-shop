import type { CartLine } from "./catalog";

export function cartQuantity(items: CartLine[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}
