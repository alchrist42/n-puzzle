import React, { useState, useEffect } from 'react';
import getPuzzle from "./api/getPuzzle";
import Board from "./components/Board";
import Buttons from "./components/Buttons"

import './App.css'

const Puzzle = () => {
    const [puzzle, setPuzzle] = useState([]);
    const [goal, setGoal] = useState([]);
    const [moves, setMoves] = useState(0);
    const [fieldSize, setFieldSize] = useState(3)

    // Заполнение начального поля пятнашек
    useEffect(() => {
        getPuzzle(fieldSize).then(newPuzzle => {
            setPuzzle(newPuzzle.puzzle);
            setGoal(newPuzzle.goal);
        })
    }, [fieldSize]);


    return (
        <div className="puzzle">
            <Buttons setFieldSize={setFieldSize}></Buttons>
            <Board puzzle={puzzle}
                   setPuzzle={setPuzzle}
                   goal={goal}
                   moves={moves}
                   fieldSize={fieldSize}
                   setMoves={setMoves}
            />
            <div className="moves">Moves: {moves}</div>
        </div>
    );
};

export default Puzzle;
