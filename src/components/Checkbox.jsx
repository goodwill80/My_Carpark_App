import { useState } from "react";

function Checkbox({ label }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked((prev) => !prev)}
        />
        <span>{label}</span>
      </label>
    </div>
  );
}

export default Checkbox;
