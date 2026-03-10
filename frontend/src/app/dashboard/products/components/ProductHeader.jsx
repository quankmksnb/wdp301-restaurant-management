'use client';

import {
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    ExportOutlined,
    MenuOutlined,
    PlusOutlined,
    PrinterOutlined,
    TagOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Space, Typography } from 'antd';
import { useState } from 'react';

// Import 4 modal components
import AddProductModal from './modals/AddProductModal';
import CategoryManagerModal from './modals/CategoryManagerModal';


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
    onRefresh = () => { },
}) {
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    // State để quản lý 4 modal riêng biệt
    const [modalStates, setModalStates] = useState({
        product: false,
        processed: false,
        service: false,
        combo: false,
    });

    const handleProductConfirm = (newItem, andNew) => {
        if (!andNew) closeModal('product');
        onRefresh();
    };

    const addMenuItems = [
        { key: 'product', label: 'Thêm hàng hóa' },
        // { key: 'processed', label: 'Thêm hàng chế biến' },
        // { key: 'service', label: 'Thêm dịch vụ' },
        // { key: 'combo', label: 'Thêm combo buffet' },
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

    ];

    const additionalColumns = [
        { key: 'price', label: 'Giá bán' },
        { key: 'cost', label: 'Giá vốn' },
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

                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="large"
                        className="!bg-secondary !border-secondary hover:!bg-secondary/90"
                        onClick={() => setCategoryModalOpen(true)}
                    >
                        Danh mục hàng hóa
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
                onConfirm={handleProductConfirm}
            />

            <CategoryManagerModal
                open={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
            />

            {/* <AddProcessedProductModal
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
            /> */}
        </div>
    );
}