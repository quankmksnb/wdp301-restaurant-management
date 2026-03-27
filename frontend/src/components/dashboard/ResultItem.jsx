export default function ResultItem({
  icon,
  title,
  value,
  note,
  highlight,
}) {
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
