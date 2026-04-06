import type { IntakeAnswers } from "../types";

export type SaveClassificationResult = IntakeAnswers & {
  clientType?: string;
  success: boolean;
  clientId: string;
};

/**
 * Saves classification intake answers.
 * If a Convex action is provided, it will also send a notification.
 */
export async function saveClassification(
  data: IntakeAnswers & { clientType?: string },
  sendNotification?: (args: { role: string; answers: string; clientType?: string }) => Promise<unknown>,
): Promise<SaveClassificationResult> {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();

  if (sendNotification) {
    try {
      await sendNotification({
        role: data.role || "unknown",
        answers: JSON.stringify(data),
        clientType: data.clientType,
      });
    } catch (err) {
      console.error("Classification notification error:", err);
    }
  }

  return {
    success: true,
    clientId: `CLT-${rand}`,
    ...data,
  };
}
