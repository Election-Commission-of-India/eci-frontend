function renderFieldInput(field, newValue, setNewValue) {
  if (!field) return null;

  switch (field) {
    case "FULL_NAME":
    case "RELATIVE_NAME":
      return (
        <input
          type="text"
          className="input"
          placeholder="Enter new value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
      );

    case "DOB":
      return (
        <input
          type="date"
          className="input"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
      );

    case "GENDER":
      return (
        <select
          className="input"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        >
          <option value="">-- Select Gender --</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      );

    case "ADDRESS":
      return (
        <textarea
          className="input"
          rows={3}
          placeholder="Enter new address"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
      );

    default:
      return "Please Select Field To Correct";
  }
}


export default renderFieldInput;