"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import WaiterHeader from "./components/WaiterHeader";
import OrderPanel from "./components/OrderPanel";
import TableCard from "./components/TableCard";
import FoodCard from "./components/FoodCard";
import WaiterFooter from "./components/WaiterFooter";

const ALL_TABLES = [
  { id: 1, name: "Bàn 1", floor: "all" },
  { id: 2, name: "Bàn 2", floor: "all" },
  { id: 3, name: "Bàn 3", floor: "all" },
  { id: 4, name: "Bàn 4", floor: "all" },
  { id: 12, name: "Bàn 12", floor: "all" },
  { id: 13, name: "Bàn 13", floor: "lau2" },
  { id: 14, name: "Bàn 14", floor: "lau2" },
  { id: 15, name: "Bàn 15", floor: "lau3" },
  { id: 21, name: "Phòng VIP 1", floor: "vip" },
  { id: 23, name: "Phòng VIP 2", floor: "vip" },
  { id: 24, name: "Phòng VIP 3", floor: "vip" },
];

const FLOORS = [
  { key: "all", label: "Tất cả" },
  { key: "lau2", label: "Lầu 2" },
  { key: "lau3", label: "Lầu 3" },
  { key: "vip", label: "Phòng VIP" },
];

const CATEGORIES = [
  { key: "all", label: "Tất cả" },
  { key: "bia", label: "BIA & THUỐC LÁ" },
  { key: "cocktail", label: "CLASSIC COCKTAILS" },
  { key: "khai_vi", label: "MÓN KHAI VỊ" },
];

const ALL_FOODS = [
  { id: 1, name: "MILANO", price: 30000, cat: "cocktail", img: "https://images.unsplash.com/photo-1560508180-03f285f67ded?w=300&h=200&fit=crop" },
  { id: 2, name: "APEROL SPRITZ", price: 30000, cat: "cocktail", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop" },
  { id: 5, name: "BLOODY MARY", price: 30000, cat: "cocktail", img: "https://images.unsplash.com/photo-1607622750671-6cd9a99eabd1?w=300&h=200&fit=crop" },
  { id: 6, name: "Bánh mì bò lò đậm bông & phomai", price: 125000, cat: "khai_vi", img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=300&h=200&fit=crop" },
  { id: 8, name: "Đĩa thịt nguội Tây Ba Nha hảo hạng", price: 125000, cat: "khai_vi", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop" },
  { id: 9, name: "Phomai dây Nga", price: 125000, cat: "khai_vi", img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=200&fit=crop" },
];

export default function WaiterPage() {

  const [activeTab, setActiveTab] = useState("phonban");
  const [selTable, setSelTable] = useState(null);
  const [tOrders, setTOrders] = useState({});
  const [activeFloor, setActiveFloor] = useState("all");
  const [filter, setFilter] = useState("all");
  const [activeCat, setActiveCat] = useState("all");
  const [kitchenDone, setKitchenDone] = useState([]);

  const cart = selTable ? (tOrders[selTable.id] || []) : [];

  const setCart = (c) => {
    if (selTable) {
      setTOrders(prev => ({ ...prev, [selTable.id]: c }));
    }
  };

  const addFood = (food) => {
    if (!selTable) {
      alert("Vui lòng chọn bàn trước!");
      return;
    }

    const ex = cart.find(i => i.id === food.id);

    if (ex) {
      setCart(cart.map(i => i.id === food.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...food, qty: 1 }]);
    }
  };

  const inc = id =>
    setCart(cart.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));

  const dec = id =>
    setCart(cart.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0));

  const removeItem = id =>
    setCart(cart.filter(i => i.id !== id));

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const usedIds =
    Object.keys(tOrders)
      .filter(id => (tOrders[id]?.length || 0) > 0)
      .map(Number);

  const fmt = n => n.toLocaleString("vi-VN");
  const floorLabel =
    FLOORS.find(f => f.key === selTable?.floor)?.label || "Tất cả";
    const [soundOn, setSoundOn] = useState(true);
const playSound = () => {
  if (!soundOn) return;

  const audio = new Audio("/sounds/ting.mp3");
  audio.play();
};
  // demo bếp làm xong món sau 8s kể từ khi thêm
  useEffect(() => {
    if (cart.length === 0) return;
    const t = setTimeout(() => {
      const notDone = cart.filter(i => !kitchenDone.includes(i.id));
      if (notDone.length > 0) {
        const pick = notDone[Math.floor(Math.random() * notDone.length)];
        setKitchenDone(prev => [...prev, pick.id]);
        playSound();
      }
    }, 8000);
    return () => clearTimeout(t);
  }, [cart, kitchenDone, soundOn]);

  const visible = ALL_TABLES.filter(t => {

  const ok =
    activeFloor === "all"
      ? true
      : t.floor === activeFloor;

  if (filter === "used") return ok && usedIds.includes(t.id);
  if (filter === "empty") return ok && !usedIds.includes(t.id);

  return ok;
});

  const menuFoods =
    ALL_FOODS.filter(f => activeCat === "all" || f.cat === activeCat);

  return (
    <ProtectedRoute role="waiter">

      <div className="h-screen flex flex-col bg-slate-200 text-[13px] font-sans overflow-hidden">
        <WaiterHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selTable={selTable}
          setSelTable={setSelTable}
          soundOn={soundOn}
  setSoundOn={setSoundOn}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* PHÒNG BÀN */}
          {activeTab === "phonban" && (
            <>
              <div className="flex flex-col basis-[67%] bg-slate-200">
                {/* sub header */}
                <div className="bg-white border-b border-slate-200 px-4">
                  <div className="flex items-center gap-1 pt-2">
                    {FLOORS.map(f => (
                      <button
                        key={f.key}
                        onClick={() => setActiveFloor(f.key)}
                        className={`px-3 py-1 rounded-full text-sm
  ${activeFloor === f.key
                            ? "bg-blue-700 text-white font-bold"
                            : "text-slate-700"}
  `}
                      >
                        {f.label}
                      </button>
                    ))}
                    <div className="ml-auto flex items-center gap-3">
                      <Search size={16} className="text-slate-500 cursor-pointer" />
                    </div>
                  </div>

                  {/* filter */}
                  <div className="flex gap-5 py-2">
                    {[
                      { key: "all", label: `Tất cả (${ALL_TABLES.length + 2})` },
                      { key: "used", label: `Sử dụng (${usedIds.length})` },
                      { key: "empty", label: `Còn trống (${ALL_TABLES.length + 2 - usedIds.length})` }
                    ].map(s => (
                      <label key={s.key} className="flex items-center gap-1 cursor-pointer">

                        <input
                          type="radio"
                          checked={filter === s.key}
                          onChange={() => setFilter(s.key)}
                          className="accent-blue-600"
                        />

                        <span
                          className={filter === s.key
                            ? "text-blue-600 font-semibold"
                            : "text-slate-500"}
                        >
                          {s.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* table grid */}
                <div className="flex-1 overflow-y-auto p-3">
                  <div className="grid grid-cols-8 gap-2">
                    {visible.map(t => {
                      const tc = tOrders[t.id] || [];
                      return (

                        <TableCard
                          key={t.id}
                          table={t}
                          isSelected={selTable?.id === t.id}
                          isUsed={usedIds.includes(t.id) && selTable?.id !== t.id}
                          tTotal={tc.reduce((s, i) => s + i.price * i.qty, 0)}
                          tQty={tc.reduce((s, i) => s + i.qty, 0)}
                          tDishes={tc.length}
                          onClick={() => setSelTable(t)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <OrderPanel
                selTable={selTable}
                floorLabel={floorLabel}
                cart={cart}
                inc={inc}
                dec={dec}
                removeItem={removeItem}
                fmt={fmt}
                total={total}
                kitchenDone={kitchenDone}
                markKitchenDone={setKitchenDone}
              />
            </>
          )}

          {/* THỰC ĐƠN */}
          {activeTab === "thucdon" && (
            <>
              <div className="flex flex-col basis-[67%] bg-slate-50">
                {/* categories */}
                <div className="bg-white border-b border-slate-200 px-4 flex overflow-x-auto">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.key}
                      onClick={() => setActiveCat(c.key)}
                      className={`px-4 py-2 whitespace-nowrap
  border-b-2
  ${activeCat === c.key
                          ? "border-blue-700 text-blue-700 font-bold"
                          : "border-transparent text-slate-700"}
  `}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* food grid */}
                <div className="flex-1 overflow-y-auto p-3">
                  <div className="grid grid-cols-6 gap-3">
                    {menuFoods.map(f => {
                      const cartItem = cart.find(i => i.id === f.id);
                      return (
                        <FoodCard
                          key={f.id}
                          food={f}
                          onAdd={addFood}
                          cartQty={cartItem?.qty || 0}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <OrderPanel
                selTable={selTable}
                floorLabel={floorLabel}
                cart={cart}
                inc={inc}
                dec={dec}
                removeItem={removeItem}
                fmt={fmt}
                total={total}
                kitchenDone={kitchenDone}
                markKitchenDone={setKitchenDone}
              />
            </>
          )}
        </div>
        <WaiterFooter />
      </div>
    </ProtectedRoute>
  );
}