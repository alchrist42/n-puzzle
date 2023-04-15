import "../style/Buttons.css";
import "../style/Solution.css";
import getSolution from "../api/getSolution";
import { useEffect, useState } from "react";
import { Grid } from "react-loader-spinner";
import mainStore from "../store/mainStore";
import { observer } from "mobx-react-lite";

const SolutionDetailsTable = ({ details }) => {
  return (
    <table className={"tableContainer tableBorder"}>
      <thead>
        <tr>
          <th className={"tableBorder"}>Key</th>
          <th className={"tableBorder"}>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(details).map(([key, value]) => (
          <tr key={key}>
            <td className={"tableBorder"}>{key}</td>
            <td className={"tableBorder"}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function Solution({ solvePuzzle, stopSolving }) {
  const [solutionDetails, setSolutionDetails] = useState(null);
  const { puzzle, solution, fieldSize, pendingRequest, setPendingRequest } =
    mainStore;

  useEffect(() => {
    setSolutionDetails(null);
  }, [fieldSize]);

  async function requestSolution() {
    setPendingRequest(true);
    setSolutionDetails(null);
    const solution = await getSolution(puzzle);
    setPendingRequest(false);
    solvePuzzle(solution.moves);
    solution.moves = solution.moves.length;
    setSolutionDetails(solution);
  }

  return (
    <div className={"solutionContainer"}>
      {solutionDetails && <SolutionDetailsTable details={solutionDetails} />}
      {solution ? (
        <button onClick={stopSolving}>stop solving</button>
      ) : pendingRequest ? (
        <Grid
          height="80"
          width="80"
          color="#742f06"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      ) : (
        <button onClick={requestSolution}>solve!</button>
      )}
    </div>
  );
}

export default observer(Solution);
