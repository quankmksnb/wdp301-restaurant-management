"use client";

import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Tabs,
  Upload,
  message,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { getCategoryTree } from "@/services/menuCategoryService";
import { getMenuItemById, updateMenuItem } from "@/services/menuItemService";

const { TextArea } = Input;
const BASE_URL = "http://localhost:5000";

function SectionHeader({ title }) {
  return (
    <div className="bg-gray-200 px-4 py-2 -mx-4 mb-4">
      <h3 className="font-semibold text-gray-700">{title}</h3>
    </div>
  );
}

function ProductInfoTab({
  parentOptions,
  childOptions,
  selectedParentId,
  onParentChange,
  fileList,
  onFileChange,
}) {
  return (
    <div className="space-y-2">
      {/* ── Thông tin cơ bản ── */}
      <SectionHeader title="Thông tin cơ bản" />
      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          name="productCode"
          label="Mã hàng hóa"
          rules={[{ required: true, message: "Vui lòng nhập mã hàng" }]}
        >
          <Input placeholder="SP001" />
        </Form.Item>
        <Form.Item
          name="itemName"
          label="Tên hàng"
          rules={[{ required: true, message: "Vui lòng nhập tên hàng" }]}
        >
          <Input placeholder="Nhập tên hàng hóa" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item name="parentCategory" label="Loại thực đơn">
          <Select
            options={parentOptions}
            placeholder="-- Chọn loại --"
            onChange={onParentChange}
          />
        </Form.Item>
        <Form.Item
          name="category"
          label="Nhóm hàng"
          rules={[{ required: true, message: "Vui lòng chọn nhóm hàng" }]}
        >
          <Select
            placeholder="-- Lựa chọn --"
            options={childOptions}
            disabled={!selectedParentId}
          />
        </Form.Item>
      </div>

      {/* ── Hình ảnh ── */}
      <SectionHeader title="Hình ảnh" />
      <Form.Item>
        <Upload
          listType="picture-card"
          maxCount={5}
          multiple
          beforeUpload={() => false}
          fileList={fileList}
          onChange={({ fileList: newList }) => onFileChange(newList)}
        >
          {fileList.length < 5 && (
            <>
              <PlusOutlined />
              <div className="mt-1 text-xs">Tải ảnh</div>
            </>
          )}
        </Upload>
      </Form.Item>

      {/* ── Giá hàng hóa ── */}
      <SectionHeader title="Giá hàng hóa" />
      <div className="grid grid-cols-2 gap-4">
        <Form.Item label="Giá vốn">
          <Space.Compact className="w-full">
            <Form.Item name="costPrice" noStyle>
              <InputNumber
                className="w-full"
                style={{ width: "100%" }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => v?.replace(/,/g, "")}
              />
            </Form.Item>
            <Button disabled>₫</Button>
          </Space.Compact>
        </Form.Item>
        <Form.Item label="Giá bán" required>
          <Space.Compact className="w-full">
            <Form.Item
              name="price"
              noStyle
              rules={[
                { required: true, message: "Vui lòng nhập giá bán" },
                { type: "number", min: 1, message: "Giá bán phải lớn hơn 0" },
              ]}
            >
              <InputNumber
                className="w-full"
                style={{ width: "100%" }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => v?.replace(/,/g, "")}
              />
            </Form.Item>
            <Button disabled>₫</Button>
          </Space.Compact>
        </Form.Item>
      </div>
    </div>
  );
}

export default function UpdateProductModal({
  open,
  onClose,
  onConfirm,
  product,
}) {
  const [form] = Form.useForm();
  const [categoryTree, setCategoryTree] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategoryTree()
      .then((res) =>
        setCategoryTree(Array.isArray(res) ? res : (res?.data ?? [])),
      )
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!open || !product?._id || categoryTree.length === 0) return;

    getMenuItemById(product._id)
      .then((item) => {
        const parentId = item.category?.parentId?.toString() ?? null;
        const childId = item.category?._id?.toString() ?? null;

        setSelectedParentId(parentId);
        setFileList(
          (item.images ?? []).map((url, i) => ({
            uid: `-${i}`,
            name: `image-${i}`,
            status: "done",
            url: url.startsWith("http")
              ? url
              : `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`,
          })),
        );

        form.setFieldsValue({
          productCode: item.productCode,
          itemName: item.itemName,
          parentCategory: parentId ?? undefined,
          category: childId ?? undefined,
          costPrice: item.costPrice || 0,
          price: item.price || 0,
          description: item.description,
        });
      })
      .catch(console.error);
  }, [open, product?._id, categoryTree]);

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append("itemName", values.itemName);
      formData.append("productCode", values.productCode);
      formData.append("price", values.price);
      formData.append("costPrice", values.costPrice || 0);
      formData.append("description", values.description || "");
      formData.append("category", values.category);

      const oldImages = fileList
        .filter((f) => f.url && !f.originFileObj)
        .map((f) => f.url.replace(BASE_URL, ""));
      formData.append("oldImages", JSON.stringify(oldImages));

      fileList.forEach((file) => {
        if (file.originFileObj) formData.append("images", file.originFileObj);
      });

      await updateMenuItem(product._id, formData);
      message.success("Cập nhật hàng hóa thành công");
      onConfirm?.();
    } catch (err) {
      if (err?.message && !err?.errorFields) message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parentOptions = useMemo(
    () =>
      categoryTree.map((p) => ({
        value: p._id?.toString(),
        label: p.categoryName,
      })),
    [categoryTree],
  );

  const childOptions = useMemo(
    () =>
      categoryTree
        .find((p) => p._id?.toString() === selectedParentId?.toString())
        ?.children?.map((c) => ({
          value: c._id?.toString(),
          label: c.categoryName,
        })) ?? [],
    [categoryTree, selectedParentId],
  );

  const handleParentChange = (val) => {
    setSelectedParentId(val);
    form.setFieldValue("category", undefined);
  };

  // Xóa useMemo, dùng trực tiếp
  const tabItems = [
    {
      key: "1",
      label: "Thông tin",
      children: (
        <ProductInfoTab
          parentOptions={parentOptions}
          childOptions={childOptions}
          selectedParentId={selectedParentId}
          onParentChange={handleParentChange}
          fileList={fileList}
          onFileChange={setFileList}
        />
      ),
    },
    {
      key: "2",
      label: "Mô tả chi tiết",
      children: (
        <div className="space-y-2">
          <SectionHeader title="Mô tả chi tiết" />
          <Form.Item name="description">
            <TextArea
              rows={8}
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
            />
          </Form.Item>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="Cập nhật hàng hóa"
      open={open}
      onCancel={onClose}
      width={1000}
      style={{ top: "5vh" }}
      styles={{
        body: {
          maxHeight: "calc(95vh - 140px)",
          overflowY: "auto",
          padding: "20px",
        },
      }}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="primary"
            className="!bg-green-600 hover:!bg-green-700"
            loading={loading}
            onClick={handleConfirm}
          >
            Lưu cập nhật
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Tabs items={tabItems} />
      </Form>
    </Modal>
  );
}
