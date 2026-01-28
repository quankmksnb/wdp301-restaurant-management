'use client';

import { Input, Checkbox, Select, DatePicker, Radio, Button, Form } from 'antd';
import { useState } from 'react';
import { CameraOutlined } from '@ant-design/icons';

export default function EmployeeInfoTab({ form, isEdit = false }) {
    const [showAdvanced, setShowAdvanced] = useState(isEdit);
    const [autoGenerateCode, setAutoGenerateCode] = useState(!isEdit);

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
                            <Form.Item
                                name="code"
                                label="Mã nhân viên"
                                rules={[{ required: !autoGenerateCode, message: 'Vui lòng nhập mã nhân viên' }]}
                            >
                                <Input
                                    placeholder="Mã nhân viên tự động"
                                    disabled={autoGenerateCode}
                                />
                            </Form.Item>
                            {!isEdit && (
                                <Checkbox
                                    checked={autoGenerateCode}
                                    onChange={(e) => setAutoGenerateCode(e.target.checked)}
                                    className="mt-[-8px]"
                                >
                                    Mã nhân viên tự động
                                </Checkbox>
                            )}
                        </div>
                        <Form.Item
                            name="name"
                            label="Tên nhân viên"
                            rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
                        >
                            <Input placeholder="Nhập tên nhân viên" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </div>
                </div>

                {/* Collapsible toggle */}
                <div className="text-center mb-4">
                    <Button
                        type="link"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-blue-500"
                    >
                        {showAdvanced ? '▲ Ẩn thông tin' : '▼ Hiện thêm thông tin'}
                    </Button>
                </div>

                {/* Advanced sections - Collapsible */}
                {showAdvanced && (
                    <>
                        {/* Thông tin công việc */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold mb-4">Thông tin công việc</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="startDate" label="Ngày bắt đầu làm việc">
                                    <DatePicker placeholder="--/--/----" className="w-full" />
                                </Form.Item>
                                <Form.Item name="department" label="Phòng ban">
                                    <div className="flex gap-2">
                                        <Select placeholder="Chọn Phòng ban" className="flex-1" />
                                        <Button>+</Button>
                                    </div>
                                </Form.Item>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <Form.Item name="position" label="Chức danh">
                                    <div className="flex gap-2">
                                        <Select placeholder="Chọn Chức danh" className="flex-1" />
                                        <Button>+</Button>
                                    </div>
                                </Form.Item>
                                <Form.Item name="account" label="Tài khoản đăng nhập">
                                    <div className="flex gap-2">
                                        <Select placeholder="Chọn Tài khoản" className="flex-1" />
                                        <Button>+</Button>
                                    </div>
                                </Form.Item>
                            </div>

                            <Form.Item name="notes" label="Ghi chú" className="mt-4">
                                <Input.TextArea rows={3} placeholder="" />
                            </Form.Item>
                        </div>

                        {/* Thông tin cá nhân */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold mb-4">Thông tin cá nhân</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="idNumber" label="Số CMND/CCCD">
                                    <Input placeholder="" />
                                </Form.Item>
                                <Form.Item name="birthDate" label="Ngày sinh">
                                    <DatePicker placeholder="--/--/----" className="w-full" />
                                </Form.Item>
                            </div>

                            <Form.Item name="gender" label="Giới tính" className="mt-4">
                                <Radio.Group>
                                    <Radio value="Nam">Nam</Radio>
                                    <Radio value="Nữ">Nữ</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </div>

                        {/* Thông tin liên hệ */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h3 className="font-semibold mb-4">Thông tin liên hệ</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="city" label="Tỉnh/Thành phố">
                                    <Select placeholder="Chọn Tỉnh/Thành phố" className="w-full" />
                                </Form.Item>
                                <Form.Item name="facebook" label="Facebook">
                                    <Input placeholder="" />
                                </Form.Item>
                            </div>

                            <Form.Item name="address" label="Xã/Phường/Địa chỉ" className="mt-4">
                                <Input placeholder="" />
                            </Form.Item>

                            <Form.Item name="email" label="Email" className="mt-4">
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
