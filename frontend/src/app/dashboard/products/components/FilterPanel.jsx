'use client';

import { Input, Checkbox, Collapse, Radio, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { getCategoryTree } from '@/services/menuCategoryService';

export default function FilterPanel({ onFilterChange }) {
    const [categoryTree, setCategoryTree] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedParents, setSelectedParents] = useState([]);
    const [selectedChildren, setSelectedChildren] = useState([]);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await getCategoryTree();
                // handle cả 2 trường hợp: trả array trực tiếp hoặc wrap trong .data
                const data = Array.isArray(res) ? res : (res?.data ?? []);
                setCategoryTree(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setCategoryTree([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        onFilterChange?.({ search, categories: selectedParents, groups: selectedChildren, status : status || null });
    }, [search, selectedParents, selectedChildren, status]);

    const availableChildren = categoryTree
        .filter(parent => selectedParents.length === 0 || selectedParents.includes(parent._id))
        .flatMap(parent => parent.children || [])

    const handleParentChange = (values) => {
        setSelectedParents(values);
        // bỏ child không còn thuộc parent đã chọn
        const validChildIds = categoryTree
            .filter(p => values.includes(p._id))
            .flatMap(p => p.children || [])
            .map(c => c._id);
        setSelectedChildren(prev => prev.filter(id => validChildIds.includes(id)));
    };

    const collapseClass = `
        bg-white rounded-lg shadow-sm
        [&_.ant-collapse-header]:font-medium
        [&_.ant-collapse-item]:border-0
    `;

    const renderCollapse = (title, content) => (
        <Collapse
            defaultActiveKey={['1']}
            bordered={false}
            expandIconPlacement="end"
            className={collapseClass}
            style={{ background: '#fff', marginBottom: 16 }}
            items={[{ key: '1', label: title, children: content }]}
        />
    );

    return (
        <div className="space-y-[10px]">
            {/* TÌM KIẾM */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="font-medium mb-2">Tìm kiếm</div>
                <Input
                    placeholder="Theo mã, tên hàng"
                    size="large"
                    className="w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                />
            </div>

            {/* LOẠI THỰC ĐƠN */}
            {renderCollapse(
                'Loại thực đơn',
                loading ? <Spin size="small" /> : (
                    <Checkbox.Group
                        className="flex flex-col space-y-3"
                        value={selectedParents}
                        onChange={handleParentChange}
                    >
                        {categoryTree.map(parent => (
                            <Checkbox key={parent._id} value={parent._id}>
                                {parent.categoryName}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                )
            )}

            {/* NHÓM HÀNG */}
            {renderCollapse(
                'Nhóm hàng',
                loading ? <Spin size="small" /> : (
                    <>
                        <Checkbox.Group
                            className="flex flex-col space-y-2"
                            value={selectedChildren}
                            onChange={setSelectedChildren}
                        >
                            {availableChildren.length > 0 ? (
                                availableChildren.map(child => (
                                    <Checkbox key={child._id} value={child._id}>
                                        {child.categoryName}
                                    </Checkbox>
                                ))
                            ) : (
                                <span className="text-gray-400 text-sm">Không có nhóm hàng</span>
                            )}
                        </Checkbox.Group>
                    </>
                )
            )}

            {/* TRẠNG THÁI */}
            {renderCollapse(
                'Trạng thái',
                <Radio.Group
                    className="flex flex-col space-y-3"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <Radio value="">Tất cả</Radio>
                    <Radio value="available">Còn kinh doanh</Radio>
                    <Radio value="unavailable">Ngừng kinh doanh</Radio>
                    <Radio value="out_of_stock">Hết hàng</Radio>
                </Radio.Group>
            )}
        </div>
    );
}