import { useEffect, useState } from "react";
import { getTables } from "@/services/tableService";

export default function useTables(page = 1, limit = 10) {
  const [tables, setTables] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTables = async (pageParam = page) => {
    try {
      setLoading(true);

      const res = await getTables({
        page: pageParam,
        limit,
      });

      setTables(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error("Fetch tables failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [page]);

  return {
    tables,
    total,
    loading,
    refreshTables: fetchTables,
  };
}
