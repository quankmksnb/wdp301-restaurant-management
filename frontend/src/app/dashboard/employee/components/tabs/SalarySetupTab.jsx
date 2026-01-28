'use client';

import MainSalaryForm from '../salary/MainSalaryForm';
import OvertimeSalaryForm from '../salary/OvertimeSalaryForm';
import BonusForm from '../salary/BonusForm';
import CommissionForm from '../salary/CommissionForm';
import AllowanceForm from '../salary/AllowanceForm';
import DeductionForm from '../salary/DeductionForm';
import { Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export default function SalarySetupTab() {
    return (
        <div className="space-y-6">
            {/* Lương chính */}
            <MainSalaryForm />

            {/* Mẫu lương */}
            <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Mẫu lương</h3>
                        <InfoCircleOutlined className="text-gray-400" />
                    </div>
                    <Select
                        placeholder="Chọn mẫu lương có sẵn"
                        className="w-80"
                        options={[
                            { value: 'template1', label: 'Mẫu lương 1' },
                            { value: 'template2', label: 'Mẫu lương 2' },
                        ]}
                    />
                </div>
            </div>

            {/* Thưởng */}
            <BonusForm />

            {/* Hoa hồng */}
            <CommissionForm />

            {/* Phụ cấp */}
            <AllowanceForm />

            {/* Giảm trừ */}
            <DeductionForm />
        </div>
    );
}
