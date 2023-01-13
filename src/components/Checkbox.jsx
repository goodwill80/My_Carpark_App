import { useState } from "react";

function Checkbox({ label }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      <label>
        <input
          onChange={() => setIsChecked((prev) => !prev)}
          type="checkbox"
          value={isChecked}
        />
        <span>{label}</span>
      </label>
    </div>
  );
}

export default Checkbox;
