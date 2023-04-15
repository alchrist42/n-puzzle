import "../style/Buttons.css";
import mainStore from "../store/mainStore";
import { observer } from "mobx-react-lite";

function Buttons() {
  const { setFieldSize, pendingRequest } = mainStore;
  const sizes = [3, 4, 5, 6];
  return (
    <div className={"buttonsContainer"}>
      <div className={"title"}>Generate puzzle:</div>
      {sizes.map((size) => (
        <button
          onClick={() => {
            if (!pendingRequest) setFieldSize(size);
          }}
        >
          {size}x{size}
        </button>
      ))}
    </div>
  );
}

export default observer(Buttons);
