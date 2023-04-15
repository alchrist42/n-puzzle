
export default async function getSolution(puzzle) {
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzle: puzzle})
    };
    const res = await fetch(`solver/`, requestOptions)
    const sol = await res.json();

    if (res.status === 200) {
        console.log(sol);
        return sol;
    }
    else {
        if ("error" in sol) {
            console.log(sol["error"] + "\n")
        }
        console.log("\nCouldn't solve this puzzle\n Can you?")
        // TODO: should we do anything?
    }
    
    return NaN;
}

