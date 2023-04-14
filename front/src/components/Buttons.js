import '../style/Buttons.css'

export default function Buttons({setFieldSize}) {
    const sizes = [3, 4, 5, 6];
    return (
      <div className={'buttonsContainer'}>
        {sizes.map(size =>
            <button onClick={() => setFieldSize(size)}>{size}x{size}</button>
        )}
      </div>
    );
}
