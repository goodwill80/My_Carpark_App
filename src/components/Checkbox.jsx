function Checkbox({ label, handleChange, value }) {
  return (
    <>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text mr-3 text-md font-semibold">{label}</span>
          <input
            type="checkbox"
            onChange={handleChange}
            className="checkbox checkbox-primary"
            checked={value}
          />
        </label>
      </div>
    </>
  );
}

export default Checkbox;
