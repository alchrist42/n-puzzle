function simplifyArray (array) {
    const newArray = []
    array.map(it => newArray.push(...it))
    return newArray
}

export default async function getPuzzle(size) {
    const res = await fetch(`new_puzzle/${size}/1`)
    const text = await res.text()
    const parsed = JSON.parse(text)
    return {
        puzzle: simplifyArray(parsed.puzzle),
        goal: simplifyArray(parsed.goal)
    }
}

