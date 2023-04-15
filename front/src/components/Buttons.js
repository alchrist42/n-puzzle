import "../style/Buttons.css";

export default function Buttons({ setFieldSize }) {
  const sizes = [3, 4, 5, 6];
  return (
    <div className={"buttonsContainer"}>
      <div className={"title"}>Generate puzzle:</div>
      {sizes.map((size) => (
        <button onClick={() => setFieldSize(size)}>
          {size}x{size}
        </button>
      ))}
    </div>
  );
}
