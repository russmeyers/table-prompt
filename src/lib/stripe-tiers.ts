export const STRIPE_TIERS = {
  starter: {
    name: "Starter",
    price_id: "price_1TDHK4CZfjfCwUa6SmurJ5Dy",
    product_id: "prod_UBedk8GHEGgxg6",
    price: 29,
    texts: 500,
  },
  launch: {
    name: "Launch",
    price_id: "price_1TDHKWCZfjfCwUa6flBt0oqS",
    product_id: "prod_UBedcZVy1C7B32",
    price: 79,
    texts: 2500,
    popular: true,
  },
  growth: {
    name: "Growth",
    price_id: "price_1TDHKqCZfjfCwUa6dg9X425y",
    product_id: "prod_UBee8CSSu9L8CK",
    price: 149,
    texts: 6000,
  },
  pro: {
    name: "Pro",
    price_id: "price_1TDHLGCZfjfCwUa6UUSYMVP5",
    product_id: "prod_UBeefNl2mpTBzG",
    price: 249,
    texts: 12000,
  },
} as const;

export type TierKey = keyof typeof STRIPE_TIERS;

export function getTierByProductId(productId: string): TierKey | null {
  for (const [key, tier] of Object.entries(STRIPE_TIERS)) {
    if (tier.product_id === productId) return key as TierKey;
  }
  return null;
}
