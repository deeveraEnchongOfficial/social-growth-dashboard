/**
 * Client helper to send a generated item to the Approval Queue.
 * Creates an approval item via POST /api/approvals.
 */
export async function sendToApproval(params: {
  type: string;
  title: string;
  preview: string;
  aiSource?: string;
  brandSafety?: string;
  itemId?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || "Failed to send to approval" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}
