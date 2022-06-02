const state = {
    currentCombination: [],
    currentFieldSize: 3,
    animationSpeed: 200,
    currentTimers: [],
    currentRenderTimers: []
}
let bounceEaseOut = makeEaseOut(bounce)

function createItem(width, num) {
    const div = document.createElement('div')
    if (num !== 0) {
        div.className = 'item'
        div.innerHTML += num
    }
    div.style.width = `${width}%`
    div.style.height = `${width}%`
    div.style.fontSize = `${width * 1.4}px`
    div.id = num
    return div
}

function renderField(combination) {
    const field = document.getElementById('field')
    let child = field.lastElementChild
    while (child) {
        field.removeChild(child)
        child = field.lastElementChild
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

function refreshField () {
    for (let timer of state.currentTimers)
        clearInterval(timer)
    for (let timer of state.currentRenderTimers)
        clearInterval(timer)
    getNewPuzzle(state.currentFieldSize).then(r => {
        state.currentCombination = JSON.parse(r).pazzle
        renderField(state.currentCombination)
    })
}

function makeEaseOut(timing) {
    return function (timeFraction) {
        return 1 - timing(1 - timeFraction)
    }
}

function bounce(timeFraction) {
    for (let a = 0, b = 1; 1; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
        }
    }
}

const move = function (id, dist, dir, current, destination, i) {
    animate({
        duration: state.animationSpeed,
        timing: bounceEaseOut,
        draw: function (progress) {
            const elem = document.getElementById(id)
            if (elem && dir === 'left')
                elem.style.left = progress * dist + 'px'
            if (elem && dir === 'right')
                elem.style.right = progress * dist + 'px'
            if (elem && dir === 'top')
                elem.style.top = progress * dist + 'px'
            if (elem && dir === 'bottom')
                elem.style.bottom = progress * dist + 'px'
            if (progress === 1)
                state.currentRenderTimers[i] = setTimeout(() => {
                    swapElement(id, current, destination)
                })
        }
    })
}

const getSolution = async (currentCombination) => {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Access-Control-Allow-Origin', 'http://127.0.0.1:8000')
    const raw = JSON.stringify({'pazzle': currentCombination})
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    }
    const res = await fetch('http://127.0.0.1:8000/solver/', requestOptions)
    return res.text()
}

function getDirection(current, destination) {
    if (current[0] - destination[0] > 0)
        return 'bottom'
    if (current[0] - destination[0] < 0)
        return 'top'
    if (current[1] - destination[1] > 0)
        return 'right'
    if (current[1] - destination[1] < 0)
        return 'left'
    return null
}

function swapElement(id, cur, dest) {
    state.currentCombination[dest[0]][dest[1]] = id
    state.currentCombination[cur[0]][cur[1]] = 0
    renderField(state.currentCombination)
}

const listenerSolve = async function () {
    const solution = await getSolution(state.currentCombination)
    const moves = JSON.parse(solution).moves
    const distance = 500 / state.currentFieldSize
    for (let i = 0; i < moves.length; i++) {
        const id = moves[i][0]
        const current = moves[i][1]
        const destination = moves[i][2]
        const direction = getDirection(current, destination)
        state.currentTimers[i] = setTimeout(() => {
            move(id, distance, direction, current, destination, i)
        }, i * state.animationSpeed)

    }
}

const listenerSize = function (size) {
    state.currentFieldSize = size
    refreshField()
}

const getNewPuzzle = async (size) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }
    const res = await fetch(`http://127.0.0.1:8000/new_pazzle/${size}`, requestOptions)
    return res.text()
}

function toggleList() {
    const click = document.getElementById('listItems');
    const isHidden = click.style.display ==='none'
        click.style.display = isHidden ? 'block' : 'none'
    if (!isHidden) {
        document.getElementById('slow').addEventListener('click', function () {
            console.log('slow click')
            state.animationSpeed = 1000
        })
        document.getElementById('medium').addEventListener('click', function () {
            console.log('medium click')
            state.animationSpeed = 500
        })
        document.getElementById('fast').addEventListener('click', function () {
            console.log('fast click')
            state.animationSpeed = 100
        })
    }

}

window.onload = function () {
    const buttonNewCombination = document.getElementById('btnNew')
    const buttonSolve = document.getElementById('btnSolve')
    const buttonSpeed = document.getElementById('speedList')

    buttonSolve.addEventListener('click', listenerSolve)
    buttonNewCombination.addEventListener('click', refreshField)
    buttonSpeed.addEventListener('click', toggleList)
    for (let i = 3; i < 6; i++) //TODO Если нужна кнопка 6 на 6 включаешь коммент в index.html и тут итерируешься до 7
        document.getElementById(`${i}x${i}`).addEventListener('click', () => {listenerSize(i)})
    refreshField()
}

