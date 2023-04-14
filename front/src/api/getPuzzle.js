export default async function getPuzzle(size) {
    const res = await fetch(`new_puzzle/${size}/1`)
    const text = await res.text()
    console.log(text)
    const parsed = JSON.parse(text)
    const puzzle = []
    parsed.puzzle.map(it => puzzle.push(...it))
    const goal_puzzle = []
    parsed.goal.map(it => goal_puzzle.push(...it))


    return {"puzzle": puzzle, "goal": goal_puzzle}
}

