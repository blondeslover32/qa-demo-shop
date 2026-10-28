"use client";

import Link from "next/link";
import { useCart } from "../lib/cart";
import { cartQuantity } from "../lib/cart-count";

export function Header() {
  const { items } = useCart();
  const count = cartQuantity(items);
  return (
    <header className="site-header">
      <p className="promo">Free shipping on orders of $50 or more</p>
      <Link className="wordmark" href="/" aria-label="EverShop demo home">
        EverShop<span>demo</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/">Products</Link>
        <Link
          className="cart-link"
          href="/cart"
          aria-label={`Shopping cart with ${count} items`}
        >
          <svg
            aria-hidden="true"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M5 7h14l1 14H4L5 7Z" />
            <path d="M8 8V6a4 4 0 0 1 8 0v2" />
          </svg>
          Cart{" "}
          <span className="cart-badge" key={count}>
            {count}
          </span>
        </Link>
      </nav>
    </header>
  );
}
