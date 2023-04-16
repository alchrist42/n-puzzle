import React, { useState } from "react";
import "../style/Switch.css";
import { getRandomColor } from "../functions";
import mainStore from "../store/mainStore";

const Switch = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { setEpileptic } = mainStore;

  const handleToggle = () => {
    setEpileptic(!isChecked);
    setIsChecked(!isChecked);
  };

  return (
    <div
      className={`switch ${isChecked ? "switch--on" : "switch--off"}`}
      style={{
        backgroundColor: isChecked ? `#${getRandomColor()}` : "#dcdcdc",
      }}
      onClick={handleToggle}
    >
      <div
        className="switch__knob"
        style={{
          backgroundColor: isChecked ? `#${getRandomColor()}` : "#fff",
        }}
      ></div>
    </div>
  );
};

export default Switch;
