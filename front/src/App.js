import React, {useEffect, useState} from 'react';
import {render} from "react-dom";
import logo from './logo.svg';
import './App.css';

function App() {
  const [puzzle, setPuzzle] = useState([])

  async function getPuzzle() {
      const res = await fetch("new_puzzle/3")
      const text = await res.text()
      setPuzzle(JSON.parse(text).puzzle)
      // setPuzzle()
      console.log(JSON.parse(text).puzzle)
  }

  useEffect(() => {
      getPuzzle()
  }, [])

  // useEffect(() => {
  //     if(puzzle.length)
  //         alert(puzzle)
  // }, [puzzle])

  return (
      <div>dfsdfsd{puzzle}</div>
  );
}

export default App;
