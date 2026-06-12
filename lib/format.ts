const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatUSD(amount: number): string {
  return usd.format(amount);
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}
