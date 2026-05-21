export type SalesRecord = {
  date: string;
  product: string;
  category?: string;
  quantity_sold: number;
  revenue: number;
  inventory_on_hand?: number;
};

export type ProductSummary = {
  product: string;
  category: string;
  quantitySold: number;
  revenue: number;
  avgDailySales: number;
  latestInventory: number;
  daysOfStock: number;
  trend: "up" | "down" | "stable";
};

export type Recommendation = {
  id: string;
  agent: string;
  type: "inventory" | "marketing" | "daily" | "phone";
  item: string;
  recommendation: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

export type PhoneOrder = {
  id: string;
  customerName: string;
  phone: string;
  item: string;
  quantity: number;
  pickupTime: string;
  notes: string;
  estimatedTotal: number;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

export const sampleSales: SalesRecord[] = [
  { date: "2026-05-01", product: "Chocolate Cupcakes", category: "Cupcakes", quantity_sold: 34, revenue: 136, inventory_on_hand: 80 },
  { date: "2026-05-01", product: "Croissant", category: "Pastries", quantity_sold: 18, revenue: 90, inventory_on_hand: 40 },
  { date: "2026-05-01", product: "Oat Milk Latte", category: "Drinks", quantity_sold: 22, revenue: 132, inventory_on_hand: 35 },
  { date: "2026-05-02", product: "Chocolate Cupcakes", category: "Cupcakes", quantity_sold: 45, revenue: 180, inventory_on_hand: 50 },
  { date: "2026-05-02", product: "Croissant", category: "Pastries", quantity_sold: 12, revenue: 60, inventory_on_hand: 35 },
  { date: "2026-05-02", product: "Oat Milk Latte", category: "Drinks", quantity_sold: 31, revenue: 186, inventory_on_hand: 24 },
  { date: "2026-05-03", product: "Chocolate Cupcakes", category: "Cupcakes", quantity_sold: 58, revenue: 232, inventory_on_hand: 32 },
  { date: "2026-05-03", product: "Croissant", category: "Pastries", quantity_sold: 9, revenue: 45, inventory_on_hand: 28 },
  { date: "2026-05-03", product: "Oat Milk Latte", category: "Drinks", quantity_sold: 38, revenue: 228, inventory_on_hand: 16 },
  { date: "2026-05-04", product: "Chocolate Cupcakes", category: "Cupcakes", quantity_sold: 49, revenue: 196, inventory_on_hand: 24 },
  { date: "2026-05-04", product: "Croissant", category: "Pastries", quantity_sold: 11, revenue: 55, inventory_on_hand: 25 },
  { date: "2026-05-04", product: "Oat Milk Latte", category: "Drinks", quantity_sold: 41, revenue: 246, inventory_on_hand: 12 },
  { date: "2026-05-05", product: "Chocolate Cupcakes", category: "Cupcakes", quantity_sold: 52, revenue: 208, inventory_on_hand: 20 },
  { date: "2026-05-05", product: "Croissant", category: "Pastries", quantity_sold: 8, revenue: 40, inventory_on_hand: 22 },
  { date: "2026-05-05", product: "Oat Milk Latte", category: "Drinks", quantity_sold: 44, revenue: 264, inventory_on_hand: 9 }
];

export const sampleOrders: PhoneOrder[] = [
  { id: "order-1", customerName: "Aisha", phone: "925-555-1234", item: "Chocolate Cupcakes", quantity: 24, pickupTime: "Saturday 3 PM", notes: "Half chocolate frosting, half vanilla frosting.", estimatedTotal: 96, status: "Pending", createdAt: new Date().toISOString() },
  { id: "order-2", customerName: "Daniel", phone: "925-555-0198", item: "Croissant Tray", quantity: 2, pickupTime: "Friday 9 AM", notes: "Office breakfast order.", estimatedTotal: 60, status: "Pending", createdAt: new Date().toISOString() }
];

export function parseCSV(text: string): SalesRecord[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitLine(lines[0]).map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const required = ["date", "product", "quantity_sold", "revenue"];
  const missing = required.filter((r) => !headers.includes(r));
  if (missing.length) throw new Error(`Missing required columns: ${missing.join(", ")}`);
  return lines.slice(1).map((line, index) => {
    const values = splitLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => row[h] = values[i]?.trim() || "");
    const quantity = Number(row.quantity_sold);
    const revenue = Number(row.revenue);
    if (!row.date || !row.product || Number.isNaN(quantity) || Number.isNaN(revenue)) {
      throw new Error(`Invalid row ${index + 2}. Check date, product, quantity_sold, and revenue.`);
    }
    return {
      date: row.date,
      product: row.product,
      category: row.category || "General",
      quantity_sold: quantity,
      revenue,
      inventory_on_hand: row.inventory_on_hand ? Number(row.inventory_on_hand) : undefined
    };
  });
}

function splitLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') inQuotes = !inQuotes;
    else if (char === "," && !inQuotes) { values.push(current); current = ""; }
    else current += char;
  }
  values.push(current);
  return values.map((v) => v.replace(/^"|"$/g, ""));
}

export function summarize(records: SalesRecord[]): ProductSummary[] {
  const grouped = new Map<string, SalesRecord[]>();
  for (const row of records) grouped.set(row.product, [...(grouped.get(row.product) || []), row]);
  const uniqueDays = new Set(records.map((r) => r.date)).size || 1;
  return [...grouped.entries()].map(([product, rows]) => {
    const quantitySold = rows.reduce((sum, r) => sum + r.quantity_sold, 0);
    const revenue = rows.reduce((sum, r) => sum + r.revenue, 0);
    const avgDailySales = quantitySold / uniqueDays;
    const latestInventory = [...rows].reverse().find((r) => typeof r.inventory_on_hand === "number")?.inventory_on_hand ?? Math.round(avgDailySales * 2);
    const mid = Math.ceil(rows.length / 2);
    const early = rows.slice(0, mid).reduce((sum, r) => sum + r.quantity_sold, 0) / Math.max(1, mid);
    const late = rows.slice(mid).reduce((sum, r) => sum + r.quantity_sold, 0) / Math.max(1, rows.length - mid);
    let trend: ProductSummary["trend"] = "stable";
    if (late > early * 1.15) trend = "up";
    if (late < early * 0.85) trend = "down";
    return { product, category: rows[0].category || "General", quantitySold, revenue, avgDailySales, latestInventory, daysOfStock: latestInventory / Math.max(1, avgDailySales), trend };
  }).sort((a, b) => b.revenue - a.revenue);
}

export function runInventoryAgent(records: SalesRecord[]): Recommendation[] {
  const now = new Date().toISOString();
  return summarize(records).map((s, i) => {
    if (s.daysOfStock < 1.5) {
      const qty = Math.max(5, Math.ceil(s.avgDailySales * 2 - s.latestInventory));
      return { id: `inv-${Date.now()}-${i}`, agent: "Inventory Agent", type: "inventory", item: s.product, recommendation: `Restock or prep about ${qty} more units of ${s.product}.`, reason: `${s.product} has only ${s.daysOfStock.toFixed(1)} days of stock based on recent sales.`, priority: "High", status: "Pending", createdAt: now };
    }
    if (s.trend === "up") return { id: `inv-${Date.now()}-${i}`, agent: "Inventory Agent", type: "inventory", item: s.product, recommendation: `Prepare extra ${s.product} for the next busy day.`, reason: `${s.product} is trending up compared with earlier sales.`, priority: "Medium", status: "Pending", createdAt: now };
    if (s.trend === "down") return { id: `inv-${Date.now()}-${i}`, agent: "Inventory Agent", type: "inventory", item: s.product, recommendation: `Reduce prep for ${s.product} by 10–15%.`, reason: `${s.product} is trending down, so reducing prep may lower waste.`, priority: "Low", status: "Pending", createdAt: now };
    return { id: `inv-${Date.now()}-${i}`, agent: "Inventory Agent", type: "inventory", item: s.product, recommendation: `Keep normal prep levels for ${s.product}.`, reason: `${s.product} looks stable compared with current inventory.`, priority: "Low", status: "Pending", createdAt: now };
  });
}

export function runMarketingAgent(records: SalesRecord[]): Recommendation[] {
  const products = summarize(records);
  const top = products[0];
  const slow = [...products].reverse()[0];
  const now = new Date().toISOString();
  const recs: Recommendation[] = [];
  if (top) recs.push({ id: `mkt-${Date.now()}-1`, agent: "Marketing Agent", type: "marketing", item: top.product, recommendation: `Draft a simple promo for ${top.product}: “Fresh ${top.product} available today — limited batch.”`, reason: `${top.product} is the strongest revenue driver in the uploaded data.`, priority: "Medium", status: "Pending", createdAt: now });
  if (slow && slow.product !== top?.product) recs.push({ id: `mkt-${Date.now()}-2`, agent: "Marketing Agent", type: "marketing", item: slow.product, recommendation: `Consider a small bundle or spotlight offer for ${slow.product}.`, reason: `${slow.product} is moving slower than other products.`, priority: "Low", status: "Pending", createdAt: now });
  return recs;
}

export function runDailySummaryAgent(records: SalesRecord[], recs: Recommendation[], orders: PhoneOrder[]) {
  const products = summarize(records);
  const revenue = records.reduce((sum, r) => sum + r.revenue, 0);
  const units = records.reduce((sum, r) => sum + r.quantity_sold, 0);
  const top = products[0]?.product || "No data";
  const urgent = products.filter((p) => p.daysOfStock < 1.5).map((p) => p.product);
  return {
    title: "Daily Business Summary",
    summary: `Revenue from uploaded data is $${revenue.toFixed(0)} across ${units} units sold. ${top} is the top product. ${urgent.length ? `${urgent.join(", ")} should be reviewed for restocking.` : "No urgent low-stock items were detected."} You have ${recs.filter(r => r.status === "Pending").length} pending recommendations and ${orders.filter(o => o.status === "Pending").length} phone order drafts waiting for review.`,
    revenue,
    units,
    topProduct: top,
    urgentItems: urgent,
    generatedAt: new Date().toISOString()
  };
}

export function createPhoneOrderDraft(input: Partial<PhoneOrder> & { rawText?: string }): PhoneOrder {
  const raw = input.rawText || "";
  const quantityMatch = raw.match(/\b(\d+)\b/);
  const quantity = input.quantity || (quantityMatch ? Number(quantityMatch[1]) : 1);
  const item = input.item || (raw.toLowerCase().includes("cupcake") ? "Cupcakes" : raw.toLowerCase().includes("croissant") ? "Croissant Tray" : "Custom order");
  return {
    id: `order-${Date.now()}`,
    customerName: input.customerName || "New Customer",
    phone: input.phone || "Not provided",
    item,
    quantity,
    pickupTime: input.pickupTime || "Needs follow-up",
    notes: input.notes || raw || "Order details need owner review.",
    estimatedTotal: input.estimatedTotal || quantity * 4,
    status: "Pending",
    createdAt: new Date().toISOString()
  };
}

export function csvTemplate() {
  return `date,product,category,quantity_sold,revenue,inventory_on_hand\n2026-05-01,Chocolate Cupcakes,Cupcakes,34,136,80\n2026-05-01,Croissant,Pastries,18,90,40\n2026-05-02,Chocolate Cupcakes,Cupcakes,45,180,50\n2026-05-02,Croissant,Pastries,12,60,35`;
}
