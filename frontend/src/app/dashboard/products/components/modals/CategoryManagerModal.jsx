'use client';

import { DeleteOutlined, EditOutlined, FolderOutlined, PlusOutlined, TagOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Radio, Select, Spin, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { createCategory, deleteCategory, getCategoryTree, updateCategory } from '@/services/menuCategoryService';

// ========================= ADD/EDIT MODAL =========================
function CategoryFormModal({ open, onClose, onSuccess, editData, parentOptions, defaultParentId = null }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const isEdit = !!editData;

    // A node is a parent if it exists in the tree as a top-level item (no parentId)
    const isParentNode = isEdit && (editData?.parentId === null || editData?.parentId === undefined);

    useEffect(() => {
        if (!open) return;
        if (isEdit) {
            form.setFieldsValue({
                categoryName: editData.categoryName,
                parentId:     editData.parentId ?? undefined,
                status:       editData.status ?? 'active',
            });
        } else {
            form.setFieldsValue({
                categoryName: '',
                parentId:     defaultParentId ?? undefined,
                status:       'active',
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            if (isEdit) {
                await updateCategory(editData._id, values);
                message.success('Cập nhật danh mục thành công');
            } else {
                await createCategory(values);
                message.success('Thêm danh mục thành công');
            }
            form.resetFields();
            onSuccess?.();
        } catch (err) {
            if (err?.response?.data?.message) message.error(err.response.data.message);
            else if (err?.message && !err?.errorFields) message.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <FolderOutlined className="text-green-600" />
                    </div>
                    <span className="font-semibold text-gray-800">
                        {isEdit ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                    </span>
                </div>
            }
            open={open}
            onCancel={onClose}
            destroyOnHidden
            width={460}
            footer={
                <div className="flex justify-end gap-2 pt-1">
                    <Button onClick={onClose} className="rounded-lg">Hủy</Button>
                    <Button
                        type="primary"
                        loading={loading}
                        className="!bg-green-600 hover:!bg-green-700 rounded-lg"
                        onClick={handleSubmit}
                    >
                        {isEdit ? 'Lưu cập nhật' : 'Thêm danh mục'}
                    </Button>
                </div>
            }
        >
            <Form form={form} layout="vertical" className="mt-4">
                {/* Only show parent selector when: adding new, OR editing a child node */}
                {!isParentNode && (
                    <Form.Item name="parentId" label="Danh mục cha">
                        <Select
                            allowClear
                            placeholder="Để trống nếu là danh mục gốc"
                            options={parentOptions}
                            className="rounded-lg"
                        />
                    </Form.Item>
                )}

                <Form.Item
                    name="categoryName"
                    label="Tên danh mục"
                    rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                >
                    <Input placeholder="VD: Đồ uống, Bia, Nước ngọt..." className="rounded-lg" />
                </Form.Item>

                {isEdit && (
                    <Form.Item name="status" label="Trạng thái">
                        <Radio.Group>
                            <Radio value="active">
                                <span className="text-green-600 font-medium">Hoạt động</span>
                            </Radio>
                            <Radio value="inactive">
                                <span className="text-gray-400 font-medium">Tạm dừng</span>
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
}

// ========================= CHILD ROW =========================
function ChildRow({ node, onEdit, onDelete }) {
    return (
        <div className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50 group transition-colors">
            <div className="flex items-center gap-3 pl-4">
                <div className="flex items-center gap-2">
                    <div className="w-px h-4 bg-gray-200" />
                    <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                        <TagOutlined className="text-blue-400 text-xs" />
                    </div>
                </div>
                <span className="text-gray-700 text-sm">{node.categoryName}</span>
                <Tag
                    color={node.status === 'active' ? 'success' : 'default'}
                    className="text-xs !rounded-full"
                >
                    {node.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </Tag>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <Button
                    size="small" type="text"
                    icon={<EditOutlined />}
                    className="!text-blue-500 hover:!bg-blue-50 !rounded-lg"
                    onClick={() => onEdit(node)}
                />
                <Popconfirm
                    title="Xóa nhóm hàng"
                    description="Bạn có chắc muốn xóa nhóm hàng này?"
                    okText="Xóa" cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => onDelete(node._id)}
                >
                    <Button
                        size="small" type="text"
                        icon={<DeleteOutlined />}
                        className="!text-red-400 hover:!bg-red-50 !rounded-lg"
                    />
                </Popconfirm>
            </div>
        </div>
    );
}

// ========================= PARENT ROW =========================
function ParentRow({ node, onEdit, onDelete, onAddChild }) {
    const hasChildren = node.children?.length > 0;
    const isInactive  = node.status === 'inactive';

    return (
        <div className={`rounded-xl border overflow-hidden transition-all ${
            isInactive
                ? 'border-gray-200 opacity-60'
                : 'border-gray-200 hover:border-green-200 hover:shadow-sm'
        }`}>
            {/* Parent header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-white group">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isInactive ? 'bg-gray-100' : 'bg-green-100'
                    }`}>
                        <FolderOutlined className={`text-sm ${isInactive ? 'text-gray-400' : 'text-green-600'}`} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{node.categoryName}</span>
                        {hasChildren && (
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {node.children.length} nhóm
                            </span>
                        )}
                        <Tag
                            color={isInactive ? 'default' : 'success'}
                            className="text-xs !rounded-full"
                        >
                            {isInactive ? 'Tạm dừng' : 'Hoạt động'}
                        </Tag>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <Button
                        size="small" type="text"
                        icon={<PlusOutlined />}
                        className="!text-green-600 hover:!bg-green-50 text-xs !rounded-lg"
                        onClick={() => onAddChild(node)}
                    >
                        Thêm nhóm
                    </Button>
                    <Button
                        size="small" type="text"
                        icon={<EditOutlined />}
                        className="!text-blue-500 hover:!bg-blue-50 !rounded-lg"
                        onClick={() => onEdit(node)}
                    />
                    <Popconfirm
                        title="Xóa danh mục"
                        description={
                            hasChildren
                                ? `Danh mục có ${node.children.length} nhóm con. Các nhóm con sẽ được chuyển lên cấp trên.`
                                : 'Bạn có chắc muốn xóa danh mục này?'
                        }
                        okText="Xóa" cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => onDelete(node._id)}
                    >
                        <Button
                            size="small" type="text"
                            icon={<DeleteOutlined />}
                            className="!text-red-400 hover:!bg-red-50 !rounded-lg"
                        />
                    </Popconfirm>
                </div>
            </div>

            {/* Children list */}
            {hasChildren && (
                <div className="divide-y divide-gray-100 bg-white border-t border-gray-100">
                    {node.children.map(child => (
                        <ChildRow
                            key={child._id}
                            node={child}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ========================= MAIN MODAL =========================
export default function CategoryManagerModal({ open, onClose, onSuccess }) {
    const [categoryTree, setCategoryTree] = useState([]);
    const [loading, setLoading]           = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editData, setEditData]         = useState(null);
    const [defaultParentId, setDefaultParentId] = useState(null);

    const loadTree = async () => {
        setLoading(true);
        try {
            const res = await getCategoryTree();
            setCategoryTree(Array.isArray(res) ? res : res?.data ?? []);
        } catch {
            message.error('Không thể tải danh mục');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) loadTree();
    }, [open]);

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id, false);
            message.success('Xóa thành công');
            loadTree();
            onSuccess?.(); 
        } catch (err) {
            message.error(err?.response?.data?.message || 'Xóa thất bại');
        }
    };

    const handleEdit = (node) => {
        setEditData({
            _id:          node._id,
            categoryName: node.categoryName,
            parentId:     node.parentId ?? null,
            status:       node.status   ?? 'active',
        });
        setDefaultParentId(null);
        setFormModalOpen(true);
    };

    const handleAdd = () => {
        setEditData(null);
        setDefaultParentId(null);
        setFormModalOpen(true);
    };

    const handleAddChild = (parentNode) => {
        setEditData(null);
        setDefaultParentId(parentNode._id?.toString());
        setFormModalOpen(true);
    };

    const totalChildren = categoryTree.reduce((acc, p) => acc + (p.children?.length ?? 0), 0);

    const parentOptions = categoryTree.map(p => ({
        value: p._id?.toString(),
        label: p.categoryName,
    }));

    return (
        <>
            <Modal
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                            <FolderOutlined className="text-green-600 text-base" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800 leading-tight">Danh mục hàng hóa</div>
                            <div className="text-xs text-gray-400 font-normal mt-0.5">
                                {categoryTree.length} danh mục · {totalChildren} nhóm hàng
                            </div>
                        </div>
                    </div>
                }
                open={open}
                onCancel={onClose}
                width={640}
                footer={
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                            Hover vào danh mục để xem tùy chọn
                        </span>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="!bg-green-600 hover:!bg-green-700 !rounded-lg"
                            onClick={handleAdd}
                        >
                            Thêm danh mục
                        </Button>
                    </div>
                }
                styles={{ body: { maxHeight: '55vh', overflowY: 'auto', padding: '16px 24px' } }}
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Spin size="large" />
                        <span className="text-gray-400 text-sm">Đang tải danh mục...</span>
                    </div>
                ) : categoryTree.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <FolderOutlined className="text-3xl text-gray-300" />
                        </div>
                        <div className="text-gray-500 font-medium">Chưa có danh mục nào</div>
                        <div className="text-gray-400 text-sm">Thêm danh mục để phân loại hàng hóa</div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="!bg-green-600 hover:!bg-green-700 !rounded-lg mt-2"
                            onClick={handleAdd}
                        >
                            Thêm danh mục đầu tiên
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {categoryTree.map(parent => (
                            <ParentRow
                                key={parent._id}
                                node={parent}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onAddChild={handleAddChild}
                            />
                        ))}
                    </div>
                )}
            </Modal>

            <CategoryFormModal
                open={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                editData={editData}
                parentOptions={parentOptions}
                defaultParentId={defaultParentId}
                onSuccess={() => {
                    setFormModalOpen(false);
                    loadTree();
                    onSuccess?.();
                }}
            />
        </>
    );
}