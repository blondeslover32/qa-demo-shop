"use client";

import { useSyncExternalStore } from "react";
import { products, type CartLine } from "./catalog";
const key = "qa-fallback-cart-v1";
const empty: CartLine[] = [];
const listeners = new Set<() => void>();
let lastRaw: string | null | undefined;
let snapshot = empty;

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== lastRaw) {
      lastRaw = raw;
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      snapshot = Array.isArray(parsed)
        ? parsed.filter(
            (item): item is CartLine =>
              item &&
              products.some((product) => product.id === item.productId) &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0 &&
              item.quantity <= 99
          )
        : empty;
    }
  } catch {
    snapshot = empty;
  }
  return snapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function write(items: CartLine[]) {
  localStorage.setItem(key, JSON.stringify(items));
  for (const listener of listeners) listener();
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, read, () => empty);
  return {
    items,
    add(productId: string, quantity: number) {
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99)
        throw new Error("Choose a quantity from 1 to 99.");
      const current = read();
      const existing = current.find((item) => item.productId === productId);
      if ((existing?.quantity || 0) + quantity > 99)
        throw new Error("The maximum is 99 units per product.");
      write(
        existing
          ? current.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          : [...current, { productId, quantity }]
      );
    },
    setQuantity(productId: string, quantity: number) {
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99)
        throw new Error("Choose a quantity from 1 to 99.");
      write(
        read().map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    },
    remove(productId: string) {
      write(read().filter((item) => item.productId !== productId));
    },
    clear() {
      write([]);
    },
  };
}
