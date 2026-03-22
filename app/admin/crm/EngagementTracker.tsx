"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import "./styles/crm-theme.css";

// Types
import {
  Company,
  CompanyFilters,
  SortConfig,
  CrmView,
  DueFilter,
  CompanyFormData,
} from "./types";

// Hooks
import {
  useCrmCompanies,
  useCrmStats,
} from "./hooks";

// Components
import {
  ViewToggle,
  StatsBar,
  FilterSidebar,
  Toolbar,
  TableView,
  KanbanView,
  CalendarView,
  AnalyticsView,
  CompanyDetailPanel,
  CompanyModal,
} from "./components";

// Utils
import { filterCompanies, sortCompanies } from "./lib";

// ============================================
// Engagement Tracker Component
// ============================================

export function EngagementTracker() {
  // State
  const [currentView, setCurrentView] = useState<CrmView>("table");
  const [selectedCompanyId, setSelectedCompanyId] = useState<Id<"crmCompanies"> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<string | undefined>();

  // Filters
  const [filters, setFilters] = useState<CompanyFilters>({
    stage: "all",
    ndaStatus: "all",
    searchQuery: "",
    advisor: "all",
    dueFilter: "all",
  });

  // Sort
  const [sort, setSort] = useState<SortConfig>({
    field: "date_desc",
    direction: "desc",
  });

  // Data fetching
  const { companies, createCompany, updateCompany, deleteCompany } = useCrmCompanies();
  const { stats } = useCrmStats();

  // Filtered and sorted companies
  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    let result = filterCompanies(companies, filters);
    result = sortCompanies(result, sort);
    return result;
  }, [companies, filters, sort]);

  // Stage counts for sidebar
  const stageCounts = useMemo(() => {
    if (!companies) return {};
    const counts: Record<string, number> = {};
    companies.forEach((c) => {
      counts[c.stage] = (counts[c.stage] || 0) + 1;
    });
    return counts;
  }, [companies]);

  // NDA counts for sidebar
  const ndaCounts = useMemo(() => {
    if (!companies) return { all: 0, Signed: 0, Pending: 0, None: 0 };
    return {
      all: companies.length,
      Signed: companies.filter((c) => c.ndaStatus === "Signed").length,
      Pending: companies.filter((c) => c.ndaStatus === "Pending").length,
      None: companies.filter((c) => c.ndaStatus === "None").length,
    };
  }, [companies]);

  // Handlers
  const handleFilterChange = useCallback((newFilters: Partial<CompanyFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleSort = useCallback((field: string) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleAddCompany = useCallback(() => {
    setEditingCompany(null);
    setModalInitialDate(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEditCompany = useCallback((company: Company) => {
    setEditingCompany(company);
    setModalInitialDate(undefined);
    setIsModalOpen(true);
  }, []);

  const handleAddWithDate = useCallback((date: string) => {
    setEditingCompany(null);
    setModalInitialDate(date);
    setIsModalOpen(true);
  }, []);

  const handleSaveCompany = useCallback(
    async (data: CompanyFormData) => {
      if (editingCompany) {
        await updateCompany(editingCompany._id, data);
      } else {
        await createCompany(data);
      }
      setIsModalOpen(false);
      setEditingCompany(null);
    },
    [editingCompany, createCompany, updateCompany]
  );

  const handleDeleteCompany = useCallback(
    async (company: Company) => {
      if (confirm(`Are you sure you want to delete ${company.name}?`)) {
        await deleteCompany(company._id);
      }
    },
    [deleteCompany]
  );

  const handleSelectCompany = useCallback((company: Company) => {
    setSelectedCompanyId(company._id);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>("input[type=\"text\"]")?.focus();
      }
      // N for new company
      else if (e.key === "n" && !e.metaKey && !e.ctrlKey && e.target instanceof HTMLElement &&
               e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        handleAddCompany();
      }
      // Escape to close modal
      else if (e.key === "Escape") {
        setIsModalOpen(false);
        setSelectedCompanyId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAddCompany]);

  const rowCount = `${filteredCompanies.length} of ${companies?.length || 0}`;

  return (
    <div className="crm-container flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)] sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <div className="font-serif text-xl font-semibold text-[#2dd882] tracking-tight">
            Business <span className="text-[var(--text2)] font-light italic">Tracker</span>
          </div>
          <ViewToggle currentView={currentView} onChange={setCurrentView} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleAddCompany} className="btn btn-primary flex items-center gap-1.5 text-[12px]">
            + Add Company
            <kbd className="ml-1 px-1.5 py-0.5 text-[10px] bg-[var(--bg)] border border-[var(--border)] rounded">
              N
            </kbd>
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <StatsBar
        stats={stats}
        activeDueFilter={filters.dueFilter}
        onFilterChange={(filter) => handleFilterChange({ dueFilter: filter })}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          stageCounts={stageCounts}
          ndaCounts={ndaCounts}
        />

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar (only for table view) */}
          {currentView === "table" && (
            <Toolbar
              searchValue={filters.searchQuery}
              onSearchChange={(value) => handleFilterChange({ searchQuery: value })}
              sortValue={`${sort.field}_${sort.direction}`}
              onSortChange={(value) => {
                const [field, direction] = value.split("_");
                setSort({ field, direction: direction as "asc" | "desc" });
              }}
              rowCount={rowCount}
              onAddClick={handleAddCompany}
            />
          )}

          {/* View Content */}
          <div className="flex-1 overflow-hidden">
            {currentView === "table" && (
              <TableView
                companies={filteredCompanies}
                sort={sort}
                onSort={handleSort}
                onSelect={handleSelectCompany}
                onEdit={handleEditCompany}
                onDelete={handleDeleteCompany}
              />
            )}
            {currentView === "kanban" && (
              <KanbanView
                companies={filteredCompanies}
                onSelect={handleSelectCompany}
              />
            )}
            {currentView === "calendar" && (
              <CalendarView
                companies={filteredCompanies}
                onSelect={handleSelectCompany}
                onAddWithDate={handleAddWithDate}
              />
            )}
            {currentView === "analytics" && <AnalyticsView stats={stats} />}
          </div>
        </div>
      </div>

      {/* Company Detail Panel */}
      {selectedCompanyId && (
        <CompanyDetailPanel
          companyId={selectedCompanyId}
          onClose={() => setSelectedCompanyId(null)}
          onEdit={(company) => {
            setEditingCompany(company);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <CompanyModal
          company={editingCompany}
          initialDate={modalInitialDate}
          onSave={handleSaveCompany}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCompany(null);
          }}
        />
      )}
    </div>
  );
}
