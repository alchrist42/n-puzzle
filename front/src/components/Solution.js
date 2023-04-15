import "../style/Buttons.css";
import getSolution from "../api/getSolution";

export default function Solution({ puzzle, solvePuzzle, stopSolving }) {
  async function requestSolution() {
    const solution = await getSolution(puzzle);
    solvePuzzle(solution.moves);
  }

  return (
    <div className={"solutionContainer"} style={{ width: "200px" }}>
      <button onClick={requestSolution}>solve!</button>
      <button onClick={stopSolving}>stop solving</button>
    </div>
  );
}
