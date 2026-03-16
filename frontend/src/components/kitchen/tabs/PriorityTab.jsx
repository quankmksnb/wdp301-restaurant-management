import { OrderItem } from "@/components/kitchen/OrderItem";

export default function PriorityTab() {
  return (
    <div className="flex flex-col">
      <OrderItem
        name="Phở Bò Tái Lăn"
        table="Bàn 05"
        time="10:15"
        qty={3}
        note="Không hành, nhiều nước dùng"
        onOutOfStock={() => alert("Báo hết món này?")}
      />

      <OrderItem
        name="Cơm Rang Dưa Bò"
        table="Bàn 12"
        time="10:20"
        qty={1}
        note=""
      />
    </div>
  );
}
