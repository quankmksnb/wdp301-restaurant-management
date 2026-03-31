export default function ResultItem({
  icon,
  title,
  value,
  note,
  highlight,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-4 px-6 animate-pulse">
        <div className="p-3 rounded-full bg-gray-200 w-12 h-12" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-5 w-32 bg-gray-300 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 px-6">
      <div
        className={`p-3 rounded-full ${
          highlight
            ? "bg-green-100 text-green-600"
            : "bg-blue-100 text-blue-600"
        }`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p
          className={`text-xl font-semibold ${
            highlight ? "text-green-600" : ""
          }`}
        >
          {value}
        </p>
        <p className="text-xs text-gray-400">{note}</p>
      </div>
    </div>
  );
}
