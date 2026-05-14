import { useState, useCallback, useEffect } from "react";
import { fetchTableData, type Table } from "../api/nfzStatApi";
import { renderTableData, type TableData } from "./renderTableData";

interface TablePanelProps {
  table: Table;
  defaultExpanded?: boolean;
}

export function TablePanel({ table, defaultExpanded = false }: TablePanelProps) {
  const [data, setData] = useState<TableData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const load = useCallback(async () => {
    if (data || loading) return;
    setLoading(true);
    setError(null);
    try {
      const resourceName = table.attributes["resource-name"];
      const result = await fetchTableData<TableData>(resourceName, table.id);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Błąd pobierania danych");
    } finally {
      setLoading(false);
    }
  }, [table, data, loading]);

  useEffect(() => {
    if (expanded) load();
  }, [expanded]);

  const handleToggle = () => {
    setExpanded((x) => !x);
  };

  return (
    <div className={`table-panel ${expanded ? "expanded" : ""}`}>
      <button className="table-panel-toggle" onClick={handleToggle}>
        <span className="table-panel-title">{table.attributes.header}</span>
        <span className="table-panel-arrow">{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && (
        <div className="table-panel-body">
          {loading && <div className="stat-loading">Ładowanie danych…</div>}
          {error && <div className="stat-error">{error}</div>}
          {data && renderTableData(table.attributes["resource-name"], data)}
        </div>
      )}
    </div>
  );
}
