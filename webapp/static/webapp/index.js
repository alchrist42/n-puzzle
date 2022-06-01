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
    div.id = num
    return div
}

function createBtn (title) {
    const btn = document.createElement("button")
    btn.innerHTML += title
    btn.id = title
    return btn
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


function makeEaseOut(timing) {
    return function(timeFraction) {
        return 1 - timing(1 - timeFraction);
    }
}

function bounce(timeFraction) {
    for (let a = 0, b = 1; 1; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
        }
    }
}

let bounceEaseOut = makeEaseOut(bounce);

const listenerSolve2 = function () {
    animate({
        duration: 300,
        timing: bounceEaseOut,
        draw: function(progress) {
            const elem = document.getElementById('9')
            elem.style.bottom = progress * 124 + 'px';
        }
    });
}
const listenerSolve3 = function () {
    animate({
        duration: 300,
        timing: bounceEaseOut,
        draw: function(progress) {
            const elem = document.getElementById('32')
            elem.style.left = progress * 83 + 'px';
        }
    });
}

const getNewPuzzle = async (size) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const res = await fetch(`http://127.0.0.1:8000/new_pazzle/${size}`, requestOptions)
    return res.text()
}

const createButtons = () => {
    const container = document.getElementById("buttons")
    const buttons = ['3x3', '4x4', '5x5', '6x6']
    for (let it of buttons) {
        const button = createBtn(it)
        container.appendChild(button)
    }
}


window.onload = function() {
    let currentCombination = combination2
    let currentFieldSize = 4
    getNewPuzzle(currentFieldSize).then(r => {
        // console.log(r)
        createButtons()
        currentCombination = JSON.parse(r).pazzle
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
    })



}

