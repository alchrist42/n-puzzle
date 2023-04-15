import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import Buttons from "./components/Buttons";
import Solution from "./components/Solution";
import mainStore from "./store/mainStore";

import "./App.css";
import { observer } from "mobx-react-lite";

const App = () => {
  const { setSolution, successGif, solved, getPuzzle, moves } = mainStore;

  // Заполнение начального поля пятнашек
  useEffect(() => {
    getPuzzle();
  }, []);

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
        <Buttons />
        {solved ? (
          <div className={"congratsContainer"}>
            You are the champion, Oleg
            <img src={successGif} alt={"You are the champion, Oleg"} />
          </div>
        ) : (
          <Board />
        )}
        <Solution solvePuzzle={solvePuzzle} stopSolving={stopSolving} />
      </div>

      <div className="moves">Moves: {moves}</div>
    </div>
  );
};

export default observer(App);
