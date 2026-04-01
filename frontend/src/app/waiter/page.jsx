"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";

import ProtectedRoute from "@/services/protectedRoute";
import WaiterHeader from "../../components/waiter/WaiterHeader";
import OrderPanel from "../../components/waiter/OrderPanel";
import TableCard from "../../components/waiter/TableCard";
import FoodCard from "../../components/waiter/FoodCard";
import WaiterFooter from "../../components/waiter/WaiterFooter";
import { ScrollableTabs } from "../../components/waiter/Scrollabletabs";

import { getTableByArea } from "@/services/tableService";
import { getChildCategories } from "@/services/menuCategoryService";
import { getMenuItemsByChildCategory } from "@/services/menuItemService";
import {
  addItemToTable,
  sendItemsToKitchen,
  cancelItem,
  getOrderBill,
} from "@/services/orderService";
import { getAllAreas } from "@/services/areaService";
import { useSocket } from "@/context/SocketContext";

export default function WaiterPage() {
  const [activeTab, setActiveTab] = useState("phonban");
  const [selTable, setSelTable] = useState(null);
  const [activeAreaId, setActiveAreaId] = useState("all");
  const [filter, setFilter] = useState("all");
  const [activeCat, setActiveCat] = useState("all");
  const [soundOn, setSoundOn] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Khi gõ search → tự chuyển sang tab thực đơn
  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.trim()) setActiveTab("thucdon");
  };
  // Socket
  const { socket, isConnected } = useSocket();

  const [areas, setAreas] = useState([]);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const [tableCarts, setTableCarts] = useState({});
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

  // ─── Fetch tables ─────────────────────────────────────────────────────────
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

  // ─── Fetch categories ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getChildCategories();
        const raw = res.data ?? res;
        const list = Array.isArray(raw) ? raw : (raw.data ?? []);
        setCategories([{ _id: "all", categoryName: "Tất cả" }, ...list]);
      } catch (err) {
        console.error("Lỗi fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ─── Fetch menu items ─────────────────────────────────────────────────────
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

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("join_room", "waiter");
    }
  }, [socket, isConnected]);

  // ─── Refresh cart ─────────────────────────────────────────────────────────
  const refreshCart = useCallback(async (tableId, oId) => {
    if (!oId) return;
    try {
      const res = await getOrderBill(oId);
      if (res.success && res.data) {
        const sub = res.data.tables.find(
          (t) => t.table?._id === tableId || t.table === tableId,
        );
        if (sub) {
          const itemMap = {};
          sub.items.forEach((item) => {
            const key = item._id;
            if (itemMap[key]) {
              itemMap[key].qty += Number(item.quantity) || 0;
            } else {
              itemMap[key] = {
                id: item._id,
                itemId: item.itemId,
                name: item.itemName,
                price: Number(item.unitPrice) || 0,
                qty: Number(item.quantity) || 0,
                status: item.status,
              };
            }
          });
          const validItems = Object.values(itemMap).filter(
            (item) => item && item.id,
          );
          setTableCarts((prev) => ({ ...prev, [tableId]: validItems }));
        }
        setTables((prev) =>
          prev.map((t) =>
            t._id === tableId
              ? { ...t, subTotalAmount: sub?.subTotal ?? t.subTotalAmount }
              : t,
          ),
        );
      }
    } catch (err) {
      console.error("Lỗi refresh cart:", err);
    }
  }, []);

  // ─── Chọn bàn ─────────────────────────────────────────────────────────────
  const handleSelectTable = useCallback(
    (table) => {
      setSelTable(table);
      if (!tableCarts[table._id]) {
        setTableCarts((prev) => ({ ...prev, [table._id]: [] }));
      }
      if (table.orderId) {
        refreshCart(table._id, table.orderId);
      }
    },
    [tableCarts, refreshCart],
  );

  const cart = selTable ? tableCarts[selTable._id] || [] : [];
  const setCart = (newItems) => {
    if (!selTable) return;
    setTableCarts((prev) => ({
      ...prev,
      [selTable._id]: newItems.filter((i) => i && i.id),
    }));
  };
  const orderId = selTable?.orderId || null;

  // ─── Thêm món ─────────────────────────────────────────────────────────────
  const addFood = async (food) => {
    if (!selTable) {
      alert("Vui lòng chọn bàn trước!");
      return;
    }
    if (!orderId) {
      const ex = cart.find((i) => i.id === food._id);
      if (ex) {
        setCart(
          cart.map((i) => (i.id === food._id ? { ...i, qty: i.qty + 1 } : i)),
        );
      } else {
        setCart([
          ...cart,
          {
            id: food._id,
            itemId: null,
            name: food.itemName,
            price: food.price,
            qty: 1,
            status: "pending",
          },
        ]);
      }
      return;
    }
    try {
      const res = await addItemToTable(orderId, selTable._id, {
        menuItemId: food._id,
        quantity: 1,
      });
      if (res.success) await refreshCart(selTable._id, orderId);
    } catch (err) {
      console.error("Lỗi thêm món:", err);
    }
  };

  const inc = (id) =>
    setCart(cart.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (id) =>
    setCart(
      cart
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    );

  const removeItem = async (id) => {
    if (!orderId) {
      setCart(cart.filter((i) => i.id !== id));
      return;
    }
    const item = cart.find((i) => i.id === id);
    if (!item?.id) {
      setCart(cart.filter((i) => i.id !== id));
      return;
    }
    try {
      const res = await cancelItem(orderId, item.id);
      if (res.success) await refreshCart(selTable._id, orderId);
    } catch (err) {
      console.error("Lỗi hủy món:", err);
    }
  };

  const handleSendToKitchen = async () => {
    if (!orderId || !selTable) return;
    const pendingIds = cart
      .filter(
        (i) => (i.status === "pending" || i.status === "pre-order") && i.id,
      )
      .map((i) => i.id);
    if (!pendingIds.length) return;
    try {
      await sendItemsToKitchen(orderId, { itemIds: pendingIds });
      await refreshCart(selTable._id, orderId);
      // if (soundOn) {
      //   const a = new Audio("/sounds/ting.mp3");
      //   a.play();
      // }
    } catch (err) {
      console.error("Lỗi gửi bếp:", err);
    }
  };

  // ─── Filter món ăn theo search ───────────────────────────────────────────
  const filteredMenuItems = searchQuery.trim()
    ? menuItems.filter(
        (f) =>
          f.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : menuItems;

  const validCart = cart.filter(
    (i) => i?.id && i.qty > 0 && i.status !== "cancelled",
  );
  const total = validCart.reduce(
    (s, i) => s + Number(i.price ?? 0) * Number(i.qty ?? 0),
    0,
  );
  const fmt = (n) => Number(n ?? 0).toLocaleString("vi-VN");
  const floorLabel =
    areas.find((a) => a._id === selTable?.area?._id || a._id === selTable?.area)
      ?.areaName || "";

  const usedTableIds = tables
    .filter((t) => t.hasOrder || t.hasReservationOnly)
    .map((t) => t._id)
    .concat(
      Object.keys(tableCarts).filter((id) => (tableCarts[id]?.length || 0) > 0),
    )
    .filter((v, i, arr) => arr.indexOf(v) === i);

  const visibleTables = tables.filter((t) => {
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
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* ── PHÒNG BÀN ── */}
          {activeTab === "phonban" && (
            <>
              <div className="flex flex-col w-[67%] bg-slate-200">
                <div className="bg-white border-b border-slate-200 px-4">
                  {/* ── Area tabs với scroll + mũi tên ── */}
                  <ScrollableTabs className="pt-2 pb-1" scrollAmount={180}>
                    <button
                      onClick={() => setActiveAreaId("all")}
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-sm mr-1
                        ${
                          activeAreaId === "all"
                            ? "bg-blue-700 text-white font-bold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                    >
                      Tất cả
                    </button>
                    {areas.map((a) => (
                      <button
                        key={a._id}
                        onClick={() => setActiveAreaId(a._id)}
                        className={`flex-shrink-0 px-3 py-1 rounded-full text-sm mr-1
                          ${
                            activeAreaId === a._id
                              ? "bg-blue-700 text-white font-bold"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                      >
                        {a.areaName}
                      </button>
                    ))}
                    {/* khoảng trống cuối + icon search */}
                    <div className="flex-shrink-0 ml-2 flex items-center">
                      <Search
                        size={16}
                        className="text-slate-500 cursor-pointer"
                      />
                    </div>
                  </ScrollableTabs>

                  {/* ── Filter radio ── */}
                  <div className="flex gap-5 py-2">
                    {[
                      { key: "all", label: `Tất cả (${tables.length})` },
                      {
                        key: "used",
                        label: `Sử dụng (${usedTableIds.length})`,
                      },
                      {
                        key: "empty",
                        label: `Còn trống (${tables.length - usedTableIds.length})`,
                      },
                    ].map((s) => (
                      <label
                        key={s.key}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <input
                          type="radio"
                          checked={filter === s.key}
                          onChange={() => setFilter(s.key)}
                          className="accent-blue-600"
                        />
                        <span
                          className={
                            filter === s.key
                              ? "text-blue-600 font-semibold"
                              : "text-slate-500"
                          }
                        >
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
                      {visibleTables.map((t) => {
                        const tItems = tableCarts[t._id] || [];
                        const tTotal = t.orderId
                          ? t.subTotalAmount || 0
                          : tItems.reduce(
                              (s, i) =>
                                s + Number(i.price ?? 0) * Number(i.qty ?? 0),
                              0,
                            );
                        const tQty = tItems.reduce(
                          (s, i) => s + Number(i.qty ?? 0),
                          0,
                        );
                        return (
                          <TableCard
                            key={t._id}
                            table={t}
                            isSelected={selTable?._id === t._id}
                            isUsed={
                              usedTableIds.includes(t._id) &&
                              selTable?._id !== t._id
                            }
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

          {/* ── THỰC ĐƠN ── */}
          {activeTab === "thucdon" && (
            <>
              <div className="flex flex-col w-[67%] bg-slate-50">
                {/* ── Category tabs với scroll + mũi tên ── */}
                <div className="bg-white border-b border-slate-200 px-2">
                  <ScrollableTabs scrollAmount={200}>
                    {categories.map((c) => (
                      <button
                        key={c._id}
                        onClick={() => setActiveCat(c._id)}
                        className={`flex-shrink-0 px-4 py-2 whitespace-nowrap border-b-2 transition-colors
                          ${
                            activeCat === c._id
                              ? "border-blue-700 text-blue-700 font-bold"
                              : "border-transparent text-slate-700 hover:text-blue-600"
                          }`}
                      >
                        {c.categoryName}
                      </button>
                    ))}
                  </ScrollableTabs>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                  {loadingMenu ? (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      Đang tải thực đơn...
                    </div>
                  ) : filteredMenuItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                      <Search size={32} className="opacity-30" />
                      <p className="text-sm">
                        Không tìm thấy món{" "}
                        <span className="font-semibold text-slate-600">
                          {`"${searchQuery}"`}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <>
                      {searchQuery.trim() && (
                        <p className="text-xs text-slate-400 mb-2 px-1">
                          Tìm thấy{" "}
                          <span className="font-semibold text-blue-600">
                            {filteredMenuItems.length}
                          </span>{" "}
                          món cho &quot;{searchQuery}&quot;
                        </p>
                      )}
                      <div className="grid grid-cols-6 gap-3">
                        {filteredMenuItems.map((f) => {
                          const cartItem = cart.find((i) => i.id === f._id);
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
                    </>
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
