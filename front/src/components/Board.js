import React, { useEffect, useState } from "react";
import "../style/Board.css";
import mainStore from "../store/mainStore";
import { observer } from "mobx-react-lite";

function Board() {
  const [currentTimeout, setCurrentTimeout] = useState(0);
  const {
    puzzle,
    setPuzzle,
    solution,
    goal,
    setSolution,
    fieldSize,
    pendingRequest,
    getSuccessGif,
    moves,
    setMoves,
  } = mainStore;

  useEffect(() => {
    if (solution) {
      setCurrentTimeout(
        setTimeout(() => {
          handleClick(puzzle.indexOf(solution[0]));
          setSolution(solution?.length > 1 ? solution.slice(1) : null);
        }, 500)
      );
    } else clearTimeout(currentTimeout);
  }, [solution]);

  // Обработчик клика по ячейке
  const handleClick = (index) => {
    if (checkGoal(puzzle) || pendingRequest) {
      return;
    }
    const newPuzzle = [...puzzle];
    const emptyIndex = newPuzzle.indexOf(0);
    if (isMoveValid(index, emptyIndex)) {
      [newPuzzle[index], newPuzzle[emptyIndex]] = [
        newPuzzle[emptyIndex],
        newPuzzle[index],
      ];
      setPuzzle(newPuzzle);
      setMoves(moves + 1);
      if (checkGoal(newPuzzle)) {
        getSuccessGif().then();
      }
    }
  };

  const checkGoal = (newPuzzle) => {
    return newPuzzle.toString() === goal.toString();
  };

  // Проверка возможности хода
  const isMoveValid = (index, emptyIndex) => {
    return (
      ((index === emptyIndex - fieldSize ||
        index === emptyIndex + fieldSize ||
        (index === emptyIndex - 1 && index % fieldSize !== 0) ||
        (index === emptyIndex + 1 && emptyIndex % fieldSize !== 0)) &&
        puzzle[index] !== 0 &&
        Math.abs(index - emptyIndex) === fieldSize) ||
      Math.abs(index - emptyIndex) === 1
    );
  };

  // Генерация ячеек поля
  const renderCell = (index) => {
    const percent = 100 / fieldSize;
    const value = puzzle[index];
    const left = (index % fieldSize) * percent + "%";
    const top = Math.floor(index / fieldSize) * percent + "%";
    const backgroundColor = value !== 0 ? "#441a02" : "";
    const className = ` ${value === 0 ? "empty" : "cell"}`;
    const size = 400 / fieldSize - 10;

    const width = `${size}px`;
    const height = `${size}px`;
    return (
      <div
        className={className}
        style={{ left, top, backgroundColor, width, height }}
        onClick={() => {
          if (!solution) handleClick(index);
        }}
      >
        {value !== 0 ? value : ""}
      </div>
    );
  };

  return (
    <div className="board">
      {[...Array(fieldSize * fieldSize).keys()].map((i) => renderCell(i))}
    </div>
  );
}

export default observer(Board);