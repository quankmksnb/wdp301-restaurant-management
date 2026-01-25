import { Layout } from "antd";

export default function DashboardLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <header>Header</header>
      {children}
    </Layout>
  );
}
