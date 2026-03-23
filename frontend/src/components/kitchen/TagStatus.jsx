import { STATUS_CONFIG } from "@/consts/kitchenStatuses";

const TagStatus = ({ status }) => {
  if (!STATUS_CONFIG[status]) return null;
  const { label, color } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${color}`}
    >
      {label}
    </span>
  );
};

export default TagStatus;
