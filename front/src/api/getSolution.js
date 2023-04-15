import simplifyArray from getPuzzle

export default async function getSolution(puzzle) {
    const res = await fetch(`solver`, )




    const text = await res.text()
    const sol = JSON.parse(text)

    return sol;
}

