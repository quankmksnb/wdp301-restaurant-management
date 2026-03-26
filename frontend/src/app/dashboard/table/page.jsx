"use client";

import { Row, Col } from "antd";
import { useState } from "react";

import TableFilterPanel from "../../../components/dashboard/table/TableFilterPanel";
import TableManagement from "../../../components/dashboard/table/TableManagement";

export default function Page() {
  const [filters, setFilters] = useState({
    area: "all",
    status: "all",
    search: "",
  });

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-[80vw] mx-auto">
        <Row gutter={24}>
          <Col span={5}>
            <TableFilterPanel onFilterChange={setFilters} />
          </Col>

          <Col span={19}>
            <div className="bg-white rounded-lg shadow-sm">
              <TableManagement filters={filters} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
