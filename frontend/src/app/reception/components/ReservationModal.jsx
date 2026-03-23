"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Modal,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Checkbox,
  Tabs,
  Tag,
  Empty,
  Spin,
  message,
} from "antd";
import { Plus, Pencil, Minus, ShoppingCart } from "lucide-react";
import {
  createReservation,
  createReservationWithOrder,
  getAvailableTables,
  updateReservation,
  getOrderByReservation
} from "@/services/reservationService";
import { getAllMenuItems } from "@/services/menuItemService";
import dayjs from "dayjs";

// ─── Modal danh sách bàn trống ───
function AvailableTablesModal({ open, onClose, onSelect, alreadySelected, dateTime }) {
  const [loading, setLoading] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null); // null = all
  const [tempSelected, setTempSelected] = useState([]);

  // Lấy danh sách bàn trống khi mở modal
  useEffect(() => {
    if (open && dateTime) {
      setLoading(true);
      setTempSelected([...alreadySelected]);
      getAvailableTables(dateTime.toISOString())
        .then((res) => {
          setAvailableTables(res.data || []);
        })
        .catch(() => {
          message.error("Không thể tải danh sách bàn trống");
        })
        .finally(() => setLoading(false));
    }
  }, [open, alreadySelected, dateTime]);

  // Lấy danh sách khu vực duy nhất
  const areas = useMemo(() => {
    const areaMap = new Map();
    availableTables.forEach((table) => {
      const area = table.area;
      if (area && !areaMap.has(area._id)) {
        areaMap.set(area._id, area);
      }
    });
    return Array.from(areaMap.values());
  }, [availableTables]);

  // Lọc bàn theo khu vực đã chọn
  const filteredTables = useMemo(() => {
    if (!selectedArea) return availableTables;
    return availableTables.filter(
      (t) => (t.area?._id || t.area) === selectedArea
    );
  }, [availableTables, selectedArea]);

  const toggleTable = (tableId) => {
    setTempSelected((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId]
    );
  };

  const handleConfirm = () => {
    onSelect(tempSelected);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      title={
        <span className="text-base font-bold">Danh sách phòng/bàn trống</span>
      }
      destroyOnHidden
      centered
    >
      {!dateTime ? (
        <div className="py-6 text-center text-sm text-orange-500">
          Vui lòng chọn giờ đến trước khi xem bàn trống.
        </div>
      ) : loading ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : (
        <div className="pt-2">
          {/* Tabs khu vực */}
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={() => setSelectedArea(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${selectedArea === null
                ? "bg-[#1e3a5f] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              Tất cả
            </button>
            {areas.map((area) => (
              <button
                key={area._id}
                onClick={() => setSelectedArea(area._id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${selectedArea === area._id
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {area.areaName}
              </button>
            ))}
          </div>

          {/* Chip chọn bàn */}
          {filteredTables.length === 0 ? (
            <Empty description="Không có bàn trống" />
          ) : (
            <div className="flex flex-wrap gap-2 mb-6">
              {filteredTables.map((table) => {
                const isSelected = tempSelected.includes(table._id);
                return (
                  <button
                    key={table._id}
                    onClick={() => toggleTable(table._id)}
                    className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-all border ${isSelected
                      ? "bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                      }`}
                  >
                    {table.tableName} {table.capacity ? `(${table.capacity} ghế)` : ""}
                  </button>
                );
              })}
            </div>
          )}

          {/* Nút hành động */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="primary"
              onClick={handleConfirm}
              className="flex items-center gap-1 px-6"
              style={{ backgroundColor: "#1e3a5f" }}
            >
              ☑ Chọn
            </Button>
            <Button
              onClick={onClose}
              className="flex items-center gap-1 px-6"
            >
              ⊘ Bỏ qua
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Thẻ món ăn ───
function MenuItemCard({ item, quantity, onAdd, onRemove }) {
  const imageUrl = item.images?.[0]
    ? `http://localhost:5000${item.images[0]}`
    : null;

  return (
    <div className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors">
      {/* Ảnh món ăn */}
      <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.itemName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span className="text-gray-300 text-lg">🍽️</span>
        )}
      </div>

      {/* Thông tin */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{item.itemName}</div>
        <div className="text-xs text-blue-600 font-medium">
          {item.price?.toLocaleString("vi-VN")}đ
        </div>
      </div>

      {/* Điều khiển số lượng */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {quantity > 0 ? (
          <>
            <button
              onClick={() => onRemove(item._id)}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              onClick={() => onAdd(item._id)}
              className="w-6 h-6 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onAdd(item._id)}
            className="w-6 h-6 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-500 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Phần đặt món trước ───
function PreOrderSection({
  menuItems,
  menuLoading,
  selectedItems,
  onItemAdd,
  onItemRemove,
  sameOrderMode,
  onSameOrderModeChange,
  selectedTables,
  tableOptions,
  separateOrders,
  onSeparateItemAdd,
  onSeparateItemRemove,
}) {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Lấy danh mục duy nhất
  const categories = useMemo(() => {
    const cats = [];
    const seen = new Set();
    menuItems.forEach((item) => {
      const cat = item.category;
      if (cat && !seen.has(cat._id)) {
        seen.add(cat._id);
        cats.push(cat);
      }
    });
    return cats;
  }, [menuItems]);

  // Lọc danh sách món ăn
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (item.availabilityStatus !== "available") return false;
      if (
        searchText &&
        !item.itemName.toLowerCase().includes(searchText.toLowerCase())
      )
        return false;
      if (selectedCategory && item.category?._id !== selectedCategory)
        return false;
      return true;
    });
  }, [menuItems, searchText, selectedCategory]);

  // Tính tổng số món đã chọn
  const totalSelected = useMemo(() => {
    if (sameOrderMode) {
      return Object.values(selectedItems).reduce((s, q) => s + q, 0);
    }
    return Object.values(separateOrders).reduce((tableAcc, tableItems) => {
      return (
        tableAcc + Object.values(tableItems).reduce((s, q) => s + q, 0)
      );
    }, 0);
  }, [sameOrderMode, selectedItems, separateOrders]);

  if (menuLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spin size="small" />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">Đặt món trước</span>
          {totalSelected > 0 && (
            <Tag color="blue" className="ml-1">
              {totalSelected} món
            </Tag>
          )}
        </div>
      </div>

      {/* Checkbox gọi cùng món */}
      {selectedTables.length > 1 && (
        <div className="mb-3 px-1">
          <Checkbox
            checked={sameOrderMode}
            onChange={(e) => onSameOrderModeChange(e.target.checked)}
          >
            <span className="text-sm">
              Gọi cùng món cho tất cả bàn
            </span>
          </Checkbox>
        </div>
      )}

      {/* Tìm kiếm và lọc danh mục */}
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Tìm món..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1"
          size="small"
          allowClear
        />
        <Select
          placeholder="Danh mục"
          value={selectedCategory}
          onChange={(val) => setSelectedCategory(val)}
          allowClear
          size="small"
          className="w-36"
          options={categories.map((c) => ({
            label: c.categoryName,
            value: c._id,
          }))}
        />
      </div>

      {/* Danh sách món - chế độ CÙNG MÓN */}
      {sameOrderMode ? (
        <div className="max-h-48 overflow-y-auto space-y-1">
          {filteredItems.length === 0 ? (
            <Empty description="Không tìm thấy món" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            filteredItems.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                quantity={selectedItems[item._id] || 0}
                onAdd={onItemAdd}
                onRemove={onItemRemove}
              />
            ))
          )}
        </div>
      ) : (
        /* Danh sách món - chế độ RIÊNG TỪNG BÀN */
        <Tabs
          size="small"
          items={selectedTables.map((tableId) => {
            const tableLabel =
              tableOptions.find((o) => o.value === tableId)?.label || tableId;
            const tableItems = separateOrders[tableId] || {};
            const tableCount = Object.values(tableItems).reduce(
              (s, q) => s + q,
              0
            );

            return {
              key: tableId,
              label: (
                <span>
                  {tableLabel}
                  {tableCount > 0 && (
                    <Tag color="blue" className="ml-1" size="small">
                      {tableCount}
                    </Tag>
                  )}
                </span>
              ),
              children: (
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredItems.length === 0 ? (
                    <Empty
                      description="Không tìm thấy món"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ) : (
                    filteredItems.map((item) => (
                      <MenuItemCard
                        key={item._id}
                        item={item}
                        quantity={tableItems[item._id] || 0}
                        onAdd={(id) => onSeparateItemAdd(tableId, id)}
                        onRemove={(id) => onSeparateItemRemove(tableId, id)}
                      />
                    ))
                  )}
                </div>
              ),
            };
          })}
        />
      )}
    </div>
  );
}

// ─── Modal chính ───
export default function ReservationModal({
  open,
  onClose,
  prefilledTable,
  prefilledHour,
  tables,
  areas,
  selectedDate,
  onReservationCreated,
  editingReservation
}) {
  const [saving, setSaving] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [showPreOrder, setShowPreOrder] = useState(false);

  // Trạng thái form
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    numberOfGuests: 1,
    duration: 0.5,
    durationUnit: "Giờ",
    note: "",
  });

  const [selectedTables, setSelectedTables] = useState([]);
  const [arrivalTime, setArrivalTime] = useState(null);

  // Trạng thái đặt món trước
  const [sameOrderMode, setSameOrderMode] = useState(true);
  const [selectedItems, setSelectedItems] = useState({}); // { menuItemId: quantity } (same mode)
  const [separateOrders, setSeparateOrders] = useState({}); // { tableId: { menuItemId: quantity } } (separate mode)
  const [showAvailableTables, setShowAvailableTables] = useState(false);

  // Tính tổng số ghế tối đa của các bàn đã chọn
  const maxGuests = useMemo(() => {
    if (selectedTables.length === 0) return 100; // Chưa chọn bàn thì không giới hạn
    return (tables || [])
      .filter((t) => selectedTables.includes(t._id))
      .reduce((sum, t) => sum + (t.capacity || 0), 0);
  }, [selectedTables, tables]);

  // Tạo danh sách bàn nhóm theo khu vực
  const tableOptions = useMemo(() => {
    return (areas || []).flatMap((area) => {
      const areaTables = (tables || []).filter(
        (t) => (t.area?._id || t.area) === area._id
      );
      return areaTables.map((t) => ({
        label: `${t.tableName}${t.capacity ? ` (${t.capacity} ghế)` : ''} - ${area.areaName}`,
        value: t._id,
      }));
    });
  }, [tables, areas]);

  // Khởi tạo / reset trạng thái 
  useEffect(() => {
    if (!open) return;

    if (editingReservation) {
      setFormData({
        customerName: editingReservation.customer?.customer || editingReservation.customerName || "",
        phone: editingReservation.customer?.phone || editingReservation.phone || "",
        numberOfGuests: editingReservation.numberOfGuests || 1,
        duration: 0.5,
        durationUnit: "Giờ",
        note: editingReservation.note || "",
      });
      // Xử lý bàn, có thể là Object hoặc string
      setSelectedTables(editingReservation.tables?.map((table) => table._id || table) || []);

      const arrival = dayjs(editingReservation.reservationDateTime || editingReservation.startTime);
      setArrivalTime(arrival);

      // Tải thông tin gọi món
      getOrderByReservation(editingReservation._id || editingReservation.reservationId)
        .then((res) => {
          if (res.success && res.data) {
            const order = res.data;
            let hasItems = false;
            let sameMode = true;
            const selItems = {};
            const sepOrders = {};

            // Cần phân tích subOrders để xác định chế độ cùng món/riêng món
            // và điền dữ liệu vào state.
            const subOrders = order.subOrders || [];
            if (subOrders.length > 0) {
              // Kiểm tra đơn giản nhất: nếu chỉ có 1 bàn, hoặc nhiều bàn
              // đặt chế độ riêng món nếu có nhiều bàn để an toàn hơn.
              if (subOrders.length > 1) {
                sameMode = false;
              }

              subOrders.forEach(sub => {
                if (sub.items && sub.items.length > 0) {
                  hasItems = true;
                  const tblId = sub.table._id || sub.table;
                  sepOrders[tblId] = {};
                  sub.items.forEach(item => {
                    const itemId = item.menuItem._id || item.menuItem;
                    if (sameMode) {
                      selItems[itemId] = (selItems[itemId] || 0) + item.quantity;
                    }
                    sepOrders[tblId][itemId] = (sepOrders[tblId][itemId] || 0) + item.quantity;
                  });
                }
              });
            }

            if (hasItems) {
              setShowPreOrder(true);
              // Vì đã cộng dồn selItems cho tất cả bàn trong chế độ "cùng món" (sẽ nhân lên),
              // nếu là chế độ cùng món, cần chia cho số bàn để lấy số lượng thực tế mỗi bàn
              if (sameMode && subOrders.length > 0) {
                Object.keys(selItems).forEach(k => selItems[k] = selItems[k] / subOrders.length);
              }
              setSameOrderMode(sameMode);
              setSelectedItems(selItems);
              setSeparateOrders(sepOrders);
            } else {
              setShowPreOrder(false);
              setSameOrderMode(true);
              setSelectedItems({});
              setSeparateOrders({});
            }
          }
        }).catch(() => {
          message.error("Lỗi khi tải thông tin gọi món");
        });

    } else {
      setFormData({
        customerName: "",
        phone: "",
        numberOfGuests: 1,
        duration: 0.5,
        durationUnit: "Giờ",
        note: "",
      });
      setSelectedTables(prefilledTable ? [prefilledTable._id] : []);
      setSameOrderMode(true);
      setSelectedItems({});
      setSeparateOrders({});
      setShowPreOrder(false);

      // Set default arrival time based on selectedDate
      const baseDate = selectedDate ? dayjs(selectedDate) : dayjs();
      if (prefilledHour !== undefined && prefilledHour !== null) {
        const safeHour = prefilledHour < 6 ? 6 : prefilledHour;
        setArrivalTime(baseDate.hour(safeHour).minute(0).second(0));
      } else {
        const isToday = baseDate.isSame(dayjs(), 'day');
        if (isToday) {
          let defaultTime = dayjs();
          if (defaultTime.hour() < 6) {
            defaultTime = defaultTime.hour(6).minute(0).second(0);
          }
          setArrivalTime(defaultTime);
        } else {
          setArrivalTime(baseDate.hour(10).minute(0).second(0));
        }
      }
    }
  }, [open, prefilledTable, prefilledHour, selectedDate, editingReservation]);

  // Lấy danh sách món ăn khi hiện phần đặt món trước
  useEffect(() => {
    if (showPreOrder && menuItems.length === 0) {
      setMenuLoading(true);
      getAllMenuItems({ limit: 200 })
        .then((res) => {
          setMenuItems(res.data || []);
        })
        .catch(() => {
          message.error("Không thể tải danh sách món");
        })
        .finally(() => setMenuLoading(false));
    }
  }, [showPreOrder]);

  // ── Xử lý thêm món (chế độ cùng món) ──
  const handleItemAdd = (menuItemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [menuItemId]: (prev[menuItemId] || 0) + 1,
    }));
  };

  const handleItemRemove = (menuItemId) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      if (next[menuItemId] > 1) {
        next[menuItemId]--;
      } else {
        delete next[menuItemId];
      }
      return next;
    });
  };

  // ── Xử lý thêm món (chế độ riêng bàn) ──
  const handleSeparateItemAdd = (tableId, menuItemId) => {
    setSeparateOrders((prev) => ({
      ...prev,
      [tableId]: {
        ...(prev[tableId] || {}),
        [menuItemId]: ((prev[tableId] || {})[menuItemId] || 0) + 1,
      },
    }));
  };

  const handleSeparateItemRemove = (tableId, menuItemId) => {
    setSeparateOrders((prev) => {
      const tableItems = { ...(prev[tableId] || {}) };
      if (tableItems[menuItemId] > 1) {
        tableItems[menuItemId]--;
      } else {
        delete tableItems[menuItemId];
      }
      return { ...prev, [tableId]: tableItems };
    });
  };

  // ── Kiểm tra có món đặt trước không ──
  const hasPreOrderItems = useMemo(() => {
    if (sameOrderMode) {
      return Object.keys(selectedItems).length > 0;
    }
    return Object.values(separateOrders).some(
      (tableItems) => Object.keys(tableItems).length > 0
    );
  }, [sameOrderMode, selectedItems, separateOrders]);

  // ── Xử lý lưu ──
  const handleSave = async () => {
    // Kiểm tra dữ liệu
    if (!formData.customerName.trim()) {
      message.warning("Vui lòng nhập tên khách hàng");
      return;
    }
    if (!formData.phone.trim()) {
      message.warning("Vui lòng nhập số điện thoại");
      return;
    }
    const phoneRegex = /^(0[3|5|7|8|9])\d{7,8}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      message.warning("Số điện thoại không hợp lệ (10-11 số, VD: 0912345678)");
      return;
    }
    if (selectedTables.length === 0) {
      message.warning("Vui lòng chọn ít nhất một bàn");
      return;
    }
    if (!arrivalTime) {
      message.warning("Vui lòng chọn giờ đến");
      return;
    }

    // Chặn đặt bàn từ 00:00 đến 05:59
    const hour = arrivalTime.hour();
    if (hour >= 0 && hour < 6) {
      message.warning("Không thể đặt bàn từ 00:00 đến 06:00!");
      return;
    }

    setSaving(true);

    try {
      const basePayload = {
        reservationDateTime: arrivalTime.toISOString(),
        numberOfGuests: formData.numberOfGuests,
        tables: selectedTables,
        customer: {
          customer: formData.customerName.trim(),
          phone: formData.phone.trim(),
        },
        note: formData.note || "",
      };

      if (editingReservation) {
        // Chế độ chỉnh sửa
        let items = [];
        let orderMode = "same";
        if (showPreOrder && hasPreOrderItems) {
          if (sameOrderMode) {
            orderMode = "same";
            items = Object.entries(selectedItems).map(([menuItem, quantity]) => ({
              menuItem, quantity
            }));
          } else {
            orderMode = "separate";
            items = selectedTables.filter(t => separateOrders[t] && Object.keys(separateOrders[t]).length > 0)
              .map(t => ({
                table: t,
                items: Object.entries(separateOrders[t]).map(([menuItem, quantity]) => ({ menuItem, quantity }))
              }));
          }
        }
        await updateReservation(editingReservation._id || editingReservation.reservationId, {
          ...basePayload,
          orderMode,
          items: showPreOrder ? items : []
        });
        message.success("Cập nhật đặt bàn thành công!");
      } else {
        // Chế độ tạo mới
        if (hasPreOrderItems) {
          // Tạo payload dựa trên chế độ gọi món
          let items = [];
          let orderMode = "same";

          if (sameOrderMode) {
            orderMode = "same";
            items = Object.entries(selectedItems).map(
              ([menuItemId, quantity]) => ({
                menuItem: menuItemId,
                quantity,
              })
            );
          } else {
            orderMode = "separate";
            items = selectedTables
              .filter(
                (tableId) =>
                  separateOrders[tableId] &&
                  Object.keys(separateOrders[tableId]).length > 0
              )
              .map((tableId) => ({
                table: tableId,
                items: Object.entries(separateOrders[tableId]).map(
                  ([menuItemId, quantity]) => ({
                    menuItem: menuItemId,
                    quantity,
                  })
                ),
              }));
          }

          await createReservationWithOrder({
            ...basePayload,
            orderMode,
            items,
          });
          message.success("Đặt bàn và gọi món trước thành công!");
        } else {
          await createReservation(basePayload);
          message.success("Đặt bàn thành công!");
        }
      }

      onReservationCreated?.();
      onClose();
    } catch (error) {
      console.error("Reservation error:", error);
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi đặt bàn"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      title={
        <span className="text-base font-bold">{editingReservation ? "Cập nhật đặt bàn" : "Thêm mới đặt bàn"}</span>
      }
      destroyOnHidden
      centered
    >
      <div className="pt-2">
        {/* Hàng 1: Tên khách hàng + SĐT */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block">
              Tên khách hàng <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nhập tên khách hàng"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
            />
          </div>
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nhập số điện thoại khách hàng"
              value={formData.phone}
              maxLength={11}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, phone: value });
              }}
            />
          </div>
        </div>

        {/* Hàng 2: Số khách + Giờ đến */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block">
              Số lượng khách
            </label>
            <InputNumber
              min={1}
              max={selectedTables.length > 0 ? maxGuests : 100}
              value={formData.numberOfGuests}
              onChange={(val) =>
                setFormData({ ...formData, numberOfGuests: val })
              }
              className="w-full"
              addonAfter="người"
            />
            {selectedTables.length > 0 && (
              <span className="text-red-500 text-xs mt-1 block">
                Số lượng người tối đa là {maxGuests}
              </span>
            )}
          </div>
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block">
              Giờ đến
            </label>
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="DD/MM/YYYY HH:mm"
              placeholder="Chọn ngày giờ đến"
              className="w-full"
              value={arrivalTime}
              onChange={(val) => setArrivalTime(val)}
              disabledDate={(current) => {
                // Không cho chọn ngày trước hôm nay
                return current && current.startOf('day').isBefore(dayjs().startOf('day'));
              }}
              disabledTime={(current) => {
                const now = dayjs();
                // Luôn chặn giờ 0-5 (nhà hàng đóng cửa)
                const blockedHours = [0, 1, 2, 3, 4, 5];
                // Nếu ngày được chọn là hôm nay → chặn thêm các giờ/phút đã qua
                if (current && current.isSame(now, 'day')) {
                  return {
                    disabledHours: () => {
                      const pastHours = [];
                      for (let i = 6; i < now.hour(); i++) pastHours.push(i);
                      return [...blockedHours, ...pastHours];
                    },
                    disabledMinutes: (selectedHour) => {
                      if (selectedHour === now.hour()) {
                        const mins = [];
                        for (let i = 0; i <= now.minute(); i++) mins.push(i);
                        return mins;
                      }
                      return [];
                    },
                  };
                }
                return {
                  disabledHours: () => blockedHours,
                };
              }}
            />
          </div>
        </div>

        {/* Hàng 4: Chọn bàn + Ghi chú */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-6">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-600">
                Phòng/Bàn <span className="text-red-500">*</span>
              </label>
              <button
                className="text-xs text-blue-600 hover:underline cursor-pointer"
                onClick={() => setShowAvailableTables(true)}
              >
                Xem bàn trống
              </button>
            </div>
            <Select
              mode="multiple"
              placeholder="Chọn phòng/bàn"
              options={tableOptions}
              value={selectedTables}
              onChange={(val) => {
                setSelectedTables(val);
                // Tự động giảm số khách nếu vượt quá tổng ghế
                const newMax = (tables || [])
                  .filter((t) => val.includes(t._id))
                  .reduce((sum, t) => sum + (t.capacity || 0), 0);
                if (val.length > 0 && formData.numberOfGuests > newMax) {
                  setFormData((prev) => ({ ...prev, numberOfGuests: newMax }));
                }
              }}
              className="w-full"
            />
          </div>
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
              <Pencil className="w-3 h-3" />
              Ghi chú
            </label>
            <Input.TextArea
              rows={2}
              placeholder="Nhập ghi chú..."
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
          </div>
        </div>

        {/* Hàng 5: Bật/tắt đặt món trước */}
        <div className="mb-4">
          {!showPreOrder ? (
            <button
              className="text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
              onClick={() => setShowPreOrder(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm món đặt trước
            </button>
          ) : (
            <PreOrderSection
              menuItems={menuItems}
              menuLoading={menuLoading}
              selectedItems={selectedItems}
              onItemAdd={handleItemAdd}
              onItemRemove={handleItemRemove}
              sameOrderMode={sameOrderMode}
              onSameOrderModeChange={setSameOrderMode}
              selectedTables={selectedTables}
              tableOptions={tableOptions}
              separateOrders={separateOrders}
              onSeparateItemAdd={handleSeparateItemAdd}
              onSeparateItemRemove={handleSeparateItemRemove}
            />
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex justify-center gap-3 pt-4 border-t border-gray-100">
          <Button
            type="primary"
            onClick={handleSave}
            loading={saving}
            className="flex items-center gap-1 px-6"
          >
            {editingReservation ? "Cập nhật" : "Lưu"}
          </Button>
          <Button onClick={onClose} className="flex items-center gap-1 px-6">
            Bỏ qua
          </Button>
        </div>
      </div>

      {/* Modal danh sách bàn trống */}
      <AvailableTablesModal
        open={showAvailableTables}
        onClose={() => setShowAvailableTables(false)}
        onSelect={(tableIds) => setSelectedTables(tableIds)}
        alreadySelected={selectedTables}
        dateTime={arrivalTime}
      />
    </Modal>
  );
}
