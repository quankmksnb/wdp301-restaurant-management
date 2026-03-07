import { useEffect, useState } from "react";
import { getAllAreas } from "../services/areaService";

export default function useAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const res = await getAllAreas();

      setAreas(res.data || []);
    } catch (error) {
      console.error("Lỗi load khu vực", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return {
    areas,
    loading,
    refreshAreas: fetchAreas,
  };
}
