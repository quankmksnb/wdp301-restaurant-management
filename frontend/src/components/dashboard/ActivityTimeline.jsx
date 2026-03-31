"use client";
import { Timeline, Spin, ConfigProvider, Empty } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const ActivityTimeline = ({ activities, loading }) => {
  const getTimelineColor = (type) => {
    switch (type) {
      case "payment":
        return "#10b981"; // Xanh lá
      case "reservation":
        return "#3b82f6"; // Xanh dương
      case "order":
        return "#f59e0b"; // Cam
      default:
        return "#6b7280"; // Xám
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 h-[calc(100vh-100px)] flex flex-col">
      <h3 className="font-semibold text-sm mb-6 uppercase text-gray-500 border-b pb-2">
        Lịch sử hoạt động
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div style={{ textAlign: "center" }}>
              <Spin size="small" />
              <div>Đang tải...</div>
            </div>
          </div>
        ) : activities && activities.length > 0 ? (
          <ConfigProvider theme={{ token: { fontSize: 13, marginXXS: 4 } }}>
            <Timeline
              items={activities.map((item) => ({
                color: getTimelineColor(item.type),
                // ✅ dùng content
                content: (
                  <div className="pb-2">
                    <p className="m-0 leading-relaxed text-gray-700">
                      <span className="font-bold text-gray-900">
                        Nhân viên {item.user?.fullName || "Hệ thống"}
                      </span>{" "}
                      {item.content}
                    </p>
                    <span className="text-[11px] text-gray-400">
                      {dayjs(item.createdAt).fromNow()}
                    </span>
                  </div>
                ),
              }))}
            />
          </ConfigProvider>
        ) : (
          <Empty
            description="Chưa có hoạt động nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
