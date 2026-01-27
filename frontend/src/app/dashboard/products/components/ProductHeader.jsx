'use client';

import { useState } from 'react';
import { Button, Dropdown, Space, Typography } from 'antd';
import {
    PlusOutlined,
    UploadOutlined,
    DownloadOutlined,
    MenuOutlined,
    DeleteOutlined,
    TagOutlined,
    PrinterOutlined,
    ExportOutlined,
    CloseOutlined,
} from '@ant-design/icons';

// Import 4 modal components
import AddProductModal from './modals/AddProductModal';
import AddProcessedProductModal from './modals/AddProcessedProductModal';
import AddServiceModal from './modals/AddServiceModal';
import AddComboBuffetModal from './modals/AddComboBuffetModal';

const { Text } = Typography;

// Helper component for checkbox items
const ColumnCheckbox = ({ columnKey, label, visibleColumns, onColumnVisibilityChange }) => (
    <div className="flex items-center">
        <input
            type="checkbox"
            checked={visibleColumns[columnKey] || false}
            onChange={(e) => onColumnVisibilityChange(columnKey, e.target.checked)}
            className="mr-2"
        />
        {label}
    </div>
);

export default function ProductHeader({
    selectedRowKeys = [],
    hasSelected = false,
    visibleColumns = {},
    onColumnVisibilityChange = () => { },
    onDeselectAll = () => { },
}) {
    // State để quản lý 4 modal riêng biệt
    const [modalStates, setModalStates] = useState({
        product: false,
        processed: false,
        service: false,
        combo: false,
    });

    const addMenuItems = [
        { key: 'product', label: 'Thêm hàng hóa' },
        { key: 'processed', label: 'Thêm hàng chế biến' },
        { key: 'service', label: 'Thêm dịch vụ' },
        { key: 'combo', label: 'Thêm combo buffet' },
    ];

    const batchActionItems = [
        { key: 'delete', label: 'Xóa các mục đã chọn', icon: <DeleteOutlined /> },
        { key: 'status', label: 'Thay đổi trạng thái kinh doanh', icon: <TagOutlined /> },
        { key: 'print', label: 'In mã vạch', icon: <PrinterOutlined /> },
        { key: 'export', label: 'Xuất file các mục đã chọn', icon: <ExportOutlined /> },
        { type: 'divider' },
        { key: 'group', label: 'Chuyển nhóm hàng' },
        { key: 'price', label: 'Cập nhật giá bán hàng loạt' },
    ];

    const mainColumns = [
        { key: 'image', label: 'Hình ảnh' },
        { key: 'code', label: 'Mã hàng hóa' },
        { key: 'name', label: 'Tên hàng' },
        { key: 'category', label: 'Loại thực đơn' },
        { key: 'group', label: 'Nhóm hàng' },
        { key: 'type', label: 'Loại hàng' },
        { key: 'price', label: 'Giá bán' },
    ];

    const additionalColumns = [
        { key: 'cost', label: 'Giá vốn' },
        { key: 'stock', label: 'Tồn kho' },
        { key: 'location', label: 'Vị trí' },
        { key: 'order', label: 'Đặt hàng' },
        { key: 'latestStock', label: 'Định mức tồn ít nhất' },
        { key: 'maxStock', label: 'Định mức tồn nhiều nhất' },
        { key: 'status', label: 'Trạng thái' },
    ];

    const columnMenuItems = [
        {
            key: 'columns-grid',
            label: (
                <div className="grid grid-cols-2 gap-4 min-w-96">
                    <div className="space-y-2">
                        {mainColumns.map((col) => (
                            <div key={col.key}>
                                <ColumnCheckbox
                                    columnKey={col.key}
                                    label={col.label}
                                    visibleColumns={visibleColumns}
                                    onColumnVisibilityChange={onColumnVisibilityChange}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        {additionalColumns.map((col) => (
                            <div key={col.key}>
                                <ColumnCheckbox
                                    columnKey={col.key}
                                    label={col.label}
                                    visibleColumns={visibleColumns}
                                    onColumnVisibilityChange={onColumnVisibilityChange}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
    ];

    // Hàm mở modal
    const openModal = (modalType) => {
        setModalStates(prev => ({ ...prev, [modalType]: true }));
    };

    // Hàm đóng modal
    const closeModal = (modalType) => {
        setModalStates(prev => ({ ...prev, [modalType]: false }));
    };

    // Hàm xác nhận (lưu)
    const handleConfirm = (modalType) => {
        console.log(`${modalType} confirmed`);
        // Xử lý logic lưu dữ liệu ở đây
        closeModal(modalType);
    };

    // Xử lý khi click vào menu dropdown
    const handleMenuClick = ({ key }) => {
        openModal(key);
    };

    return (
        <div className="p-4 mb-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <h1 className="text-3xl font-bold">Hàng hóa</h1>

                    {/* Khu vực thao tác khi có chọn */}
                    {hasSelected && (
                        <Space className="animate-fade-in">
                            <Text strong>{selectedRowKeys.length} mục đã chọn</Text>
                            <Button type="link" onClick={onDeselectAll} icon={<CloseOutlined />} />
                        </Space>
                    )}
                </div>

                <Space>
                    {hasSelected && (
                        <Dropdown menu={{ items: batchActionItems }} trigger={['hover']}>
                            <Button type="primary" size='large' className="!bg-secondary !border-secondary hover:!bg-secondary/90">
                                Thao tác hàng loạt ▼
                            </Button>
                        </Dropdown>
                    )}
                    
                    <Dropdown
                        menu={{ items: addMenuItems, onClick: handleMenuClick }}
                        placement="bottomLeft"
                        trigger={['hover']}
                    >
                        <Button type="primary" icon={<PlusOutlined />} size="large" className="!bg-secondary !border-secondary hover:!bg-secondary/90">
                            Thêm mới
                        </Button>
                    </Dropdown>

                    <Button type="primary" icon={<UploadOutlined />} size="large" className="!bg-secondary !border-secondary hover:!bg-secondary/90">
                        Import
                    </Button>
                    
                    <Button type="primary" icon={<DownloadOutlined />} size="large" className="!bg-secondary !border-secondary hover:!bg-secondary/90">
                        Xuất file
                    </Button>

                    <Dropdown
                        menu={{ items: columnMenuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button
                            size="large"
                            className="!bg-secondary !border-secondary hover:!bg-secondary/90 !text-white"
                            icon={<MenuOutlined className="text-white" />}
                        />
                    </Dropdown>
                </Space>
            </div>

            {/* 4 Modal riêng biệt */}
            <AddProductModal
                open={modalStates.product}
                onClose={() => closeModal('product')}
                onConfirm={() => handleConfirm('product')}
            />

            <AddProcessedProductModal
                open={modalStates.processed}
                onClose={() => closeModal('processed')}
                onConfirm={() => handleConfirm('processed')}
            />

            <AddServiceModal
                open={modalStates.service}
                onClose={() => closeModal('service')}
                onConfirm={() => handleConfirm('service')}
            />

            <AddComboBuffetModal
                open={modalStates.combo}
                onClose={() => closeModal('combo')}
                onConfirm={() => handleConfirm('combo')}
            />
        </div>
    );
}