export function PreviewField({ label, value }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="md:col-span-2 font-medium text-gray-900">
        {value || "-"}
      </span>
    </div>
  );
}
