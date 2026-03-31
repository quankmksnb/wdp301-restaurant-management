'use client';

import { Input, Checkbox, Select, DatePicker, Radio, Button, Form } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { CameraOutlined, EyeInvisibleOutlined, EyeTwoTone, DeleteOutlined } from '@ant-design/icons';

export default function EmployeeInfoTab({ form, isEdit = false, imageFile, onImageChange, existingImageUrl }) {
    const [showAdvanced, setShowAdvanced] = useState(isEdit);
    const [autoGenerateCode, setAutoGenerateCode] = useState(!isEdit);
    const [previewUrl, setPreviewUrl] = useState(existingImageUrl || null);
    const fileInputRef = useRef(null);

    // Sync preview URL when existingImageUrl changes (e.g., when opening different employee in edit modal)
    useEffect(() => {
        if (!imageFile) {
            setPreviewUrl(existingImageUrl || null);
        }
    }, [existingImageUrl, imageFile]);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return;
        }

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // Pass file to parent
        onImageChange?.(file);

        // Reset input so the same file can be selected again
        e.target.value = '';
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        if (previewUrl && !previewUrl.startsWith('http')) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        onImageChange?.(null);
    };

    return (
        <div className="flex gap-6">
            {/* Left sidebar - Photo upload */}
            <div className="w-32">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-40 cursor-pointer hover:border-blue-400 transition-colors overflow-hidden relative group"
                    onClick={handleImageClick}
                >
                    {previewUrl ? (
                        <>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <CameraOutlined className="text-white text-lg" />
                                <DeleteOutlined
                                    className="text-white text-lg hover:text-red-400"
                                    onClick={handleRemoveImage}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center p-4">
                            <CameraOutlined className="text-3xl text-gray-400 mb-2" />
                            <Button type="link" size="small" className="p-0">
                                Chọn ảnh
                            </Button>
                        </div>
                    )}
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
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            tooltip={isEdit ? 'Để trống nếu không muốn đổi mật khẩu' : 'Để trống sẽ mặc định là 123456'}
                        >
                            <Input.Password
                                placeholder={isEdit ? 'Để trống nếu không đổi' : 'Để trống mặc định 123456'}
                                iconRender={(visible) =>
                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Form.Item
                            name="role"
                            label="Vai trò"
                            initialValue="waiter"
                        >
                            <Select placeholder="Chọn vai trò">
                                <Select.Option value="waiter">Phục vụ</Select.Option>
                                <Select.Option value="receptionist">Lễ tân</Select.Option>
                                <Select.Option value="kitchenStaff">Nhà bếp</Select.Option>
                                <Select.Option value="manager">Quản lý</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { type: 'email', message: 'Email không hợp lệ' }
                            ]}
                        >
                            <Input placeholder="Nhập email" disabled={isEdit} />
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
                            </div>
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

                            <Form.Item name="address" label="Xã/Phường/Địa chỉ">
                                <Input placeholder="" />
                            </Form.Item>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
