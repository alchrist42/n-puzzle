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

  // Заполнение начального поля пятнашек
  useEffect(() => {
    getPuzzle(fieldSize).then((newPuzzle) => {
      setPuzzle(newPuzzle.puzzle);
      setGoal(newPuzzle.goal);
    });
  }, [fieldSize]);

  function solvePuzzle(moves) {
    const elementsToMove = [];
    moves.map((move) => {
      elementsToMove.push(move[0]);
    });
    if (elementsToMove.length) setSolution(elementsToMove);
  }

  function stopSolving() {
    setSolution(null);
  }

  return (
    <div className="mainContainer">
      <div className="container">
        <Buttons setFieldSize={setFieldSize} />
        <Board
          puzzle={puzzle}
          setPuzzle={setPuzzle}
          goal={goal}
          moves={moves}
          fieldSize={fieldSize}
          setMoves={setMoves}
          solution={solution}
          setSolution={setSolution}
        />
        <Solution
          puzzle={puzzle}
          solvePuzzle={solvePuzzle}
          stopSolving={stopSolving}
        />
      </div>

      <div className="moves">Moves: {moves}</div>
    </div>
  );
};

export default Puzzle;
