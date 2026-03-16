import DishItem from "@/components/kitchen/items/DishItem";
import kitchenService from "@/services/kitchenService";
import { useEffect, useState } from "react";

export default function ByDishTab({ searchTerm }) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await kitchenService.getOrdersByDish(searchTerm);
      setDishes(res.data || []);
      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [searchTerm]);
  if (loading)
    return <div className="p-6 text-gray-400 text-center">Đang tải...</div>;
  if (!dishes.length)
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
        <div className="opacity-20 mb-4">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z" />
          </svg>
        </div>

        <p>Chưa có dữ liệu theo món</p>
      </div>
    );
  return (
    <div className="flex flex-col">
      {dishes.map((dish) => (
        <DishItem key={dish._id} name={dish.itemName} qty={dish.totalQty} />
      ))}
    </div>
  );
}
