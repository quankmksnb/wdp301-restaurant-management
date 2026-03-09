'use client';

import { Dropdown } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

export default function EmployeeDropdown() {
  const [open, setOpen] = useState(false);

  const items = [
    {
      key: 'employee-list',
      label: (
        <Link href="/dashboard/employee" className="block px-3 py-2 text-sm">
          Danh sách nhân viên
        </Link>
      ),
    },
    {
      key: 'schedule',
      label: (
        <Link href="/dashboard/employee/schedule" className="block px-3 py-2 text-sm">
          Lịch làm việc
        </Link>
      ),
    },
    {
      key: 'settings',
      label: (
        <Link href="/dashboard/employee/settings" className="block px-3 py-2 text-sm">
          Thiết lập nhân viên
        </Link>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      trigger={['hover']}
      open={open}
      onOpenChange={setOpen}
    >
      <span className="text-white font-semibold px-4.25 py-2.5 text-[14px] cursor-pointer hover:rounded-sm hover:bg-[#0060d0] transition-all duration-250 inline-block">
        Nhân viên
      </span>
    </Dropdown>
  );
}
