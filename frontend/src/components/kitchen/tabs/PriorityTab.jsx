import { OrderItem } from "@/components/kitchen/items/OrderItem";
import kitchenService from "@/services/kitchenService";
import { useEffect, useState } from "react";

export default function PriorityTab({ searchTerm }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await kitchenService.getPendingOrders({
        itemName: searchTerm,
      });

      setItems(res.data || []);
    } catch (error) {
      console.error("Fetch priority items error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">Đang tải dữ liệu...</div>
    );
  }
  if (!items.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
        <div className="opacity-20 mb-4">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z" />
          </svg>
        </div>

        <p>Chưa có món nào cần chế biến</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <OrderItem
          key={item._id}
          name={item.name}
          table={item.table?.tableName}
          time={item.waitingTime}
          qty={item.qty}
          note={item.note}
        />
      ))}
    </div>
  );
}
