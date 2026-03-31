export default function TooltipIcon({ icon, children, label, onClick }) {
  return (
    <div className="relative group flex items-center">

      <button
        onClick={onClick}
        className="p-1.5 rounded hover:bg-white/10 transition"
      >
        {icon || children}
      </button>

      <div
        className="
        absolute left-1/2 top-full
        -translate-x-1/2 mt-1
        bg-gray-900 text-white text-xs
        px-2 py-1 rounded
        opacity-0 group-hover:opacity-100
        transition
        whitespace-nowrap
        pointer-events-none
        shadow-md
        z-50
        "
      >
        {label}
      </div>
    </div>
  );
}