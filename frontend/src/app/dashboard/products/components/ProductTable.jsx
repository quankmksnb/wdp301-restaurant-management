'use client';

import { Table, Space, Image, Tag } from 'antd';
import { useState, useEffect, useCallback, useRef } from 'react';
import { StarOutlined } from '@ant-design/icons';
import ProductDetail from './ProductDetail';
import ProductHeader from './ProductHeader';
import { getAllMenuItems } from '@/services/menuItemService';
import { getCategoryTree } from '@/services/menuCategoryService';

const STATUS_MAP = {
    available: { label: 'Đang kinh doanh', color: 'green' },
    unavailable: { label: 'Ngừng kinh doanh', color: 'default' },
    out_of_stock: { label: 'Hết hàng', color: 'red' },
};

export default function ProductTable({ filters = {} }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [categoryTree, setCategoryTree] = useState([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [visibleColumns, setVisibleColumns] = useState({
        image: true, code: true, name: true, category: true,
        group: true, price: true, cost: true, stock: true,
        location: false, latestStock: false, maxStock: false, status: true,
    });

    // Load category tree 1 lần
    useEffect(() => {
        getCategoryTree()
            .then(res => setCategoryTree(Array.isArray(res) ? res : res?.data ?? []))
            .catch(console.error);
    }, []);

    // Hàm lấy parent name từ categoryTree
    const getParentName = useCallback((category) => {
        if (!category) return '-';
        if (!category.parentId) return category.categoryName; // chính nó là parent
        const parent = categoryTree.find(p => p._id?.toString() === category.parentId?.toString());
        return parent?.categoryName ?? '-';
    }, [categoryTree]);

    const fetchData = useCallback(async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: pageSize,
                ...(filters.search && { search: filters.search }),
                ...(filters.groups?.length > 0
                    ? { category: filters.groups[0] }
                    : filters.categories?.length > 0
                        ? { category: filters.categories[0] }
                        : {}),
                ...(filters.status && { status: filters.status }),
            };

            const res = await getAllMenuItems(params);

            const mapped = (res.data ?? []).map((item) => ({
                key: item._id,
                _id: item._id,
                image: item.images?.[0] ?? null,
                code: item.productCode,
                name: item.itemName,
                // Loại thực đơn = parent
                category: getParentName(item.category),
                // Nhóm hàng = chính category đó (luôn là child)
                group: item.category?.categoryName ?? '-',
                price: item.price,
                cost: item.costPrice,
                stock: item.stock ?? 0,
                description: item.description,
                availabilityStatus: item.availabilityStatus,
                raw: item,
            }));

            setData(mapped);
            setPagination(prev => ({
                ...prev,
                current: res.pagination.currentPage,
                pageSize: res.pagination.pageSize,
                total: res.pagination.totalItems,
            }));
        } catch (error) {
            console.error('Failed to fetch menu items:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, getParentName]);

    useEffect(() => {
        fetchData(1, pagination.pageSize);
    }, [filters, categoryTree]); // re-map khi categoryTree load xong

    const handleTableChange = (pag) => {
        fetchData(pag.current, pag.pageSize);
    };

    const handleColumnVisibilityChange = (columnKey, visible) => {
        setVisibleColumns(prev => ({ ...prev, [columnKey]: visible }));
    };

    const handleRowClick = (record) => {
        const key = record.key;
        setExpandedRowKeys(prev => prev.includes(key) ? [] : [key]);
    };

    const allColumns = [
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            width: 70,
            render: (src) => {

                return src ? (
                    <Image
                        src={`http://localhost:5000${src}`}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                        preview={false}
                    />
                ) : (
                    <div className="w-[50px] h-[50px] bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                        No img
                    </div>
                );
            },
            hidden: !visibleColumns.image,
        },
        {
            title: 'Mã hàng hóa',
            dataIndex: 'code',
            key: 'code',
            render: (text) => (
                <Space>
                    <StarOutlined className="text-gray-400" />
                    {text}
                </Space>
            ),
            hidden: !visibleColumns.code,
        },
        {
            title: 'Tên hàng',
            dataIndex: 'name',
            key: 'name',
            hidden: !visibleColumns.name,
        },
        {
            title: 'Loại thực đơn',
            dataIndex: 'category',
            key: 'category',
            hidden: !visibleColumns.category,
        },
        {
            title: 'Nhóm hàng',
            dataIndex: 'group',
            key: 'group',
            hidden: !visibleColumns.group,
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            key: 'price',
            render: (v) => v?.toLocaleString('vi-VN'),
            hidden: !visibleColumns.price,
        },
        {
            title: 'Giá vốn',
            dataIndex: 'cost',
            key: 'cost',
            render: (v) => v?.toLocaleString('vi-VN'),
            hidden: !visibleColumns.cost,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'availabilityStatus',
            key: 'status',
            render: (s) => {
                const map = STATUS_MAP[s] ?? { label: s, color: 'default' };
                return <Tag color={map.color}>{map.label}</Tag>;
            },
            hidden: !visibleColumns.status,
        },
    ].filter(col => !col.hidden);

    return (
        <>
            <ProductHeader
                selectedRowKeys={selectedRowKeys}
                hasSelected={selectedRowKeys.length > 0}
                visibleColumns={visibleColumns}
                onColumnVisibilityChange={handleColumnVisibilityChange}
                onDeselectAll={() => setSelectedRowKeys([])}
                onRefresh={() => fetchData(pagination.current, pagination.pageSize)}
                onCategoryChanged={() => fetchData(1, pagination.pageSize)}
            />

            <Table
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                columns={allColumns}
                dataSource={data}
                loading={loading}
                expandable={{
                    expandedRowRender: (record) => (
                        <ProductDetail
                            product={record.raw ?? record}
                            onRefresh={() => fetchData(pagination.current, pagination.pageSize)} // ← thêm
                        />
                    ),
                    expandedRowKeys,
                    onExpandedRowsChange: (keys) => setExpandedRowKeys(keys),
                    expandRowByClick: false,
                    expandIcon: () => null,
                }}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} sản phẩm`,
                }}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
                className="border-t"
                rowClassName="cursor-pointer hover:bg-gray-50"
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
            />
        </>
    );
}