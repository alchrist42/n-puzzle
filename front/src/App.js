import React, { useState, useEffect } from 'react';
import './Puzzle.css';
import getPuzzle from "./api/getPuzzle";

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

    // Обработчик клика по ячейке
    const handleClick = (index) => {
        const newPuzzle = [...puzzle];
        const emptyIndex = newPuzzle.indexOf(0);
        if (isMoveValid(index, emptyIndex)) {
            [newPuzzle[index], newPuzzle[emptyIndex]] = [newPuzzle[emptyIndex], newPuzzle[index]];
            setPuzzle(newPuzzle);
            setMoves(moves + 1);
            if (checkGoal(newPuzzle)) {
                // TODO: add draw gif
                console.log('you are the winner, the oleg')
            }
        }
    };

    const checkGoal = (newPuzzle) => {
        return (newPuzzle.toString() ===  goal.toString())
    }

    // Проверка возможности хода
    const isMoveValid = (index, emptyIndex) => {
        return (
            (index === emptyIndex - fieldSize || index === emptyIndex + fieldSize ||
                (index === emptyIndex - 1 && index % fieldSize !== 0) ||
                (index === emptyIndex + 1 && emptyIndex % fieldSize !== 0)) &&
            puzzle[index] !== 0 &&
            Math.abs(index - emptyIndex) === fieldSize || Math.abs(index - emptyIndex) === 1
        );
    };

    // Генерация ячеек поля
    const renderCell = (index) => {
        const percent = 100 / fieldSize
        const value = puzzle[index];
        const left = (index % fieldSize) * percent + '%';
        const top = Math.floor(index / fieldSize) * percent + '%';
        const backgroundColor = value !== 0 ? 'red': '';
        const className = `cell ${value === 0 ? 'empty' : ''}`;

        const width = `${300 / fieldSize}px`;
        const height = `${300 / fieldSize}px`;
        return (
            <div className={className} style={{ left, top, backgroundColor, width, height }} onClick={() => handleClick(index)}>
                {value !== 0 ? value : ''}
            </div>
        );
    };

    return (
        <div className="puzzle">
            <button onClick={() => setFieldSize(3)}>3x3</button>
            <button onClick={() => setFieldSize(4)}>4x4</button>
            <button onClick={() => setFieldSize(5)}>5x5</button>
            <div className="board">
                {[...Array(fieldSize * fieldSize).keys()].map((i) => renderCell(i))}
            </div>
            <div className="moves">Moves: {moves}</div>
        </div>
    );
};

export default Puzzle;
