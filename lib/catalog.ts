export const products = [
  {
    id: "coffee-cup",
    name: "Ceramic Coffee Cup",
    color: "White",
    price: 1500,
    image: "/products/cup-white.jpg",
    description: "A simple ceramic cup for your everyday coffee.",
  },
  {
    id: "candy-bowl",
    name: "Ceramic Candy Bowl",
    color: "Yellow",
    price: 2200,
    image: "/products/bowl-yellow.jpg",
    description: "A bright little home for your favorite treats.",
  },
  {
    id: "thermos",
    name: "Stainless Steel Thermos",
    color: "Black",
    price: 3500,
    image: "/products/thermos-black.jpg",
    description: "Take your favorite hot or cold drink along.",
  },
] as const;
export const formatMoney = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100
  );
export const shippingCost = 500;
export const freeShippingFrom = 5000;
export const shippingFor = (subtotal: number) =>
  subtotal > freeShippingFrom ? 0 : shippingCost;
export type CartLine = { productId: string; quantity: number };
