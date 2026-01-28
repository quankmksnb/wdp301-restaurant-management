'use client';

import { Input, Checkbox, Select, DatePicker, Radio, Button } from 'antd';
import { useState } from 'react';
import { CameraOutlined } from '@ant-design/icons';

export default function EmployeeInfoTab() {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [autoGenerateCode, setAutoGenerateCode] = useState(true);

    return (
        <div className="flex gap-6">
            {/* Left sidebar - Photo upload */}
            <div className="w-32">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:border-blue-400 transition-colors">
                    <CameraOutlined className="text-3xl text-gray-400 mb-2" />
                    <Button type="link" size="small" className="p-0">
                        Chọn ảnh
                    </Button>
                </div>
            </div>

            {/* Right content */}
            <div className="flex-1">
                {/* Thông tin khởi tạo - Always visible */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-4">Thông tin khởi tạo</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Mã nhân viên</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Mã nhân viên tự động"
                                    disabled={autoGenerateCode}
                                    className="flex-1"
                                />
                            </div>
                            <Checkbox
                                checked={autoGenerateCode}
                                onChange={(e) => setAutoGenerateCode(e.target.checked)}
                                className="mt-2"
                            >
                                Mã nhân viên tự động
                            </Checkbox>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Tên nhân viên</label>
                            <Input placeholder="hoàng" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm mb-1">Số điện thoại</label>
                            <Input placeholder="0375559358" />
                        </div>
                    </div>
                </div>

                {/* Collapsible toggle */}
                <div className="text-center mb-4">
                    <Button
                        type="link"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-blue-500"
                    >
                        {showAdvanced ? '▲' : '▼'} Ẩn thông tin
                    </Button>
                </div>

                {/* Advanced sections - Collapsible */}
                {showAdvanced && (
                    <>
                        {/* Thông tin công việc */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold mb-4">Thông tin công việc</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Ngày bắt đầu làm việc</label>
                                    <DatePicker placeholder="--/--/----" className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Phòng ban</label>
                                    <div className="flex gap-2">
                                        <Select placeholder="Chọn Phòng ban" className="flex-1" />
                                        <Button>+</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm mb-1">Chức danh</label>
                                    <div className="flex gap-2">
                                        <Select placeholder="Chọn Chức danh" className="flex-1" />
                                        <Button>+</Button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Tài khoản đăng nhập</label>
                                    <div className="flex gap-2">
                                        <Select placeholder="Chọn Tài khoản" className="flex-1" />
                                        <Button>+</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm mb-1">Ghi chú</label>
                                <Input.TextArea rows={3} placeholder="" />
                            </div>
                        </div>

                        {/* Thông tin cá nhân */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold mb-4">Thông tin cá nhân</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Số CMND/CCCD</label>
                                    <Input placeholder="" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Ngày sinh</label>
                                    <DatePicker placeholder="--/--/----" className="w-full" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm mb-1">Giới tính</label>
                                <Radio.Group>
                                    <Radio value="male">Nam</Radio>
                                    <Radio value="female">Nữ</Radio>
                                </Radio.Group>
                            </div>
                        </div>

                        {/* Thông tin liên hệ */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold mb-4">Thông tin liên hệ</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Tỉnh/Thành phố</label>
                                    <Select placeholder="Chọn Tỉnh/Thành phố" className="w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Facebook</label>
                                    <Input placeholder="" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm mb-1">Xã/Phường/Địa chỉ</label>
                                <Input placeholder="" />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
