"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { csvTemplate, parseCSV, PhoneOrder, Recommendation, runDailySummaryAgent, runInventoryAgent, runMarketingAgent, createPhoneOrderDraft, sampleOrders, sampleSales, summarize } from "../../lib/agents";

type Tab = "overview" | "upload" | "recommendations" | "orders" | "approvals" | "activity";

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [records, setRecords] = useState(sampleSales);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => [...runInventoryAgent(sampleSales), ...runMarketingAgent(sampleSales)]);
  const [orders, setOrders] = useState<PhoneOrder[]>(sampleOrders);
  const [activity, setActivity] = useState<string[]>(["Demo data loaded", "Inventory Agent created initial recommendations", "Phone Order Agent created sample drafts"]);
  const [uploadError, setUploadError] = useState("");
  const [orderText, setOrderText] = useState("I want 24 chocolate cupcakes for Saturday at 3 PM");

  const products = useMemo(() => summarize(records), [records]);
  const daily = useMemo(() => runDailySummaryAgent(records, recommendations, orders), [records, recommendations, orders]);
  const pending = [...recommendations.filter(r => r.status === "Pending"), ...orders.filter(o => o.status === "Pending")];

  async function handleCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = parseCSV(await file.text());
      setRecords(parsed);
      const newRecs = [...runInventoryAgent(parsed), ...runMarketingAgent(parsed)];
      setRecommendations(newRecs);
      setActivity(a => [`Uploaded ${file.name}`, `Agents generated ${newRecs.length} recommendations`, ...a]);
      setUploadError("");
      setTab("overview");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Could not parse CSV");
    }
  }

  function resetDemo() {
    const newRecs = [...runInventoryAgent(sampleSales), ...runMarketingAgent(sampleSales)];
    setRecords(sampleSales);
    setOrders(sampleOrders);
    setRecommendations(newRecs);
    setActivity(["Demo data reset", "Agents generated sample recommendations"]);
    setTab("overview");
  }

  function runInventory() {
    const recs = runInventoryAgent(records);
    setRecommendations(prev => [...recs, ...prev]);
    setActivity(a => [`Inventory Agent generated ${recs.length} recommendations`, ...a]);
  }

  function runMarketing() {
    const recs = runMarketingAgent(records);
    setRecommendations(prev => [...recs, ...prev]);
    setActivity(a => [`Marketing Agent generated ${recs.length} suggestions`, ...a]);
  }

  function runSummary() {
    setActivity(a => [`Daily Summary Agent generated: ${daily.summary}`, ...a]);
  }

  function addOrder() {
    const order = createPhoneOrderDraft({
      customerName: "New Customer",
      phone: "Needs follow-up",
      rawText: orderText
    });
    setOrders(o => [order, ...o]);
    setActivity(a => [`Phone Order Agent created order draft: ${order.quantity} ${order.item}`, ...a]);
    setOrderText("");
  }

  function updateRec(id: string, status: "Approved" | "Rejected") {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    setActivity(a => [`Recommendation ${status.toLowerCase()}: ${id}`, ...a]);
  }

  function updateOrder(id: string, status: "Approved" | "Rejected") {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setActivity(a => [`Phone order ${status.toLowerCase()}: ${id}`, ...a]);
  }

  function downloadTemplate() {
    const blob = new Blob([csvTemplate()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "miaflow-sales-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="dashboard-layout">
      <aside className="sidebar">
        <Link href="/" className="small">← Back to website</Link>
        <div className="logo" style={{ margin: "28px 0" }}>
          <span className="logo-mark">M</span>MiaFlow
        </div>
        {[
          ["overview", "Overview"],
          ["upload", "Upload CSV"],
          ["recommendations", "Recommendations"],
          ["orders", "Phone Orders"],
          ["approvals", "Approvals"],
          ["activity", "Activity Log"]
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id as Tab)}
            className={`side-btn ${tab === id ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
        <div className="card card-pad" style={{ marginTop: 28 }}>
          <span className="badge badge-ok">Safe mode on</span>
          <p className="small">All important actions require owner approval.</p>
        </div>
      </aside>

      <section className="dash-main">
        <div className="dash-header">
          <div>
            <div className="small">MVP Demo</div>
            <h2>Small Business Operations Dashboard</h2>
          </div>
          <div className="btn-row" style={{ margin: 0 }}>
            <button className="btn btn-secondary" onClick={resetDemo}>Reset demo</button>
            <button className="btn btn-white" onClick={downloadTemplate}>CSV template</button>
          </div>
        </div>

        {tab === "overview" && (
          <div>
            <div className="grid-4">
              <Stat label="Revenue" value={`$${daily.revenue.toFixed(0)}`} note="Uploaded data" />
              <Stat label="Units sold" value={`${daily.units}`} note="Total quantity" />
              <Stat label="Top product" value={daily.topProduct} note="Best performer" />
              <Stat label="Pending" value={`${pending.length}`} note="Needs approval" />
            </div>
            <div className="card card-pad" style={{ marginTop: 18 }}>
              <span className="badge badge-ok">Daily Summary Agent</span>
              <h3 style={{ marginTop: 12 }}>{daily.title}</h3>
              <p>{daily.summary}</p>
              <button className="btn btn-primary" onClick={runSummary}>Run Daily Summary Agent</button>
            </div>
            <div className="card card-pad" style={{ marginTop: 18 }}>
              <h3>Product Performance</h3>
              <ProductTable products={products} />
            </div>
          </div>
        )}

        {tab === "upload" && (
          <div className="card card-pad">
            <h2>Upload sales CSV</h2>
            <p>Required columns: date, product, quantity_sold, revenue. Optional: category, inventory_on_hand.</p>
            <input className="input" type="file" accept=".csv,text/csv" onChange={handleCsv} />
            {uploadError && <p className="message-error">{uploadError}</p>}
            <button className="btn btn-white" onClick={downloadTemplate} style={{ marginTop: 16 }}>
              Download template
            </button>
          </div>
        )}

        {tab === "recommendations" && (
          <div>
            <div className="btn-row">
              <button className="btn btn-primary" onClick={runInventory}>Run Inventory Agent</button>
              <button className="btn btn-secondary" onClick={runMarketing}>Run Marketing Agent</button>
            </div>
            <div className="grid-2" style={{ marginTop: 18 }}>
              {recommendations.map(r => (
                <RecCard
                  key={r.id}
                  rec={r}
                  onApprove={() => updateRec(r.id, "Approved")}
                  onReject={() => updateRec(r.id, "Rejected")}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div>
            <div className="card card-pad">
              <h3>Create phone-order draft</h3>
              <textarea
                value={orderText}
                onChange={e => setOrderText(e.target.value)}
                placeholder="Paste raw customer order request"
              />
              <button className="btn btn-primary" onClick={addOrder} style={{ marginTop: 12 }}>
                Run Phone Order Agent
              </button>
            </div>
            <div className="grid-2" style={{ marginTop: 18 }}>
              {orders.map(o => (
                <OrderCard
                  key={o.id}
                  order={o}
                  onApprove={() => updateOrder(o.id, "Approved")}
                  onReject={() => updateOrder(o.id, "Rejected")}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "approvals" && (
          <div className="grid-2">
            {pending.length === 0 && (
              <div className="card card-pad">
                <h3>No pending approvals</h3>
                <p>Everything has been reviewed.</p>
              </div>
            )}
            {recommendations.filter(r => r.status === "Pending").map(r => (
              <RecCard
                key={r.id}
                rec={r}
                onApprove={() => updateRec(r.id, "Approved")}
                onReject={() => updateRec(r.id, "Rejected")}
              />
            ))}
            {orders.filter(o => o.status === "Pending").map(o => (
              <OrderCard
                key={o.id}
                order={o}
                onApprove={() => updateOrder(o.id, "Approved")}
                onReject={() => updateOrder(o.id, "Rejected")}
              />
            ))}
          </div>
        )}

        {tab === "activity" && (
          <div className="card card-pad">
            <h2>Agent Activity Log</h2>
            {activity.map((a, i) => (
              <div key={i} className="card card-pad" style={{ marginTop: 12 }}>
                <div className="small">{new Date().toLocaleTimeString()}</div>
                <p>{a}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="card card-pad">
      <div className="small">{label}</div>
      <div style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>{value}</div>
      <p className="small">{note}</p>
    </div>
  );
}

function ProductTable({ products }: { products: ReturnType<typeof summarize> }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Units</th>
            <th>Revenue</th>
            <th>Inventory</th>
            <th>Days stock</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.product}>
              <td>{p.product}</td>
              <td>{p.category}</td>
              <td>{p.quantitySold}</td>
              <td>${p.revenue.toFixed(0)}</td>
              <td>{p.latestInventory}</td>
              <td>{p.daysOfStock.toFixed(1)}</td>
              <td>
                <span className={p.trend === "up" ? "badge badge-ok" : p.trend === "down" ? "badge badge-med" : "badge badge-low"}>
                  {p.trend}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecCard({
  rec,
  onApprove,
  onReject
}: {
  rec: Recommendation;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span className={rec.priority === "High" ? "badge badge-high" : rec.priority === "Medium" ? "badge badge-med" : "badge badge-low"}>
          {rec.priority}
        </span>
        <span className={rec.status === "Pending" ? "badge badge-pending" : rec.status === "Approved" ? "badge badge-ok" : "badge badge-high"}>
          {rec.status}
        </span>
      </div>
      <h3 style={{ marginTop: 14 }}>{rec.item}</h3>
      <p>{rec.recommendation}</p>
      <p className="small">{rec.reason}</p>
      {rec.status === "Pending" && (
        <div className="btn-row">
          <button className="btn btn-primary" onClick={onApprove}>Approve</button>
          <button className="btn btn-secondary" onClick={onReject}>Reject</button>
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onApprove,
  onReject
}: {
  order: PhoneOrder;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span className="badge badge-low">Phone Order Draft</span>
        <span className={order.status === "Pending" ? "badge badge-pending" : order.status === "Approved" ? "badge badge-ok" : "badge badge-high"}>
          {order.status}
        </span>
      </div>
      <h3 style={{ marginTop: 14 }}>{order.customerName}</h3>
      <p><strong>Order:</strong> {order.quantity} {order.item}</p>
      <p><strong>Pickup:</strong> {order.pickupTime}</p>
      <p><strong>Estimated total:</strong> ${order.estimatedTotal}</p>
      <p className="small">{order.notes}</p>
      {order.status === "Pending" && (
        <div className="btn-row">
          <button className="btn btn-primary" onClick={onApprove}>Approve</button>
          <button className="btn btn-secondary" onClick={onReject}>Reject</button>
        </div>
      )}
    </div>
  );
}
