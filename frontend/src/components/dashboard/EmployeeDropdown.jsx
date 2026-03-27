'use client';

import { Dropdown } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

export default function EmployeeDropdown({ isActive = false }) {
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
      <span
        className={`
          group relative pb-1 transition-all duration-300 cursor-pointer
          ${isActive ? "font-semibold" : "opacity-80 hover:opacity-100"}
        `}
      >
        Nhân viên
        <span
          className={`
            absolute left-0 bottom-0 h-[2px] bg-white transition-all duration-300
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}
        />
      </span>
    </Dropdown>
  );
}
