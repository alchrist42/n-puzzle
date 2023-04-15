import React, { useState, useEffect } from "react";
import getPuzzle from "./api/getPuzzle";
import Board from "./components/Board";
import Buttons from "./components/Buttons";
import Solution from "./components/Solution";

import "./App.css";

const Puzzle = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [goal, setGoal] = useState([]);
  const [moves, setMoves] = useState(0);
  const [fieldSize, setFieldSize] = useState(3);
  const [solution, setSolution] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(false);

  function resetState() {
    setPuzzle([]);
    setGoal([]);
    setMoves(0);
    setSolution(null);
  }

  // Заполнение начального поля пятнашек
  useEffect(() => {
    resetState();
    getPuzzle(fieldSize).then((newPuzzle) => {
      setPuzzle(newPuzzle.puzzle);
      setGoal(newPuzzle.goal);
    });
  }, [fieldSize]);

  function solvePuzzle(moves) {
    const elementsToMove = [];
    moves.map((move) => {
      return elementsToMove.push(move[0]);
    });
    if (elementsToMove.length) setSolution(elementsToMove);
  }

  function stopSolving() {
    setSolution(null);
  }

  return (
    <div className="mainContainer">
      <div className="container">
        <Buttons setFieldSize={setFieldSize} pendingRequest={pendingRequest} />
        <Board
          puzzle={puzzle}
          setPuzzle={setPuzzle}
          goal={goal}
          moves={moves}
          fieldSize={fieldSize}
          setMoves={setMoves}
          solution={solution}
          setSolution={setSolution}
          pendingRequest={pendingRequest}
        />
        <Solution
          puzzle={puzzle}
          solution={solution}
          pendingRequest={pendingRequest}
          setPendingRequest={setPendingRequest}
          solvePuzzle={solvePuzzle}
          stopSolving={stopSolving}
          fieldSize={fieldSize}
        />
      </div>

      <div className="moves">Moves: {moves}</div>
    </div>
  );
};

export default Puzzle;
