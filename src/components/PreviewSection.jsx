export function PreviewSection({ title, children }) {
  return (
    <div className="border rounded-md bg-white shadow-sm">
      <div className="bg-blue-100 text-blue-900 px-4 py-2 font-semibold rounded-t-md">
        {title}
      </div>
      <div className="p-4 grid gap-3">
        {children}
      </div>
    </div>
  );
}
