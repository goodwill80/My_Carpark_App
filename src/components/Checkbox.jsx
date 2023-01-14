function Checkbox({
  label,
 handleChange
}) {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          onChange={handleChange}
        />
        <span>{label}</span>
      </label>
    </div>
  );
}

export default Checkbox;
