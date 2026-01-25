'use client';

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

const { Text } = Typography;

export default function ProductHeader({
    selectedRowKeys = [],
    hasSelected = false,
    visibleColumns = {},
    onColumnVisibilityChange = () => { },
    onDeselectAll = () => { },
}) {
    const addMenuItems = [
        { key: '1', label: 'Thêm hàng hóa' },
        { key: '2', label: 'Thêm hàng chế biến' },
        { key: '3', label: 'Thêm dịch vụ' },
        { key: '4', label: 'Thêm combo buffet' },
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

    const columnMenuItems = [
        {
            key: 'image',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.image || false}
                        onChange={(e) => onColumnVisibilityChange('image', e.target.checked)}
                        className="mr-2"
                    />
                    Hình ảnh
                </div>
            ),
        },
        {
            key: 'code',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.code || false}
                        onChange={(e) => onColumnVisibilityChange('code', e.target.checked)}
                        className="mr-2"
                    />
                    Mã hàng hóa
                </div>
            ),
        },
        {
            key: 'name',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.name || false}
                        onChange={(e) => onColumnVisibilityChange('name', e.target.checked)}
                        className="mr-2"
                    />
                    Tên hàng
                </div>
            ),
        },
        {
            key: 'category',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.category || false}
                        onChange={(e) => onColumnVisibilityChange('category', e.target.checked)}
                        className="mr-2"
                    />
                    Loại thực đơn
                </div>
            ),
        },
        {
            key: 'group',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.group || false}
                        onChange={(e) => onColumnVisibilityChange('group', e.target.checked)}
                        className="mr-2"
                    />
                    Nhóm hàng
                </div>
            ),
        },
        {
            key: 'type',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.type || false}
                        onChange={(e) => onColumnVisibilityChange('type', e.target.checked)}
                        className="mr-2"
                    />
                    Loại hàng
                </div>
            ),
        },
        {
            key: 'price',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.price || false}
                        onChange={(e) => onColumnVisibilityChange('price', e.target.checked)}
                        className="mr-2"
                    />
                    Giá bán
                </div>
            ),
        },
        {
            key: 'cost',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.cost || false}
                        onChange={(e) => onColumnVisibilityChange('cost', e.target.checked)}
                        className="mr-2"
                    />
                    Giá vốn
                </div>
            ),
        },
        {
            key: 'stock',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.stock || false}
                        onChange={(e) => onColumnVisibilityChange('stock', e.target.checked)}
                        className="mr-2"
                    />
                    Tồn kho
                </div>
            ),
        },
        {
            key: 'location',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.location || false}
                        onChange={(e) => onColumnVisibilityChange('location', e.target.checked)}
                        className="mr-2"
                    />
                    Vị trí
                </div>
            ),
        },
        {
            key: 'order',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.order || false}
                        onChange={(e) => onColumnVisibilityChange('order', e.target.checked)}
                        className="mr-2"
                    />
                    Đặt hàng
                </div>
            ),
        },
        {
            type: 'divider',
        },
        {
            key: 'latestStock',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.latestStock || false}
                        onChange={(e) => onColumnVisibilityChange('latestStock', e.target.checked)}
                        className="mr-2"
                    />
                    Định mức tồn ít nhất
                </div>
            ),
        },
        {
            key: 'maxStock',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.maxStock || false}
                        onChange={(e) => onColumnVisibilityChange('maxStock', e.target.checked)}
                        className="mr-2"
                    />
                    Định mức tồn nhiều nhất
                </div>
            ),
        },
        {
            key: 'status',
            label: (
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={visibleColumns.status || false}
                        onChange={(e) => onColumnVisibilityChange('status', e.target.checked)}
                        className="mr-2"
                    />
                    Trạng thái
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 mb-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <h1 className="text-3xl font-bold">Hàng hóa</h1>

                    {/* Khu vực thao tác khi có chọn */}
                    {hasSelected && (
                        <Space className="animate-fade-in">
                            <Text strong>{selectedRowKeys.length} mục đã chọn</Text>
                            <Button type="link" onClick={onDeselectAll} icon={<CloseOutlined />}>
                            </Button>
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
                    <Dropdown menu={{ items: addMenuItems }} placement="bottomLeft">
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
        </div>
    );
}