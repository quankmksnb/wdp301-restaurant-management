"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import WaiterHeader from "./components/WaiterHeader";
import OrderPanel from "./components/OrderPanel";
import TableCard from "./components/TableCard";
import FoodCard from "./components/FoodCard";
import WaiterFooter from "./components/WaiterFooter";

import { getAllAreas } from "../../services/areaService";
import { getTablesByArea } from "../../services/tableService";
import { getChildCategories } from "../../services/menuCategoryService";
import { getMenuItemsByChildCategory } from "../../services/menuItemService";
import { orderItems, getCurrentOrderByTable, sendToKitchen, cancelOrderItem, updateOrderItemQuantity } from "../../services/orderService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function WaiterPage() {
  const [activeTab, setActiveTab] = useState("phonban");
  const [selTable, setSelTable] = useState(null);
  const [tOrders, setTOrders] = useState({});
  const [activeFloor, setActiveFloor] = useState(null);
  const [filter, setFilter] = useState("all");
  const [activeCat, setActiveCat] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [searchFood, setSearchFood] = useState("");

  const [areas, setAreas] = useState([]);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);

  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingFoods, setLoadingFoods] = useState(false);

  // Fetch areas
  useEffect(() => {
    getAllAreas()
      .then((res) => setAreas(res.data || []))
      .catch(console.error);
  }, []);

  // Fetch categories
  useEffect(() => {
    getChildCategories()
      .then((res) => setCategories(res.data || []))
      .catch(console.error);
  }, []);

  // Fetch tables khi đổi floor
  useEffect(() => {
    setLoadingTables(true);
    getTablesByArea(activeFloor)
      .then((data) => setTables(data || []))
      .catch(console.error)
      .finally(() => setLoadingTables(false));
  }, [activeFloor]);

  // Fetch foods khi đổi category hoặc search
  useEffect(() => {
    setLoadingFoods(true);
    getMenuItemsByChildCategory({ category: activeCat, search: searchFood })
      .then((data) => setFoods(data || []))
      .catch(console.error)
      .finally(() => setLoadingFoods(false));
  }, [activeCat, searchFood]);

  // Chọn bàn → load order hiện tại
  // getCurrentOrderByTable trả về res.data.data trực tiếp
  const handleSelectTable = async (table) => {
    setSelTable(table);
    if (tOrders[table._id] !== undefined) return;
    try {
      const data = await getCurrentOrderByTable(table._id);
      setTOrders((prev) => ({
        ...prev,
        [table._id]: {
          orderId: data.orderId || null,
          totalAmount: data.totalAmount || 0,
          items: (data.items || []).filter(
            (i) => i.orderItemStatus !== "cancelled"
          ),
        },
      }));
    } catch (err) {
      console.error(err);
      setTOrders((prev) => ({
        ...prev,
        [table._id]: { orderId: null, totalAmount: 0, items: [] },
      }));
    }
  };

  // Helpers
  const orderData = selTable ? tOrders[selTable._id] : null;
  const cart = orderData?.items || [];
  const orderId = orderData?.orderId || null;

  const setOrderData = (updater) => {
    if (!selTable) return;
    setTOrders((prev) => ({
      ...prev,
      [selTable._id]:
        typeof updater === "function"
          ? updater(prev[selTable._id])
          : updater,
    }));
  };

  // Thêm món → gọi orderItems ngay
  // orderItems trả về res.data.data trực tiếp
  const addFood = async (food) => {
    if (!selTable) {
      alert("Vui lòng chọn bàn trước!");
      return;
    }
    try {
      const data = await orderItems({
        tableId: selTable._id,
        items: [{ menuItem: food._id, quantity: 1 }],
      });
      setOrderData({
        orderId: data.orderId,
        totalAmount: data.totalAmount,
        items: data.items.filter((i) => i.orderItemStatus !== "cancelled"),
      });
    } catch (err) {
      alert(err?.response?.data?.message || "Không thể thêm món!");
    }
  };

  // Tăng qty
  const inc = async (orderItemId) => {
    const item = cart.find((i) => i._id === orderItemId);
    if (!item || item.orderItemStatus === "preparing") return;
    try {
      const data = await updateOrderItemQuantity({
        orderId,
        itemId: orderItemId,
        quantity: item.quantity + 1,
      });
      setOrderData({
        orderId: data.orderId,
        totalAmount: data.totalAmount,
        items: data.items.filter((i) => i.orderItemStatus !== "cancelled"),
      });
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi!");
    }
  };

  // Giảm qty → nếu quantity = 1 thì cancel luôn
  const dec = async (orderItemId) => {
    const item = cart.find((i) => i._id === orderItemId);
    if (!item || item.orderItemStatus === "preparing") return;

    // Nếu đang là 1 → cancel
    if (item.quantity === 1) {
      try {
        const res = await cancelOrderItem({ orderId, itemId: orderItemId });
        setOrderData({
          orderId: res.data._id,
          totalAmount: res.data.totalAmount,
          items: res.data.items.filter((i) => i.orderItemStatus !== "cancelled"),
        });
      } catch (err) {
        alert(err?.response?.data?.message || "Không thể hủy món!");
      }
      return;
    }

    // Nếu > 1 → giảm quantity
    try {
      const data = await updateOrderItemQuantity({
        orderId,
        itemId: orderItemId,
        quantity: item.quantity - 1,
      });
      setOrderData({
        orderId: data.orderId,
        totalAmount: data.totalAmount,
        items: data.items.filter((i) => i.orderItemStatus !== "cancelled"),
      });
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi!");
    }
  };

  const removeItem = (orderItemId) => dec(orderItemId);

  // Thông báo bếp
  // sendToKitchen trả về res.data (không có .data lồng thêm)
  const handleSendToKitchen = async () => {
    if (!orderId) {
      alert("Chưa có order!");
      return;
    }
    try {
      await sendToKitchen(orderId); // service tự wrap { orderId }
      setOrderData((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.orderItemStatus === "pending"
            ? { ...i, orderItemStatus: "preparing" }
            : i
        ),
      }));
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi gửi bếp!");
    }
  };

  const total = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  const usedIds = Object.keys(tOrders).filter(
    (id) => (tOrders[id]?.items?.length || 0) > 0
  );

  const fmt = (n) => n.toLocaleString("vi-VN");

  const floorLabel =
    areas.find((a) => a._id === activeFloor)?.areaName || "Tất cả";

  const visibleTables = tables.filter((t) => {
    if (filter === "used") return usedIds.includes(t._id);
    if (filter === "empty") return !usedIds.includes(t._id);
    return true;
  });

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return "/placeholder.jpg";
    const img = images[0];
    return img.startsWith("http") ? img : `${BASE_URL}${img}`;
  };

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
          searchFood={searchFood}
          setSearchFood={setSearchFood}
        />

        <div className="flex flex-1 overflow-hidden">

          {/* PHÒNG BÀN */}
          {activeTab === "phonban" && (
            <>
              <div className="flex flex-col basis-[67%] bg-slate-200">
                <div className="bg-white border-b border-slate-200 px-4">
                  <div className="flex items-center gap-1 pt-2">
                    <button
                      onClick={() => setActiveFloor(null)}
                      className={`px-3 py-1 rounded-full text-sm
                        ${activeFloor === null
                          ? "bg-blue-700 text-white font-bold"
                          : "text-slate-700"}`}
                    >
                      Tất cả
                    </button>
                    {areas.map((a) => (
                      <button
                        key={a._id}
                        onClick={() => setActiveFloor(a._id)}
                        className={`px-3 py-1 rounded-full text-sm
                          ${activeFloor === a._id
                            ? "bg-blue-700 text-white font-bold"
                            : "text-slate-700"}`}
                      >
                        {a.areaName}
                      </button>
                    ))}
                    <div className="ml-auto">
                      <Search size={16} className="text-slate-500 cursor-pointer" />
                    </div>
                  </div>

                  <div className="flex gap-5 py-2">
                    {[
                      { key: "all", label: `Tất cả (${tables.length})` },
                      { key: "used", label: `Sử dụng (${usedIds.length})` },
                      { key: "empty", label: `Còn trống (${tables.length - usedIds.length})` },
                    ].map((s) => (
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
                      Đang tải...
                    </div>
                  ) : (
                    <div className="grid grid-cols-8 gap-2">
                      {visibleTables.map((t) => {
                        const td = tOrders[t._id];
                        const tc = td?.items || [];
                        return (
                          <TableCard
                            key={t._id}
                            table={{ ...t, name: t.tableName }}
                            isSelected={selTable?._id === t._id}
                            isUsed={usedIds.includes(t._id) && selTable?._id !== t._id}
                            tTotal={td?.totalAmount || 0}
                            tQty={tc.reduce((s, i) => s + i.quantity, 0)}
                            tDishes={tc.length}
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
                inc={inc}
                dec={dec}
                removeItem={removeItem}
                fmt={fmt}
                total={total}
                onSendToKitchen={handleSendToKitchen}
              />
            </>
          )}

          {/* THỰC ĐƠN */}
          {activeTab === "thucdon" && (
            <>
              <div className="flex flex-col basis-[67%] bg-slate-50">
                <div className="bg-white border-b border-slate-200 px-4 flex overflow-x-auto">
                  <button
                    onClick={() => setActiveCat(null)}
                    className={`px-4 py-2 whitespace-nowrap border-b-2
                      ${activeCat === null
                        ? "border-blue-700 text-blue-700 font-bold"
                        : "border-transparent text-slate-700"}`}
                  >
                    Tất cả
                  </button>
                  {categories.map((c) => (
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
                  {loadingFoods ? (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      Đang tải...
                    </div>
                  ) : (
                    <div className="grid grid-cols-6 gap-3">
                      {foods.map((f) => {
                        const cartItem = cart.find((i) => i.menuItem === f._id);
                        return (
                          <FoodCard
                            key={f._id}
                            food={{
                              ...f,
                              name: f.itemName,
                              img: getImageUrl(f.images),
                            }}
                            onAdd={addFood}
                            cartQty={cartItem?.quantity || 0}
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
                inc={inc}
                dec={dec}
                removeItem={removeItem}
                fmt={fmt}
                total={total}
                onSendToKitchen={handleSendToKitchen}
              />
            </>
          )}
        </div>

        <WaiterFooter />
      </div>
    </ProtectedRoute>
  );
}