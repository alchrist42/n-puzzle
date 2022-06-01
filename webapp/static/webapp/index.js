const combination1 = [
    [1, 2, 3],
    [8, 0, 4],
    [7, 6, 5],
]
const combination2 = [
    [1, 2, 3, 4],
    [12, 13, 14, 5],
    [11, 0, 15, 6],
    [10, 9, 8, 7],
]
const combination21 = [
    [1, 2, 3, 4],
    [12, 0, 14, 5],
    [11, 13, 15, 6],
    [10, 9, 8, 7],
]
const combination22 = [
    [1, 2, 3, 4],
    [12, 14, 0, 5],
    [11, 13, 15, 6],
    [10, 9, 8, 7],
]
const combination23 = [
    [1, 2, 0, 4],
    [12, 14, 3, 5],
    [11, 13, 15, 6],
    [10, 9, 8, 7],
]
const combination3 = [
    [1, 2, 3, 4, 5, 6],
    [20, 33, 34, 35, 24 ,7],
    [19, 32, 0, 36, 25, 8],
    [18, 31, 38, 37, 26, 9],
    [17, 30, 29, 28, 27, 10],
    [16, 15, 14, 13, 12, 11],
]
const combination31 = [
    [1, 2, 3, 4, 5, 6],
    [20, 33, 34, 35, 24 ,7],
    [19, 0, 32, 36, 25, 8],
    [18, 31, 38, 37, 26, 9],
    [17, 30, 29, 28, 27, 10],
    [16, 15, 14, 13, 12, 11],
]
const combination32 = [
    [1, 2, 3, 4, 5, 6],
    [20, 33, 34, 35, 24 ,7],
    [0, 19, 32, 36, 25, 8],
    [18, 31, 38, 37, 26, 9],
    [17, 30, 29, 28, 27, 10],
    [16, 15, 14, 13, 12, 11],
]
const combination33 = [
    [1, 2, 3, 4, 5, 6],
    [0, 33, 34, 35, 24 ,7],
    [20, 19, 32, 36, 25, 8],
    [18, 31, 38, 37, 26, 9],
    [17, 30, 29, 28, 27, 10],
    [16, 15, 14, 13, 12, 11],
]
function createItem (width, num) {
    const div = document.createElement("div")
    if (num !== 0) {
        div.className = "item"
        div.innerHTML += num
    }
    div.style.width = `${width}%`
    div.style.height = `${width}%`
    div.style.fontSize = `${width * 1.4}px`
    console.log(div.style.fontSize)
    return div
}

function renderField (combination) {
    const field = document.getElementById("field")
    let child = field.lastElementChild;
    while (child) {
        field.removeChild(child);
        child = field.lastElementChild;
    }
    const itemSize = 100 / combination[0].length
    const arr = []
    combination.map(item => item.map(it => arr.push(it)))
    for (let it of arr) {
        const item = createItem(itemSize, it)
        field.appendChild(item)
    }
    return field
}

const listenerSolve2 = function () {
    setTimeout(() => {renderField(combination21)}, 200)
    setTimeout(() => {renderField(combination22)}, 400)
    setTimeout(() => {renderField(combination23)}, 600)
}
const listenerSolve3 = function () {
    setTimeout(() => {renderField(combination31)}, 200)
    setTimeout(() => {renderField(combination32)}, 400)
    setTimeout(() => {renderField(combination33)}, 600)
}


window.onload = function() {
    let currentCombination = combination1
    console.log(currentCombination)
    renderField(currentCombination)
    const buttonNewCombination = document.getElementById("btnNew")
    const buttonSolve = document.getElementById("btnSolve")
    buttonSolve.addEventListener('click', listenerSolve3)
    buttonNewCombination.addEventListener('click', function () {
        const isThree = currentCombination === combination3
        buttonSolve.removeEventListener('click', isThree ? listenerSolve3 : listenerSolve2)
        renderField(isThree ? combination2 : combination3)
        buttonSolve.addEventListener('click', isThree ? listenerSolve2 : listenerSolve3)
        currentCombination = isThree ? combination2 : combination3
    })
}

