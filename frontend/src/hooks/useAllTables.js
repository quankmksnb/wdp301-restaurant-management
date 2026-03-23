import { useEffect, useState } from "react";
import { getAllTables } from "@/services/tableService";

export default function useAllTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    try {
      setLoading(true);

      const res = await getAllTables();
      setTables(res.data || []);
    } catch (error) {
      console.error("Fetch all tables failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return {
    tables,
    loading,
    refreshTables: fetchTables,
  };
}
