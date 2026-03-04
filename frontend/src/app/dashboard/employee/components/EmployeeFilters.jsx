'use client';

import { Radio, Button } from 'antd';
import { useState } from 'react';

export default function EmployeeFilters() {
    const [selectedDept, setSelectedDept] = useState('all');
    const [selectedPosition, setSelectedPosition] = useState('all');

    return (
        <div className="w-60 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-y-auto">
            <div className="mb-5 pb-5 border-b border-gray-100">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Trạng thái nhân viên</h3>
                <Radio.Group value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                    <div className="flex flex-col space-y-2">
                        <Radio value="all">Đang làm việc</Radio>
                        <Radio value="quit">Đã nghỉ</Radio>
                    </div>
                </Radio.Group>
            </div>

            <div className="mb-5 pb-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Phòng ban</h3>
                    <Button type="link" size="small" className="text-xs p-0 h-auto">
                        +
                    </Button>
                </div>
                <div className="text-sm text-gray-500">
                    <input type="text" placeholder="Chọn phòng ban" className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition" />
                </div>
            </div>

            <div className="mb-2">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Chức danh</h3>
                    <Button type="link" size="small" className="text-xs p-0 h-auto">
                        +
                    </Button>
                </div>
                <div className="text-sm text-gray-500">
                    <input type="text" placeholder="Chọn chức danh" className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition" />
                </div>
            </div>
        </div>
    );
}
