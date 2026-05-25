"use client";

import { useState, useCallback } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

// ============================================
// Deal Queue View Component
// ============================================

export function DealQueueView() {
  const activeDeals = useQuery(api.dealEngine.getActiveDeals);

  if (activeDeals === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--text3)] text-[13px]">Loading deal queue...</div>
      </div>
    );
  }

  if (activeDeals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div className="text-[var(--text3)] text-[14px]">No active deals</div>
        <div className="text-[var(--text3)] text-[12px]">
          Initialize a deal on a company to see it here
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeDeals.map((company: any) => (
        <DealCard key={company._id} company={company} />
      ))}
    </div>
  );
}

// ============================================
// Deal Card Component
// ============================================

function DealCard({ company }: { company: any }) {
  const pendingTasks = useQuery(api.dealEngine.getDealQueue, { companyId: company._id });
  const generateTask = useAction((api as any).dealProcessor.generateQueueTask);
  const [generating, setGenerating] = useState<string | null>(null);
  const [generateModal, setGenerateModal] = useState<{ taskId: string; templateName: string } | null>(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  const now = Date.now();

  // Separate pending and overdue tasks
  const tasks = pendingTasks ?? [];
  const overdue = tasks.filter(
    (t: any) => t.status === "pending" && t.dueDate && t.dueDate < now
  );
  const pending = tasks.filter(
    (t: any) => t.status === "pending" && (!t.dueDate || t.dueDate >= now)
  );

  const handleGenerate = useCallback(async () => {
    if (!generateModal || !recipientEmail || !recipientName) return;
    setGenerating(generateModal.taskId);
    try {
      await generateTask({
        taskId: generateModal.taskId as Id<"workflowTasks">,
        recipientEmail,
        recipientName,
        senderEmail: senderEmail || undefined,
      });
      setGenerateModal(null);
      setRecipientEmail("");
      setRecipientName("");
      setSenderEmail("");
    } catch (err) {
      console.error("Failed to generate:", err);
    } finally {
      setGenerating(null);
    }
  }, [generateModal, recipientEmail, recipientName, senderEmail, generateTask]);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface2)] border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-[var(--text)]">{company.name}</span>
          <span className="text-[11px] text-[var(--text3)] px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)]">
            {company.ref || "No ref"}
          </span>
          <span className="text-[11px] text-[var(--text3)] px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)]">
            Tier {company.fees?.tier || "?"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-[var(--text2)]">
            {company.fees?.totalFee ? formatCurrency(company.fees.totalFee) : "—"}
          </span>
          <span className="text-[11px] text-[var(--text3)]">{company.stage}</span>
        </div>
      </div>

      {/* Overdue tasks */}
      {overdue.length > 0 && (
        <div className="px-4 py-2 bg-red-500/5 border-b border-red-500/20">
          <div className="text-[10px] uppercase tracking-[1px] text-red-400 mb-2 font-medium">
            Overdue ({overdue.length})
          </div>
          {overdue.map((task: any) => (
            <TaskRow
              key={task.taskId}
              task={task}
              variant="overdue"
              onGenerate={(taskId, templateName) => {
                setRecipientEmail("");
                setRecipientName("");
                setSenderEmail("");
                setGenerateModal({ taskId, templateName });
              }}
              isGenerating={generating === task.taskId}
            />
          ))}
        </div>
      )}

      {/* Pending tasks */}
      {pending.length > 0 && (
        <div className="px-4 py-2">
          <div className="text-[10px] uppercase tracking-[1px] text-[var(--text3)] mb-2 font-medium">
            Up Next ({pending.length})
          </div>
          {pending.slice(0, 10).map((task: any) => (
            <TaskRow
              key={task.taskId}
              task={task}
              variant="pending"
              onGenerate={(taskId, templateName) => {
                setRecipientEmail("");
                setRecipientName("");
                setSenderEmail("");
                setGenerateModal({ taskId, templateName });
              }}
              isGenerating={generating === task.taskId}
            />
          ))}
          {pending.length > 10 && (
            <div className="text-[11px] text-[var(--text3)] py-2">
              +{pending.length - 10} more tasks
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="px-4 py-6 text-center text-[var(--text3)] text-[12px]">
          No pending tasks for this deal
        </div>
      )}

      {/* Generate Modal */}
      {generateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setGenerateModal(null)}
        >
          <div
            className="bg-[var(--surface)] rounded-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--text)] mb-1">Generate & Send</h3>
            <p className="text-[12px] text-[var(--text3)] mb-4">{generateModal.templateName}</p>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase tracking-[1px] text-[var(--text3)] block mb-1">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="seller@example.com"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[1px] text-[var(--text3)] block mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[1px] text-[var(--text3)] block mb-1">
                  Notify Sender (email)
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="team@forhemit.com"
                  className="w-full"
                />
                <p className="text-[10px] text-[var(--text3)] mt-1">
                  Sender will receive the PDF + instructions to review and send
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setGenerateModal(null)} className="flex-1 btn btn-ghost">
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!recipientEmail || !recipientName || generating !== null}
                className="flex-1 btn btn-primary disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate & Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Task Row Component
// ============================================

function TaskRow({
  task,
  variant,
  onGenerate,
  isGenerating,
}: {
  task: any;
  variant: "overdue" | "pending";
  onGenerate: (taskId: string, templateName: string) => void;
  isGenerating: boolean;
}) {
  const formatDueDate = (ms: number) => {
    const date = new Date(ms);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`flex items-center justify-between py-2 px-2 rounded-md mb-1 ${
        variant === "overdue"
          ? "bg-red-500/10 border border-red-500/20"
          : "bg-[var(--surface2)] border border-[var(--border)]"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-[12px] text-[var(--text)] truncate">
          {task.templateName || "Unknown template"}
        </span>
        {task.audience?.length > 0 && (
          <span className="text-[10px] text-[var(--text3)] px-1.5 py-0.5 rounded bg-[var(--surface)] shrink-0">
            {Array.isArray(task.audience) ? task.audience[0] : task.audience}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {task.dueDate && (
          <span
            className={`text-[11px] ${
              variant === "overdue" ? "text-red-400" : "text-[var(--text3)]"
            }`}
          >
            {formatDueDate(task.dueDate)}
          </span>
        )}
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            variant === "overdue"
              ? "bg-red-500/20 text-red-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {variant === "overdue" ? "Overdue" : "Pending"}
        </span>
        {task.status !== "sent" && task.status !== "completed" && (
          <button
            onClick={() => onGenerate(task.taskId, task.templateName)}
            disabled={isGenerating}
            className="text-[10px] px-2 py-0.5 rounded bg-[var(--brass)]/10 text-[var(--brass)] hover:bg-[var(--brass)]/20 transition-colors disabled:opacity-50"
          >
            {isGenerating ? "..." : "Generate"}
          </button>
        )}
      </div>
    </div>
  );
}
