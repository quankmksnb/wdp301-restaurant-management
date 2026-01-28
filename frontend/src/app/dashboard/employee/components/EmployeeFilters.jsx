'use client';

import { Radio, Button } from 'antd';
import { useState } from 'react';

export default function EmployeeFilters() {
    const [selectedDept, setSelectedDept] = useState('all');
    const [selectedPosition, setSelectedPosition] = useState('all');

    return (
        <div className="w-60 bg-white border-r border-gray-200 p-4">
            <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Trạng thái nhân viên</h3>
                <Radio.Group value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                    <div className="flex flex-col space-y-2">
                        <Radio value="all">Đang làm việc</Radio>
                        <Radio value="quit">Đã nghỉ</Radio>
                    </div>
                </Radio.Group>
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Phòng ban</h3>
                    <Button type="link" size="small" className="text-xs p-0 h-auto">
                        +
                    </Button>
                </div>
                <div className="text-sm text-gray-500">
                    <input type="text" placeholder="Chọn phòng ban" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Chức danh</h3>
                    <Button type="link" size="small" className="text-xs p-0 h-auto">
                        +
                    </Button>
                </div>
                <div className="text-sm text-gray-500">
                    <input type="text" placeholder="Chọn chức danh" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                </div>
            </div>
        </div>
    );
}
