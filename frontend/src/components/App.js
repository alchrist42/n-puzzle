import React, {useEffect, useState} from 'react';
import {render} from "react-dom";

function App() {
    const [puzzle, setPuzzle] = useState([])

    async function getPuzzle() {
        const res = await fetch("new_puzzle/3")
        const text = await res.text()
        setPuzzle(JSON.parse(text).puzzle)
        // setPuzzle()
        console.log(typeof JSON.parse(text).puzzle)
    }

    useEffect(() => {
        getPuzzle()
    }, [])

    // useEffect(() => {
    //     if(puzzle.length)
    //         alert(puzzle)
    // }, [puzzle])

    return (
        <div>{puzzle}</div>
    );
}

export default App;
