import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import Buttons from "./components/Buttons";
import Solution from "./components/Solution";
import SpeedRange from "./components/SpeedRange";
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
            <h3>You are the champion, Oleg</h3>
            <img src={successGif} alt={"You are the champion, Oleg"} />
            <p>You are not Oleg? It's a pity</p>
          </div>
        ) : (
          <Board />
        )}
        <Solution solvePuzzle={solvePuzzle} stopSolving={stopSolving} />
      </div>
      <SpeedRange />
      <div className="moves">Moves: {moves}</div>
    </div>
  );
};

export default observer(App);
