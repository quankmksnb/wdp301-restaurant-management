'use client';

import {
    BarcodeOutlined,
    CheckCircleFilled,
    CheckCircleOutlined,
    CloseCircleFilled,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';

import { Button, Image, Space, Tabs, Tag, Modal, message } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import UpdateProductModal from './modals/UpdateProductModal';
import { getCategoryTree } from '@/services/menuCategoryService';
import { toggleMenuItemStatus, deleteMenuItem } from '@/services/menuItemService';

const BASE_URL = 'http://localhost:5000';

const STATUS_MAP = {
    available: { label: 'Đang kinh doanh', color: 'success' },
    unavailable: { label: 'Ngừng kinh doanh', color: 'default' },
    out_of_stock: { label: 'Hết hàng', color: 'error' },
};

const tabItems = [{ key: 'info', label: 'Chi tiết sản phẩm' }];

function InfoRow({ label, value, bold = false }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className={bold ? 'font-semibold' : ''}>{value ?? '-'}</span>
        </div>
    );
}

export default function ProductDetail({ product, onRefresh }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryTree, setCategoryTree] = useState([]);
    const [toggling, setToggling] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        getCategoryTree()
            .then(res => setCategoryTree(Array.isArray(res) ? res : res?.data ?? []))
            .catch(console.error);
    }, []);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    if (!product) return null;

    const name = product.itemName ?? product.name;
    const code = product.productCode ?? product.code;
    const price = product.price ?? 0;
    const cost = product.costPrice ?? product.cost ?? 0;
    const description = product.description ?? '-';
    const status = product.availabilityStatus ?? null;
    const statusInfo = STATUS_MAP[status];

    const images = useMemo(() => {
        const raw = product.images ?? (product.image ? [product.image] : []);
        return raw.map(getImageUrl).filter(Boolean);
    }, [product]);

    const mainImage = images[0] ?? null;

    const categoryObj = product.category;
    const isChild = !!categoryObj?.parentId;
    const groupName = categoryObj?.categoryName ?? '-';
    const parentCategory = isChild
        ? categoryTree.find(p => p._id?.toString() === categoryObj?.parentId?.toString())
        : categoryObj;
    const categoryName = parentCategory?.categoryName ?? '-';

    // ====== TOGGLE STATUS ======
    const handleToggleStatus = () => {
        const isCurrentlyAvailable = status === 'available';
        const nextLabel = isCurrentlyAvailable ? 'Ngừng kinh doanh' : 'Đang kinh doanh';
        const nextColor = isCurrentlyAvailable ? '#ff4d4f' : '#52c41a';
        const nextIcon = isCurrentlyAvailable ? '🔴' : '🟢';

        Modal.confirm({
            title: 'Xác nhận thay đổi trạng thái',
            content: (
                <div style={{ paddingTop: '8px' }}>
                    <p style={{ marginBottom: '12px', color: '#262626' }}>
                        Sản phẩm <strong>"{product?.itemName}"</strong>
                    </p>
                    <p style={{ marginBottom: '0' }}>
                        Sẽ chuyển sang trạng thái:{' '}
                        <span style={{ color: nextColor, fontWeight: 700, fontSize: '14px' }}>
                            {nextIcon} {nextLabel}
                        </span>
                    </p>
                    {isCurrentlyAvailable && (
                        <p style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
                            ⚠️ Sản phẩm sẽ không hiển thị trên menu
                        </p>
                    )}
                </div>
            ),
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            okButtonProps: { danger: isCurrentlyAvailable },
            onOk: async () => {
                try {
                    setToggling(true);

                    const res = await toggleMenuItemStatus(product._id);

                    // ✅ Kiểm tra response - có thể là success:false hoặc status 400
                    if (!res?.success) {
                        message.warning({
                            content: res?.message || 'Không thể cập nhật trạng thái',
                            duration: 4,
                        });
                        return;
                    }

                    // ✅ Success notification
                    message.success({
                        content: (
                            <div>
                                <p style={{ marginBottom: '4px', fontWeight: 600 }}>
                                    ✓ Cập nhật thành công
                                </p>
                                <p style={{ marginBottom: '0', fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
                                    {nextIcon} {nextLabel}
                                </p>
                            </div>
                        ),
                        duration: 3,
                    });

                    onRefresh?.();
                } catch (err) {
                    message.error({
                        content: (
                            <div>
                                <p style={{ marginBottom: '4px', fontWeight: 600 }}>
                                    ✗ Lỗi hệ thống
                                </p>
                                <p style={{ marginBottom: '0', fontSize: '13px' }}>
                                    {err?.message || 'Vui lòng thử lại sau'}
                                </p>
                            </div>
                        ),
                        duration: 4,
                    });
                } finally {
                    setToggling(false);
                }
            },
        });
    };

    // ====== DELETE ======
    const handleDelete = () => {
        Modal.confirm({
            title: 'Xác nhận xóa sản phẩm',
            content: (
                <span>
                    Bạn có chắc muốn xóa{' '}
                    <span style={{ fontWeight: 600 }}>{name}</span>
                    ? Hành động này không thể hoàn tác.
                </span>
            ),
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    setDeleting(true);
                    await deleteMenuItem(product._id);
                    message.success('Xóa sản phẩm thành công');
                    onRefresh?.();
                } catch (err) {
                    message.error(err?.response?.data?.message || 'Xóa thất bại');
                } finally {
                    setDeleting(false);
                }
            },
        });
    };

    return (
        <div className="p-4 bg-white rounded-lg">
            <Tabs defaultActiveKey="info" items={tabItems} />

            {/* HEADER */}
            <div className="mb-4">
                <h2 className="text-xl font-bold text-green-700 mb-2">{name}</h2>
                <Space size="small" wrap>
                    {statusInfo && <Tag color={statusInfo.color}>{statusInfo.label}</Tag>}
                    {product.directSale && <Tag icon={<CheckCircleFilled />} color="success">Bán trực tiếp</Tag>}
                    {product.noPoint && <Tag icon={<CloseCircleFilled />} color="error">Không tích điểm</Tag>}
                    {product.noExtra && <Tag icon={<CloseCircleFilled />} color="error">Không là món thêm</Tag>}
                </Space>
            </div>

            {/* CONTENT */}
            <div className="flex gap-6">
                {/* IMAGE */}
                <div className="flex-shrink-0 w-40 flex flex-col gap-2">
                    {mainImage ? (
                        <>
                            <Image
                                src={mainImage} alt={name}
                                width={160} height={160}
                                style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                            />
                            {images.length > 1 && (
                                <div className="flex gap-1 flex-wrap">
                                    {images.slice(1).map((img, i) => (
                                        <Image key={i} src={img} width={40} height={40}
                                            style={{ objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center">
                            Không có ảnh
                        </div>
                    )}
                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-3 gap-x-8 gap-y-4 text-sm">
                        <InfoRow label="Mã hàng hóa" value={code} bold />
                        <InfoRow label="Loại thực đơn" value={categoryName} bold />
                        <InfoRow label="Nhóm hàng" value={groupName} bold />
                        <InfoRow label="Giá bán" value={`${price.toLocaleString('vi-VN')} đ`} bold />
                        <InfoRow label="Giá vốn" value={`${cost.toLocaleString('vi-VN')} đ`} bold />
                        {product.stock !== undefined && (
                            <InfoRow label="Tồn kho" value={
                                <Tag color={product.stock === 0 ? 'red' : 'green'}>{product.stock}</Tag>
                            } />
                        )}
                        <div className="col-span-3">
                            <InfoRow label="Mô tả" value={description} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-end">
                <Space size="small" wrap>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => setModalOpen(true)}
                    >
                        Cập nhật thông tin
                    </Button>

                    <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        loading={toggling}
                        onClick={handleToggleStatus}
                    >
                        Cập nhật trạng thái
                    </Button>

                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        loading={deleting}
                        onClick={handleDelete}
                    >
                        Xóa
                    </Button>
                </Space>
            </div>

            <UpdateProductModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={() => {
                    setModalOpen(false);
                    onRefresh?.();
                }}
                product={product}
            />
        </div>
    );
}