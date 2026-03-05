'use client';

import { Col, Row } from 'antd';
import FilterPanel from './components/FilterPanel';
import ProductTable from './components/ProductTable';
import { useState } from 'react';

export default function ProductsPage() {
    const [filters, setFilters] = useState({});
    return (
        <div className="min-h-screen py-6">
            <div className="max-w-[80vw] mx-auto">
                <Row gutter={24}>
                    {/* LEFT FILTER */}
                    <Col span={5}>
                        <FilterPanel onFilterChange={setFilters} />
                    </Col>

                    {/* RIGHT CONTENT */}
                    <Col span={19}>
                        <div className="bg-white rounded-lg shadow-sm">
                            <ProductTable filters={filters} />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}