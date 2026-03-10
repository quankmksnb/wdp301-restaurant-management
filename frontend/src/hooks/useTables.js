import { useEffect, useState } from "react";
import { getTables } from "@/services/tableService";

export default function useTables(page, filters) {
  const [tables, setTables] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    try {
      setLoading(true);

      const res = await getTables({
        page,
        area: filters.area,
        status: filters.status,
        search: filters.search,
      });

      setTables(res.data || []);
      setTotal(res.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [page, filters]);

  return {
    tables,
    total,
    loading,
    refreshTables: fetchTables,
  };
}
