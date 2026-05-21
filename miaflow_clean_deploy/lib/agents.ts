export type SalesRecord = {
  date: string;
  product: string;
  category?: string;
  quantity_sold: number;
  revenue: number;
  inventory_on_hand?: number;
};

export type Recommendation = {
  id: string;
  item: string;
  recommendation: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Approved" | "Rejected";
};

export type PhoneOrder = {
  id: string;
  customerName: string;
  phone: string;
  item: string;
  quantity: number;
  pickupTime: string;
  estimatedTotal: number;
  notes: string;
  status: "Pending" | "Approved" | "Rejected";
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
  { date: "2026-05-04", product: "Oat Milk Latte", category: "Drinks", quantity_sold: 41, revenue: 246, inventory_on_hand: 12 }
];

export const sampleOrders: PhoneOrder[] = [
  {
    id: "order-1",
    customerName: "Aisha",
    phone: "(925) 555-0142",
    item: "Chocolate Cupcakes",
    quantity: 24,
    pickupTime: "Saturday at 3:00 PM",
    estimatedTotal: 96,
    notes: "Half chocolate frosting and half vanilla frosting.",
    status: "Pending"
  },
  {
    id: "order-2",
    customerName: "Daniel",
    phone: "(925) 555-0198",
    item: "Croissant Tray",
    quantity: 2,
    pickupTime: "Friday at 9:00 AM",
    estimatedTotal: 60,
    notes: "Office breakfast order.",
    status: "Pending"
  }
];

export function csvTemplate() {
  return `date,product,category,quantity_sold,revenue,inventory_on_hand
2026-05-01,Chocolate Cupcakes,Cupcakes,34,136,80
2026-05-01,Croissant,Pastries,18,90,40
2026-05-02,Chocolate Cupcakes,Cupcakes,45,180,50`;
}

export function parseCSV(text: string): SalesRecord[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_"));

  const required = ["date", "product", "quantity_sold", "revenue"];
  const missing = required.filter(field => !headers.includes(field));
  if (missing.length) throw new Error(`Missing required columns: ${missing.join(", ")}`);

  return lines.slice(1).map((line, index) => {
    const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((header, i) => row[header] = values[i] ?? "");

    const quantity = Number(row.quantity_sold);
    const revenue = Number(row.revenue);
    const inventory = row.inventory_on_hand ? Number(row.inventory_on_hand) : undefined;

    if (!row.date || !row.product || Number.isNaN(quantity) || Number.isNaN(revenue)) {
      throw new Error(`Invalid data on row ${index + 2}`);
    }

    return {
      date: row.date,
      product: row.product,
      category: row.category || "General",
      quantity_sold: quantity,
      revenue,
      inventory_on_hand: inventory
    };
  });
}

export function summarize(records: SalesRecord[]) {
  const grouped = new Map<string, SalesRecord[]>();

  for (const record of records) {
    const rows = grouped.get(record.product) ?? [];
    rows.push(record);
    grouped.set(record.product, rows);
  }

  const uniqueDays = new Set(records.map(r => r.date)).size || 1;

  return Array.from(grouped.entries()).map(([product, rows]) => {
    const quantitySold = rows.reduce((sum, row) => sum + row.quantity_sold, 0);
    const revenue = rows.reduce((sum, row) => sum + row.revenue, 0);
    const latestInventory = [...rows].reverse().find(row => typeof row.inventory_on_hand === "number")?.inventory_on_hand ?? 0;
    const avgDaily = quantitySold / uniqueDays;
    const daysOfStock = latestInventory / Math.max(1, avgDaily);

    const first = rows[0]?.quantity_sold ?? 0;
    const last = rows[rows.length - 1]?.quantity_sold ?? 0;

    let trend: "up" | "down" | "stable" = "stable";
    if (last > first * 1.15) trend = "up";
    if (last < first * 0.85) trend = "down";

    return {
      product,
      category: rows[0]?.category || "General",
      quantitySold,
      revenue,
      latestInventory,
      daysOfStock,
      trend
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

export function runInventoryAgent(records: SalesRecord[]): Recommendation[] {
  return summarize(records).map((item, index) => {
    if (item.daysOfStock < 1.5) {
      return {
        id: `rec-inventory-${Date.now()}-${index}`,
        item: item.product,
        recommendation: `Restock or prep more ${item.product}.`,
        reason: `${item.product} has about ${item.daysOfStock.toFixed(1)} days of stock left based on recent sales.`,
        priority: "High",
        status: "Pending"
      };
    }

    if (item.trend === "down" && item.latestInventory > item.quantitySold / 2) {
      return {
        id: `rec-inventory-${Date.now()}-${index}`,
        item: item.product,
        recommendation: `Consider reducing prep for ${item.product} by 10–15%.`,
        reason: `${item.product} is trending down and inventory is still available.`,
        priority: "Low",
        status: "Pending"
      };
    }

    return {
      id: `rec-inventory-${Date.now()}-${index}`,
      item: item.product,
      recommendation: `Keep normal prep levels for ${item.product}.`,
      reason: `${item.product} inventory and sales look reasonable right now.`,
      priority: "Medium",
      status: "Pending"
    };
  });
}

export function runMarketingAgent(records: SalesRecord[]): Recommendation[] {
  const products = summarize(records);
  const top = products[0];

  if (!top) return [];

  return [
    {
      id: `rec-marketing-${Date.now()}`,
      item: top.product,
      recommendation: `Create a simple promo for ${top.product}.`,
      reason: `${top.product} is currently the strongest revenue driver in the uploaded data.`,
      priority: "Medium",
      status: "Pending"
    }
  ];
}

export function runDailySummaryAgent(records: SalesRecord[], recommendations: Recommendation[], orders: PhoneOrder[]) {
  const revenue = records.reduce((sum, row) => sum + row.revenue, 0);
  const units = records.reduce((sum, row) => sum + row.quantity_sold, 0);
  const topProduct = summarize(records)[0]?.product || "No product data";
  const pendingCount = recommendations.filter(r => r.status === "Pending").length + orders.filter(o => o.status === "Pending").length;

  return {
    title: "Today’s AI Business Summary",
    revenue,
    units,
    topProduct,
    summary: `Revenue from the uploaded data is $${revenue.toFixed(0)} across ${units} units sold. ${topProduct} is the top product. There are ${pendingCount} pending items waiting for owner approval.`
  };
}

export function createPhoneOrderDraft(input: { customerName: string; phone: string; rawText: string }): PhoneOrder {
  const quantityMatch = input.rawText.match(/\b\d+\b/);
  const quantity = quantityMatch ? Number(quantityMatch[0]) : 1;

  let item = "Custom Order";
  if (/cupcake/i.test(input.rawText)) item = "Chocolate Cupcakes";
  if (/croissant/i.test(input.rawText)) item = "Croissant Tray";
  if (/cake/i.test(input.rawText)) item = "Cake";

  let pickupTime = "Needs follow-up";
  const timeMatch = input.rawText.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday).*?(\d{1,2}\s?(am|pm))/i);
  if (timeMatch) pickupTime = timeMatch[0];

  return {
    id: `order-${Date.now()}`,
    customerName: input.customerName,
    phone: input.phone,
    item,
    quantity,
    pickupTime,
    estimatedTotal: quantity * 4,
    notes: input.rawText,
    status: "Pending"
  };
}
