const sections = [
  { id: "location", label: "Location Details" },
  { id: "personal", label: "Personal Details" },
  { id: "address", label: "Address Details" },
  { id: "dob", label: "DOB & Gender" },
  { id: "photo", label: "Upload Photo" },
  { id: "submit", label: "Preview & Submit" },
];

export default function Form6Sidebar() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="sticky top-24 bg-white border rounded-md shadow-sm p-2 space-y-1">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className="w-full text-left px-3 py-2 text-sm rounded hover:bg-blue-50 hover:text-blue-700 transition">
          {s.label}
        </button>
      ))}
    </div>
  );
}
