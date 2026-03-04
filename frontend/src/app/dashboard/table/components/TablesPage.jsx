"use client";

import { Row, Col } from "antd";
import TableFilterPanel from "./components/TableFilterPanel";
import TableManagement from "./components/TableManagement";

export default function TablesPage() {
  return (
    <div className="min-h-screen py-6">
      <div className="max-w-[80vw] mx-auto">
        <Row gutter={24}>
          <Col span={4}>
            <TableFilterPanel />
          </Col>

          <Col span={20}>
            <div className="bg-white rounded-lg shadow-sm">
              <TableManagement />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
