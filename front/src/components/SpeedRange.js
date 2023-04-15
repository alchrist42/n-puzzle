import "../style/SpeedRange.css";
import mainStore from "../store/mainStore";
import { observer } from "mobx-react-lite";




const handleChangeValue = (e) => {
  const {setSpeed} = mainStore;
  const newSpeed = e.target.value;
  setSpeed(newSpeed);
};

function SpeedRange() {
    const {speed} = mainStore;
    return (
    <div className={"speedRange"}>
      <h5>POWER {speed * 5}%</h5>
      <input
        type="range"
        min={1}
        max={20}
        onChange={(e) => handleChangeValue(e)}
        value={speed}
      />
    </div>
    )
}

export default observer(SpeedRange);