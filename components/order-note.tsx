"use client";

import { storeSettings } from "../lib/store-settings";

export function OrderNote() {
  if (!storeSettings.showShippingNote) return null;
  return (
    <div className="form-field">
      <label htmlFor="order-note">
        Order Note <span className="muted">(optional)</span>
      </label>
      <textarea
        id="order-note"
        name="note"
        rows={3}
        maxLength={500}
        placeholder="Add a note to your order"
      />
    </div>
  );
}
