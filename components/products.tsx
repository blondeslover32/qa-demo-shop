"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products, formatMoney } from "../lib/catalog";
import { useCart } from "../lib/cart";

export function Products() {
  const cart = useCart();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [addedId, setAddedId] = useState("");
  return (
    <>
      <div className="page-intro">
        <h1>Everyday essentials</h1>
        <p>
          Simple things for your desk, your kitchen, and the moments in between.
        </p>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <article className="product" key={product.id}>
            <Image
              className="product-photo"
              src={product.image}
              alt={`${product.name} — ${product.color}`}
              width={600}
              height={600}
              priority={product.id === "coffee-cup"}
            />
            <div className="product-heading">
              <h2>{product.name}</h2>
              <span>{formatMoney(product.price)}</span>
            </div>
            <p className="muted">{product.color}</p>
            <p>{product.description}</p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setError("");
                const quantity = Number(
                  new FormData(event.currentTarget).get("quantity")
                );
                try {
                  cart.add(product.id, quantity);
                  setMessage(`${quantity} ${product.name} added to your cart.`);
                  setAddedId(product.id);
                } catch (cause) {
                  setError(
                    cause instanceof Error
                      ? cause.message
                      : "Your cart could not be saved. Enable browser storage and try again."
                  );
                }
              }}
            >
              <label htmlFor={`qty-${product.id}`}>
                Quantity for {product.name}
              </label>
              <div className="buy-row">
                <input
                  id={`qty-${product.id}`}
                  name="quantity"
                  type="number"
                  min="1"
                  max="99"
                  step="1"
                  defaultValue="1"
                  required
                />
                <button
                  type="submit"
                  className="add-button"
                  data-added={addedId === product.id || undefined}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {addedId === product.id ? (
                      <path d="m5 12 5 5 9-10" />
                    ) : (
                      <>
                        <path d="M5 7h14l1 14H4L5 7Z" />
                        <path d="M12 11v6M9 14h6" />
                      </>
                    )}
                  </svg>
                  Add to cart
                </button>
              </div>
            </form>
          </article>
        ))}
      </div>
      <div className="cart-feedback" role="status">
        {message && (
          <>
            {message} <Link href="/cart">View cart</Link>
          </>
        )}
      </div>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </>
  );
}
