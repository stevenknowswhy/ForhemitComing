import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useCallback } from "react";
import { TaskFormData, TaskPriority } from "../types";

// ============================================
// CRM Tasks Hook
// ============================================

interface UseCrmTasksOptions {
  companyId?: Id<"crmCompanies"> | null;
}

interface UseCrmTasksReturn {
  tasks: Doc<"crmTasks">[] | undefined;
  pendingTasks: Doc<"crmTasks">[] | undefined;
  overdueTasks: Doc<"crmTasks">[] | undefined;
  isLoading: boolean;
  createTask: (data: TaskFormData) => Promise<Id<"crmTasks">>;
  updateTask: (id: Id<"crmTasks">, data: Partial<TaskFormData>) => Promise<Id<"crmTasks">>;
  completeTask: (id: Id<"crmTasks">) => Promise<{ success: boolean }>;
  deleteTask: (id: Id<"crmTasks">) => Promise<{ success: boolean }>;
}

export function useCrmTasks(options: UseCrmTasksOptions = {}): UseCrmTasksReturn {
  const { companyId } = options;

  // Query tasks for company
  const tasks = useQuery(
    api.crmTasks.listByCompany,
    companyId ? { companyId } : "skip"
  );

  // Query all pending tasks
  const pendingTasks = useQuery(api.crmTasks.getPending, { limit: 50 });

  // Query overdue tasks
  const overdueTasks = useQuery(api.crmTasks.getOverdue, { limit: 20 });

  // Mutations
  const createMutation = useMutation(api.crmTasks.create);
  const updateMutation = useMutation(api.crmTasks.update);
  const completeMutation = useMutation(api.crmTasks.complete);
  const deleteMutation = useMutation(api.crmTasks.remove);

  // Create task handler
  const createTask = useCallback(
    async (data: TaskFormData): Promise<Id<"crmTasks">> => {
      return await createMutation({
        companyId: data.companyId as Id<"crmCompanies">,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priority: data.priority,
        assignedTo: data.assignedTo,
      });
    },
    [createMutation]
  );

  // Update task handler
  const updateTask = useCallback(
    async (id: Id<"crmTasks">, data: Partial<TaskFormData>): Promise<Id<"crmTasks">> => {
      return await updateMutation({
        id,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        priority: data.priority as TaskPriority | undefined,
        assignedTo: data.assignedTo,
      });
    },
    [updateMutation]
  );

  // Complete task handler
  const completeTask = useCallback(
    async (id: Id<"crmTasks">): Promise<{ success: boolean }> => {
      return await completeMutation({ id });
    },
    [completeMutation]
  );

  // Delete task handler
  const deleteTask = useCallback(
    async (id: Id<"crmTasks">): Promise<{ success: boolean }> => {
      return await deleteMutation({ id });
    },
    [deleteMutation]
  );

  return {
    tasks,
    pendingTasks,
    overdueTasks,
    isLoading: tasks === undefined && companyId !== undefined,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
  };
}
