"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileUp,
  LayoutDashboard,
  PhoneCall,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Store,
  XCircle
} from "lucide-react";
import {
  Activity as ActivityType,
  PhoneOrder,
  Recommendation,
  SalesRecord,
  buildActivities,
  buildDailySummary,
  buildRecommendations,
  mockOrders,
  parseCSV,
  sampleSalesData,
  summarizeProducts,
  toCsvTemplate
} from "@/lib/miaflow";

type Tab =
  | "overview"
  | "upload"
  | "recommendations"
  | "orders"
  | "approvals"
  | "activity";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "upload", label: "Upload", icon: FileUp },
  { id: "recommendations", label: "Recommendations", icon: ClipboardCheck },
  { id: "orders", label: "Phone Orders", icon: PhoneCall },
  { id: "approvals", label: "Approvals", icon: ShieldCheck },
  { id: "activity", label: "Activity", icon: Activity }
];

export default function DashboardApp() {
  const [records, setRecords] = useState<SalesRecord[]>(sampleSalesData);
  const [orders, setOrders] = useState<PhoneOrder[]>(mockOrders);
  const [manualRecommendations, setManualRecommendations] = useState<
    Recommendation[] | null
  >(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [uploadError, setUploadError] = useState("");
  const [uploadName, setUploadName] = useState("Sample bakery data");

  const summaries = useMemo(() => summarizeProducts(records), [records]);
  const generatedRecommendations = useMemo(
    () => buildRecommendations(summaries),
    [summaries]
  );
  const recommendations = manualRecommendations ?? generatedRecommendations;
  const dailySummary = useMemo(
    () => buildDailySummary(records, summaries, recommendations),
    [records, summaries, recommendations]
  );
  const activities = useMemo<ActivityType[]>(
    () => buildActivities(recommendations, orders),
    [recommendations, orders]
  );

  const pendingApprovals = [
    ...recommendations
      .filter((item) => item.status === "Pending")
      .map((item) => ({
        id: item.id,
        kind: "Recommendation",
        title: item.recommendation,
        details: item.reason
      })),
    ...orders
      .filter((item) => item.status === "Pending")
      .map((item) => ({
        id: item.id,
        kind: "Phone Order",
        title: `${item.quantity} ${item.item} for ${item.customerName}`,
        details: `${item.pickupTime}. Estimated total: $${item.estimatedTotal}.`
      }))
  ];

  function updateRecommendationStatus(
    id: string,
    status: Recommendation["status"]
  ) {
    setManualRecommendations((current) => {
      const base = current ?? recommendations;
      return base.map((item) => (item.id === id ? { ...item, status } : item));
    });
  }

  function updateOrderStatus(id: string, status: PhoneOrder["status"]) {
    setOrders((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  function handleApproval(id: string, status: "Approved" | "Rejected") {
    if (id.startsWith("rec-")) updateRecommendationStatus(id, status);
    if (id.startsWith("order-")) updateOrderStatus(id, status);
  }

  async function handleCsvUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      setRecords(parsed);
      setManualRecommendations(null);
      setUploadName(file.name);
      setTab("overview");
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Could not parse the CSV file."
      );
    }
  }

  function resetDemoData() {
    setRecords(sampleSalesData);
    setOrders(mockOrders);
    setManualRecommendations(null);
    setUploadName("Sample bakery data");
    setUploadError("");
  }

  function downloadTemplate() {
    const blob = new Blob([toCsvTemplate()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "miaflow-sales-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-slate-950/95 p-6 lg:block">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-semibold">MiaFlow</p>
            <p className="text-sm text-slate-400">MVP Dashboard</p>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-blue-500 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <p className="text-sm font-semibold text-emerald-300">
            Safe mode on
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            AI recommendations and order drafts require owner approval.
          </p>
        </div>
      </aside>

      <section className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/85 px-4 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Current data source: {uploadName}
              </p>
              <h1 className="text-2xl font-bold md:text-3xl">
                Small Business Operations Dashboard
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={resetDemoData}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset demo
              </button>
              <button
                onClick={downloadTemplate}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200"
              >
                <Download className="h-4 w-4" />
                CSV template
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {tabs.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                    active ? "bg-blue-500 text-white" : "bg-white/10 text-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {tab === "overview" && (
            <Overview
              dailySummary={dailySummary}
              summaries={summaries}
              pendingCount={pendingApprovals.length}
              recommendationCount={recommendations.length}
            />
          )}

          {tab === "upload" && (
            <UploadPanel
              uploadError={uploadError}
              handleCsvUpload={handleCsvUpload}
              downloadTemplate={downloadTemplate}
            />
          )}

          {tab === "recommendations" && (
            <RecommendationsPanel
              recommendations={recommendations}
              updateRecommendationStatus={updateRecommendationStatus}
            />
          )}

          {tab === "orders" && (
            <OrdersPanel orders={orders} updateOrderStatus={updateOrderStatus} />
          )}

          {tab === "approvals" && (
            <ApprovalsPanel
              approvals={pendingApprovals}
              handleApproval={handleApproval}
            />
          )}

          {tab === "activity" && <ActivityPanel activities={activities} />}
        </div>
      </section>
    </main>
  );
}

function Overview({
  dailySummary,
  summaries,
  pendingCount,
  recommendationCount
}: {
  dailySummary: ReturnType<typeof buildDailySummary>;
  summaries: ReturnType<typeof summarizeProducts>;
  pendingCount: number;
  recommendationCount: number;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Revenue"
          value={`$${dailySummary.revenue.toFixed(0)}`}
          note="From uploaded data"
          icon={BarChart3}
        />
        <StatCard
          label="Units sold"
          value={dailySummary.quantity.toString()}
          note="Total quantity"
          icon={Store}
        />
        <StatCard
          label="Recommendations"
          value={recommendationCount.toString()}
          note="AI-generated"
          icon={ClipboardCheck}
        />
        <StatCard
          label="Pending approvals"
          value={pendingCount.toString()}
          note="Owner review"
          icon={ShieldCheck}
        />
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500 p-3">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{dailySummary.title}</h2>
            <p className="text-sm text-slate-400">
              Generated by MiaFlow Daily Summary Agent
            </p>
          </div>
        </div>
        <p className="leading-8 text-slate-300">{dailySummary.text}</p>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-2xl font-semibold">Product performance</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="py-3">Product</th>
                <th>Category</th>
                <th>Units sold</th>
                <th>Revenue</th>
                <th>Inventory</th>
                <th>Days stock</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((item) => (
                <tr key={item.product} className="border-t border-white/10">
                  <td className="py-4 font-medium">{item.product}</td>
                  <td className="text-slate-300">{item.category}</td>
                  <td>{item.quantitySold}</td>
                  <td>${item.revenue.toFixed(0)}</td>
                  <td>{item.currentInventory}</td>
                  <td>{item.daysOfStock.toFixed(1)}</td>
                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        item.trend === "up"
                          ? "bg-emerald-400/10 text-emerald-300"
                          : item.trend === "down"
                          ? "bg-amber-400/10 text-amber-300"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {item.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
  icon: Icon
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{note}</p>
    </div>
  );
}

function UploadPanel({
  uploadError,
  handleCsvUpload,
  downloadTemplate
}: {
  uploadError: string;
  handleCsvUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  downloadTemplate: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
      <FileUp className="mb-5 h-10 w-10 text-blue-300" />
      <h2 className="text-3xl font-bold">Upload sales CSV</h2>
      <p className="mt-4 max-w-2xl leading-8 text-slate-300">
        Upload business sales data to generate product summaries, inventory
        recommendations, and daily AI-style insights.
      </p>

      <div className="mt-6 rounded-3xl border border-dashed border-white/20 bg-slate-950 p-8">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleCsvUpload}
          className="block w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:font-semibold file:text-white"
        />
        {uploadError && <p className="mt-4 text-sm text-red-300">{uploadError}</p>}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="font-semibold">Required columns</h3>
        <p className="mt-2 text-sm text-slate-300">
          date, product, quantity_sold, revenue
        </p>
        <h3 className="mt-4 font-semibold">Optional columns</h3>
        <p className="mt-2 text-sm text-slate-300">
          category, inventory_on_hand
        </p>
        <button
          onClick={downloadTemplate}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200"
        >
          <Download className="h-4 w-4" />
          Download CSV template
        </button>
      </div>
    </div>
  );
}

function RecommendationsPanel({
  recommendations,
  updateRecommendationStatus
}: {
  recommendations: Recommendation[];
  updateRecommendationStatus: (
    id: string,
    status: Recommendation["status"]
  ) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {recommendations.map((rec) => (
        <div
          key={rec.id}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                rec.priority === "High"
                  ? "bg-red-400/10 text-red-300"
                  : rec.priority === "Medium"
                  ? "bg-amber-400/10 text-amber-300"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              {rec.priority} priority
            </span>
            <span className="rounded-full bg-blue-400/10 px-3 py-1 text-xs text-blue-300">
              {rec.type}
            </span>
          </div>
          <h2 className="text-2xl font-semibold">{rec.item}</h2>
          <p className="mt-3 leading-7 text-slate-200">{rec.recommendation}</p>
          <p className="mt-3 text-sm leading-6 text-slate-400">{rec.reason}</p>
          <StatusActions
            status={rec.status}
            onApprove={() => updateRecommendationStatus(rec.id, "Approved")}
            onReject={() => updateRecommendationStatus(rec.id, "Rejected")}
          />
        </div>
      ))}
    </div>
  );
}

function OrdersPanel({
  orders,
  updateOrderStatus
}: {
  orders: PhoneOrder[];
  updateOrderStatus: (id: string, status: PhoneOrder["status"]) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-blue-400/10 px-3 py-1 text-xs text-blue-300">
              Phone Order Draft
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                order.status === "Approved"
                  ? "bg-emerald-400/10 text-emerald-300"
                  : order.status === "Rejected"
                  ? "bg-red-400/10 text-red-300"
                  : "bg-amber-400/10 text-amber-300"
              }`}
            >
              {order.status}
            </span>
          </div>
          <h2 className="text-2xl font-semibold">{order.customerName}</h2>
          <p className="mt-1 text-sm text-slate-400">{order.phone}</p>
          <div className="mt-5 space-y-2 text-slate-300">
            <p>
              <span className="font-semibold text-white">Order:</span>{" "}
              {order.quantity} {order.item}
            </p>
            <p>
              <span className="font-semibold text-white">Pickup:</span>{" "}
              {order.pickupTime}
            </p>
            <p>
              <span className="font-semibold text-white">Estimated total:</span>{" "}
              ${order.estimatedTotal}
            </p>
            <p>
              <span className="font-semibold text-white">Notes:</span>{" "}
              {order.notes}
            </p>
          </div>
          <StatusActions
            status={order.status}
            onApprove={() => updateOrderStatus(order.id, "Approved")}
            onReject={() => updateOrderStatus(order.id, "Rejected")}
          />
        </div>
      ))}
    </div>
  );
}

function ApprovalsPanel({
  approvals,
  handleApproval
}: {
  approvals: { id: string; kind: string; title: string; details: string }[];
  handleApproval: (id: string, status: "Approved" | "Rejected") => void;
}) {
  if (approvals.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
        <CheckCircle2 className="mx-auto mb-5 h-12 w-12 text-emerald-300" />
        <h2 className="text-3xl font-bold">No pending approvals</h2>
        <p className="mt-3 text-slate-300">
          All current recommendations and order drafts have been reviewed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {approvals.map((approval) => (
        <div
          key={approval.id}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
              Needs owner approval
            </span>
            <span className="text-sm text-slate-400">{approval.kind}</span>
          </div>
          <h2 className="text-xl font-semibold">{approval.title}</h2>
          <p className="mt-2 text-slate-400">{approval.details}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => handleApproval(approval.id, "Approved")}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold hover:bg-emerald-400"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </button>
            <button
              onClick={() => handleApproval(approval.id, "Rejected")}
              className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-400"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityPanel({ activities }: { activities: ActivityType[] }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-3xl font-bold">Agent activity log</h2>
      <p className="mt-2 text-slate-400">
        A clear record of what the AI recommended, drafted, or flagged.
      </p>
      <div className="mt-6 space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex gap-4 rounded-3xl border border-white/10 bg-slate-950 p-5"
          >
            <div className="mt-1 h-3 w-3 rounded-full bg-blue-400" />
            <div>
              <p className="text-sm text-slate-400">
                {activity.time} · {activity.agent}
              </p>
              <p className="mt-1 text-slate-200">{activity.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusActions({
  status,
  onApprove,
  onReject
}: {
  status: "Pending" | "Approved" | "Rejected";
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <span
        className={`rounded-full px-3 py-1 text-xs ${
          status === "Approved"
            ? "bg-emerald-400/10 text-emerald-300"
            : status === "Rejected"
            ? "bg-red-400/10 text-red-300"
            : "bg-amber-400/10 text-amber-300"
        }`}
      >
        {status}
      </span>
      {status === "Pending" && (
        <>
          <button
            onClick={onApprove}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold hover:bg-emerald-400"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve
          </button>
          <button
            onClick={onReject}
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-400"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </button>
        </>
      )}
    </div>
  );
}
