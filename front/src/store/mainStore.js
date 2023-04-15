import { action, makeAutoObservable, observable } from "mobx";
import getGif from "../api/getGif";
import getPuzzle from "../api/getPuzzle";

class mainStore {
  puzzle = [];
  goal = [];
  solution = [];
  fieldSize = 3;
  moves = 0;
  pendingRequest = false;
  successGif = null;
  solved = false;

  constructor() {
    makeAutoObservable(this, {
      puzzle: observable,
      goal: observable,
      solution: observable,
      fieldSize: observable,
      moves: observable,
      pendingRequest: observable,
      successGif: observable,
      solved: observable,

      getPuzzle: action.bound,
      setPuzzle: action.bound,
      setGoal: action.bound,
      setSolution: action.bound,
      setFieldSize: action.bound,
      setMoves: action.bound,
      setPendingRequest: action.bound,
      getSuccessGif: action.bound,
      setSolved: action.bound,
    });
  }

  getPuzzle() {
    getPuzzle(this.fieldSize).then((newPuzzle) => {
      this.setPuzzle(newPuzzle.puzzle);
      this.setGoal(newPuzzle.goal);
      this.setMoves(0);
    });
  }

  setPuzzle(puzzle) {
    this.puzzle = puzzle;
  }

  setSolution(solution) {
    this.solution = solution;
  }

  setGoal(goal) {
    this.goal = goal;
  }

  setFieldSize(fieldSize) {
    this.fieldSize = fieldSize;
    this.getPuzzle();
    this.setSolved(false);
  }

  setPendingRequest(pendingRequest) {
    this.pendingRequest = pendingRequest;
  }

  setSolved(solved) {
    this.solved = solved;
  }

  setMoves(moves) {
    this.moves = moves;
  }

  async getSuccessGif() {
    const res = await getGif();
    this.successGif = res.data.images.fixed_width.url;
    this.setSolved(true);
  }
}

export default mainStore = new mainStore();
