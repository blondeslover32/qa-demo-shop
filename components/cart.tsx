"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../lib/cart";
import { products, formatMoney, shippingCost } from "../lib/catalog";

export function Cart() {
  const cart = useCart();
  const [error, setError] = useState("");
  const subtotal = cart.items.reduce(
    (sum, item) =>
      sum +
      products.find((product) => product.id === item.productId)!.price *
        item.quantity,
    0
  );
  if (!cart.items.length)
    return (
      <section className="empty">
        <h1>Your cart is empty</h1>
        <p>Find something for your everyday routine.</p>
        <Link className="button" href="/">
          Browse products
        </Link>
      </section>
    );
  return (
    <>
      <h1>Your cart</h1>
      <div className="checkout-grid">
        <section aria-label="Cart items">
          {cart.items.map((item) => {
            const product = products.find(
              (product) => product.id === item.productId
            )!;
            return (
              <article className="cart-row" key={item.productId}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={100}
                  height={100}
                />
                <div>
                  <h2>{product.name}</h2>
                  <p className="muted">
                    {product.color} · {formatMoney(product.price)} each
                  </p>
                  <label htmlFor={`cart-qty-${item.productId}`}>
                    Quantity for {product.name}
                  </label>
                  <input
                    id={`cart-qty-${item.productId}`}
                    type="number"
                    min="1"
                    max="99"
                    step="1"
                    value={item.quantity}
                    onChange={(event) => {
                      try {
                        cart.setQuantity(
                          item.productId,
                          Number(event.target.value)
                        );
                        setError("");
                      } catch (cause) {
                        setError(
                          cause instanceof Error
                            ? cause.message
                            : "Your cart could not be saved."
                        );
                      }
                    }}
                  />
                  <button
                    className="text-button"
                    onClick={() => {
                      try {
                        cart.remove(item.productId);
                      } catch {
                        setError(
                          "Your cart could not be saved. Enable browser storage and try again."
                        );
                      }
                    }}
                    aria-label={`Remove ${product.name}`}
                  >
                    Remove
                  </button>
                </div>
                <strong>{formatMoney(product.price * item.quantity)}</strong>
              </article>
            );
          })}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <Link href="/">Continue shopping</Link>
        </section>
        <aside className="summary">
          <h2>Order summary</h2>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatMoney(subtotal)}</dd>
            </div>
            <div>
              <dt>Standard shipping</dt>
              <dd>{formatMoney(shippingCost)}</dd>
            </div>
            <div className="total">
              <dt>Total</dt>
              <dd>{formatMoney(subtotal + shippingCost)}</dd>
            </div>
          </dl>
          <Link className="button" href="/checkout">
            Checkout
          </Link>
          <p className="muted">Cash on Delivery · US addresses</p>
        </aside>
      </div>
    </>
  );
}
