export default function FormSectionCard({ title, children }) {
  return (
    <div className="bg-white border rounded-md shadow-sm">
      <div className="bg-blue-100 text-blue-900 px-4 py-2 font-medium rounded-t-md">
        {title}
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}
