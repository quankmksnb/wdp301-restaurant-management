'use client';

import { Col, Row } from 'antd';
import FilterPanel from './components/FilterPanel';
import ProductTable from './components/ProductTable';

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-[80vw] mx-auto">
                <Row gutter={24}>
                    {/* LEFT FILTER */}
                    <Col span={4}>
                        <FilterPanel />
                    </Col>

                    {/* RIGHT CONTENT */}
                    <Col span={20}>
                        <div className="bg-white rounded-lg shadow-sm">
                            <ProductTable />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
}