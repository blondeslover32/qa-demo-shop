"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../lib/cart";
import { products, formatMoney, shippingCost } from "../lib/catalog";
import { OrderNote } from "./order-note";

type Confirmation = { reference: string; note: string; total: number };

export function Checkout() {
  const cart = useCart();
  const [order, setOrder] = useState<Confirmation | null>(null);
  const [error, setError] = useState("");
  const subtotal = cart.items.reduce(
    (sum, item) =>
      sum +
      products.find((product) => product.id === item.productId)!.price *
        item.quantity,
    0
  );
  if (order)
    return (
      <section className="confirmation">
        <h1>Thank you for your demo order</h1>
        <p>
          Reference <strong>{order.reference}</strong>
        </p>
        <p>Cash on Delivery · {formatMoney(order.total)}</p>
        {order.note && (
          <>
            <h2>Order Note</h2>
            <p>{order.note}</p>
          </>
        )}
        <p className="muted">
          This demo order stays in this browser. No payment was collected.
        </p>
        <Link className="button" href="/">
          Continue shopping
        </Link>
      </section>
    );
  if (!cart.items.length)
    return (
      <section className="empty">
        <h1>Your cart is empty</h1>
        <p>Add a product before checking out.</p>
        <Link className="button" href="/">
          Browse products
        </Link>
      </section>
    );
  return (
    <>
      <h1>Checkout</h1>
      <form
        className="checkout-grid"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const confirmation = {
            reference: `DEMO-${Date.now().toString(36).toUpperCase()}`,
            note: String(form.get("note") || "").trim(),
            total: subtotal + shippingCost,
          };
          try {
            localStorage.setItem(
              "qa-fallback-last-order",
              JSON.stringify({
                ...confirmation,
                items: cart.items,
                email: form.get("email"),
                name: form.get("name"),
                address: form.get("address"),
                city: form.get("city"),
                state: form.get("state"),
                postalCode: form.get("postalCode"),
                country: "US",
                shippingMethod: "standard",
                paymentMethod: "cod",
              })
            );
            cart.clear();
            setOrder(confirmation);
          } catch {
            setError(
              "The demo order could not be saved. Enable browser storage and try again."
            );
          }
        }}
      >
        <section className="form-column" aria-label="Checkout details">
          <fieldset>
            <legend>Contact Information</legend>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </fieldset>
          <fieldset>
            <legend>Shipping Address</legend>
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" autoComplete="name" required />
            <label htmlFor="address">Street address</label>
            <input
              id="address"
              name="address"
              autoComplete="street-address"
              required
            />
            <div className="form-pair">
              <div>
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  required
                />
              </div>
              <div>
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  autoComplete="address-level1"
                  required
                />
              </div>
            </div>
            <div className="form-pair">
              <div>
                <label htmlFor="postal">ZIP code</label>
                <input
                  id="postal"
                  name="postalCode"
                  autoComplete="postal-code"
                  pattern="[0-9]{5}(-[0-9]{4})?"
                  title="Enter a five-digit US ZIP code"
                  required
                />
              </div>
              <div>
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  autoComplete="country"
                  defaultValue="US"
                >
                  <option value="US">United States</option>
                </select>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Shipping Method</legend>
            <label className="radio-option">
              <input
                type="radio"
                name="shipping"
                value="standard"
                defaultChecked
                required
              />
              <span>Standard shipping</span>
              <strong>{formatMoney(shippingCost)}</strong>
            </label>
          </fieldset>
          <fieldset>
            <legend>Payment Information</legend>
            <label className="radio-option">
              <input
                type="radio"
                name="payment"
                value="cod"
                defaultChecked
                required
              />
              <span>Cash on Delivery</span>
            </label>
          </fieldset>
          <OrderNote />
        </section>
        <aside className="summary">
          <h2>Order summary</h2>
          <ul className="order-items">
            {cart.items.map((item) => {
              const product = products.find(
                (product) => product.id === item.productId
              )!;
              return (
                <li key={item.productId}>
                  <span>
                    {item.quantity} × {product.name}
                  </span>
                  <strong>{formatMoney(product.price * item.quantity)}</strong>
                </li>
              );
            })}
          </ul>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatMoney(subtotal)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>{formatMoney(shippingCost)}</dd>
            </div>
            <div className="total">
              <dt>Total</dt>
              <dd>{formatMoney(subtotal + shippingCost)}</dd>
            </div>
          </dl>
          <button type="submit">Place demo order</button>
          <p className="muted">Sample checkout. No payment is collected.</p>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </aside>
      </form>
    </>
  );
}
