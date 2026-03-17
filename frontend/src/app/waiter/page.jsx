"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import WaiterHeader from "./components/WaiterHeader";
import OrderPanel from "./components/OrderPanel";
import TableCard from "./components/TableCard";
import FoodCard from "./components/FoodCard";
import WaiterFooter from "./components/WaiterFooter";

import { getTableByArea } from "@/services/tableService";
import { getChildCategories } from "@/services/menuCategoryService";
import { getMenuItemsByChildCategory } from "@/services/menuItemService";
import { addItemToTable, sendItemsToKitchen, cancelItem, getOrderBill } from "@/services/orderService";
import { getAllAreas } from "@/services/areaService";

export default function WaiterPage() {
  const [activeTab, setActiveTab] = useState("phonban");
  const [selTable, setSelTable] = useState(null);
  const [activeAreaId, setActiveAreaId] = useState("all");
  const [filter, setFilter] = useState("all");
  const [activeCat, setActiveCat] = useState("all");
  const [soundOn, setSoundOn] = useState(true);

  // API data
  const [areas, setAreas] = useState([]);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(false);

  // Cart state: { [tableId]: item[] }
  // item: { id, itemId, name, price, qty, status }
  const [tableCarts, setTableCarts] = useState({});

  // Kitchen done items (itemId[])
  const [kitchenDone, setKitchenDone] = useState([]);

  // ─── Fetch areas ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await getAllAreas();
        setAreas(res.data || []);
      } catch (err) {
        console.error("Lỗi fetch areas:", err);
      }
    };
    fetchAreas();
  }, []);

  // ─── Fetch tables theo khu vực ───────────────────────────────────────────
  const fetchTables = useCallback(async () => {
    setLoadingTables(true);
    try {
      const params = activeAreaId !== "all" ? { area: activeAreaId } : {};
      const res = await getTableByArea(params);
      setTables(res.data || []);
    } catch (err) {
      console.error("Lỗi fetch tables:", err);
    } finally {
      setLoadingTables(false);
    }
  }, [activeAreaId]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // ─── Fetch categories con ────────────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getChildCategories();
        const raw = res.data ?? res;
        const list = Array.isArray(raw) ? raw : (raw.data ?? []);
        const all = { _id: "all", categoryName: "Tất cả" };
        setCategories([all, ...list]);
      } catch (err) {
        console.error("Lỗi fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ─── Fetch menu items theo category ─────────────────────────────────────
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoadingMenu(true);
      try {
        const params = activeCat !== "all" ? { category: activeCat } : {};
        const res = await getMenuItemsByChildCategory(params);
        setMenuItems(res.data || []);
      } catch (err) {
        console.error("Lỗi fetch menu items:", err);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenuItems();
  }, [activeCat]);

  // ─── Refresh cart từ getOrderBill ───────────────────────────────────────
  const refreshCart = useCallback(async (tableId, oId) => {
    if (!oId) return;
    try {
      const res = await getOrderBill(oId);
      if (res.success && res.data) {
        const sub = res.data.tables.find(
          t => t.table?._id === tableId || t.table === tableId
        );
        if (sub) {
          // ✅ Gộp items cùng _id để tránh duplicate
          const itemMap = {};
          sub.items.forEach(item => {
            const key = item._id;  // ✅ Dùng _id từ API
            if (itemMap[key]) {
              itemMap[key].qty += Number(item.quantity) || 0;
            } else {
              itemMap[key] = {
                id: item._id,              // ✅ _id từ API
                itemId: item.itemId,       // Menu item ID
                name: item.itemName,       // ✅ Snapshot tên
                price: Number(item.unitPrice) || 0,  // ✅ Snapshot giá
                qty: Number(item.quantity) || 0,
                status: item.status,
              };
            }
          });

          // ✅ Filter items hợp lệ
          const validItems = Object.values(itemMap).filter(item => item && item.id);

          setTableCarts(prev => ({
            ...prev,
            [tableId]: validItems,
          }));
        }
        // Cập nhật lại subTotalAmount trên table
        setTables(prev => prev.map(t =>
          t._id === tableId
            ? { ...t, subTotalAmount: sub?.subTotal ?? t.subTotalAmount }
            : t
        ));
      }
    } catch (err) {
      console.error("Lỗi refresh cart:", err);
    }
  }, []);

  // ─── Khi chọn bàn ────────────────────────────────────────────────────────
  const handleSelectTable = useCallback((table) => {
    setSelTable(table);
    if (!tableCarts[table._id]) {
      setTableCarts(prev => ({ ...prev, [table._id]: [] }));
    }
    if (table.orderId) {
      refreshCart(table._id, table.orderId);
    }
  }, [tableCarts, refreshCart]);

  // ─── Cart helpers ────────────────────────────────────────────────────────
  const cart = selTable ? (tableCarts[selTable._id] || []) : [];

  const setCart = (newItems) => {
    if (!selTable) return;
    const validItems = newItems.filter(item => item && item.id);
    setTableCarts(prev => ({ ...prev, [selTable._id]: validItems }));
  };

  // orderId lấy trực tiếp từ selTable
  const orderId = selTable?.orderId || null;

  // ─── Thêm món → gọi API addItemToTable ──────────────────────────────────
  const addFood = async (food) => {
    if (!selTable) {
      alert("Vui lòng chọn bàn trước!");
      return;
    }
    if (!orderId) {
      // Bàn chưa có order → add local cart
      const ex = cart.find(i => i.id === food._id);
      if (ex) {
        setCart(cart.map(i => i.id === food._id ? { ...i, qty: i.qty + 1 } : i));
      } else {
        setCart([...cart, {
          id: food._id,
          itemId: null,
          name: food.itemName,
          price: food.price,
          qty: 1,
          status: "pending",
        }]);
      }
      return;
    }
    try {
      const res = await addItemToTable(orderId, selTable._id, {
        menuItemId: food._id,
        quantity: 1,
      });
      if (res.success) {
        await refreshCart(selTable._id, orderId);
      }
    } catch (err) {
      console.error("Lỗi thêm món:", err);
    }
  };

  // ─── Tăng/giảm (local only) ──────────────────────────────────────────────
  const inc = (id) => setCart(cart.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  const dec = (id) => setCart(
    cart.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0)
  );

  // ─── Hủy món → gọi API cancelItem ───────────────────────────────────────
  const removeItem = async (id) => {
    if (!orderId) {
      setCart(cart.filter(i => i.id !== id));
      return;
    }
    const item = cart.find(i => i.id === id);
    if (!item?.id) {
      setCart(cart.filter(i => i.id !== id));
      return;
    }
    try {
      const res = await cancelItem(orderId, item.id);
      if (res.success) {
        await refreshCart(selTable._id, orderId);
      }
    } catch (err) {
      console.error("Lỗi hủy món:", err);
    }
  };

  // ─── Gửi bếp → gọi API sendItemsToKitchen ───────────────────────────────
  const handleSendToKitchen = async () => {
    if (!orderId || !selTable) return;
    const pendingIds = cart
      .filter(i => i.status === "pending" && i.id)
      .map(i => i.id);
    if (pendingIds.length === 0) return;
    try {
      await sendItemsToKitchen(orderId, { itemIds: pendingIds });

      // ✅ Refresh cart sau khi gửi bếp để lấy status mới
      await refreshCart(selTable._id, orderId);

      if (soundOn) {
        const audio = new Audio("/sounds/ting.mp3");
        audio.play();
      }
    } catch (err) {
      console.error("Lỗi gửi bếp:", err);
    }
  };

  // ─── Computed ─────────────────────────────────────────────────────────────
  // Tính total từ validCart (items đã filter)
  const validCart = cart.filter(item =>
    item?.id && item.qty > 0 && item.status !== "cancelled"
  );

  const total = validCart.reduce(
    (s, i) => s + Number(i.price ?? 0) * Number(i.qty ?? 0),
    0
  );
  const fmt = n => Number(n ?? 0).toLocaleString("vi-VN");
  const floorLabel = areas.find(
    a => a._id === selTable?.area?._id || a._id === selTable?.area
  )?.areaName || "";

  // Bàn "đang dùng" = có orderId từ API hoặc có cart local
  const usedTableIds = tables
    .filter(t => t.orderId)
    .map(t => t._id)
    .concat(
      Object.keys(tableCarts).filter(id => (tableCarts[id]?.length || 0) > 0)
    )
    .filter((v, i, arr) => arr.indexOf(v) === i);

  const visibleTables = tables.filter(t => {
    const isUsed = usedTableIds.includes(t._id);
    if (filter === "used") return isUsed;
    if (filter === "empty") return !isUsed;
    return true;
  });

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
                <div className="bg-white border-b border-slate-200 px-4">
                  <div className="flex items-center gap-1 pt-2">
                    <button
                      onClick={() => setActiveAreaId("all")}
                      className={`px-3 py-1 rounded-full text-sm
                        ${activeAreaId === "all"
                          ? "bg-blue-700 text-white font-bold"
                          : "text-slate-700"}`}
                    >
                      Tất cả
                    </button>
                    {areas.map(a => (
                      <button
                        key={a._id}
                        onClick={() => setActiveAreaId(a._id)}
                        className={`px-3 py-1 rounded-full text-sm
                          ${activeAreaId === a._id
                            ? "bg-blue-700 text-white font-bold"
                            : "text-slate-700"}`}
                      >
                        {a.areaName}
                      </button>
                    ))}
                    <div className="ml-auto flex items-center gap-3">
                      <Search size={16} className="text-slate-500 cursor-pointer" />
                    </div>
                  </div>

                  <div className="flex gap-5 py-2">
                    {[
                      { key: "all", label: `Tất cả (${tables.length})` },
                      { key: "used", label: `Sử dụng (${usedTableIds.length})` },
                      { key: "empty", label: `Còn trống (${tables.length - usedTableIds.length})` },
                    ].map(s => (
                      <label key={s.key} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          checked={filter === s.key}
                          onChange={() => setFilter(s.key)}
                          className="accent-blue-600"
                        />
                        <span className={filter === s.key ? "text-blue-600 font-semibold" : "text-slate-500"}>
                          {s.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                  {loadingTables ? (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      Đang tải bàn...
                    </div>
                  ) : (
                    <div className="grid grid-cols-8 gap-2">
                      {visibleTables.map(t => {
                        const tItems = tableCarts[t._id] || [];
                        const tTotal = t.orderId
                          ? (t.subTotalAmount || 0)
                          : tItems.reduce((s, i) => s + Number(i.price ?? 0) * Number(i.qty ?? 0), 0);
                        const tQty = tItems.reduce((s, i) => s + Number(i.qty ?? 0), 0);
                        return (
                          <TableCard
                            key={t._id}
                            table={t}
                            isSelected={selTable?._id === t._id}
                            isUsed={usedTableIds.includes(t._id) && selTable?._id !== t._id}
                            tTotal={tTotal}
                            tQty={tQty}
                            tDishes={tItems.length}
                            onClick={() => handleSelectTable(t)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <OrderPanel
                selTable={selTable}
                floorLabel={floorLabel}
                cart={cart}
                orderId={orderId}
                inc={inc}
                dec={dec}
                removeItem={removeItem}
                fmt={fmt}
                total={total}
                kitchenDone={kitchenDone}
                markKitchenDone={setKitchenDone}
                onSendToKitchen={handleSendToKitchen}
                onRefreshCart={() => refreshCart(selTable?._id, orderId)}
              />
            </>
          )}

          {/* THỰC ĐƠN */}
          {activeTab === "thucdon" && (
            <>
              <div className="flex flex-col basis-[67%] bg-slate-50">
                <div className="bg-white border-b border-slate-200 px-4 flex overflow-x-auto">
                  {categories.map(c => (
                    <button
                      key={c._id}
                      onClick={() => setActiveCat(c._id)}
                      className={`px-4 py-2 whitespace-nowrap border-b-2
                        ${activeCat === c._id
                          ? "border-blue-700 text-blue-700 font-bold"
                          : "border-transparent text-slate-700"}`}
                    >
                      {c.categoryName}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                  {loadingMenu ? (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      Đang tải thực đơn...
                    </div>
                  ) : (
                    <div className="grid grid-cols-6 gap-3">
                      {menuItems.map(f => {
                        const cartItem = cart.find(i => i.id === f._id);
                        return (
                          <FoodCard
                            key={f._id}
                            food={f}
                            onAdd={addFood}
                            cartQty={cartItem?.qty || 0}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <OrderPanel
                selTable={selTable}
                floorLabel={floorLabel}
                cart={cart}
                orderId={orderId}
                inc={inc}
                dec={dec}
                removeItem={removeItem}
                fmt={fmt}
                total={total}
                kitchenDone={kitchenDone}
                markKitchenDone={setKitchenDone}
                onSendToKitchen={handleSendToKitchen}
                onRefreshCart={() => refreshCart(selTable?._id, orderId)}
              />
            </>
          )}
        </div>
        <WaiterFooter />
      </div>
    </ProtectedRoute>
  );
}