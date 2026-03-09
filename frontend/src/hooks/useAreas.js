import { useEffect, useState } from "react";
import { getAllAreas } from "@/services/areaService";

export default function useAreas() {
  const [areas, setAreas] = useState([]);

  const refreshAreas = async () => {
    try {
      const res = await getAllAreas();
      setAreas(res.data);
    } catch (error) {
      console.error("Fetch areas failed", error);
    }
  };

  useEffect(() => {
    const loadAreas = async () => {
      try {
        const res = await getAllAreas();
        setAreas(res.data);
      } catch (error) {
        console.error("Fetch areas failed", error);
      }
    };

    loadAreas();
  }, []);

  return {
    areas,
    refreshAreas,
  };
}
