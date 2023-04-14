export default async function getPuzzle(size) {
    const res = await fetch(`http://127.0.0.1:8000/new_puzzle/${size}`)
    const text = await res.text()
    console.log(text)
    const parsed = JSON.parse(text).puzzle
    const puzzle = []
    parsed.map(it => puzzle.push(...it))

    return puzzle
}
