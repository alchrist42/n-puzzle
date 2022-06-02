const state = {
    currentCombination: [],
    currentFieldSize: 3,
    animationSpeed: 200,
    currentTimers: [],
    currentRenderTimers: [],
    isEpilepticModeEnabled: false,
    disableButtons: false,
    solution: []
}
let bounceEaseOut = makeEaseOut(quad) /***bounce***/

function createItem(width, num) {
    const div = document.createElement('div')
    if (num !== 0) {
        div.className = 'item'
        div.innerHTML += num
        if (state.isEpilepticModeEnabled) {
            div.style.backgroundColor = `#${Math.floor(Math.random()*1670)}`
            document.getElementById("checkBoxDot").style.backgroundColor = `#${Math.floor(Math.random()*1675)}`
        }

    }
    div.style.width = `${width}%`
    div.style.height = `${width}%`
    div.style.fontSize = `${width * 2.5}px`
    div.id = num
    return div
}

function renderField() {
    const field = document.getElementById('field')
    let child = field.lastElementChild
    while (child) {
        field.removeChild(child)
        child = field.lastElementChild
    }
    const itemSize = 100 / state.currentCombination[0].length
    const arr = []
    state.currentCombination.map(item => item.map(it => arr.push(it)))
    for (let it of arr) {
        const item = createItem(itemSize, it)
        field.appendChild(item)
    }
    return field
}

function refreshField () {
    if (!state.disableButtons) {
        for (let timer of state.currentTimers)
            clearInterval(timer)
        for (let timer of state.currentRenderTimers)
            clearInterval(timer)
        getNewPuzzle(state.currentFieldSize).then(r => {
            state.currentCombination = JSON.parse(r).pazzle
            state.solution = JSON.parse(r).goal
            renderField(state.currentCombination)
        })
    }
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

function quad(timeFraction) {
    return Math.pow(timeFraction, 2)
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
    state.disableButtons = true
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
    if (state.disableButtons)
        state.disableButtons = state.currentCombination.join('') !== state.solution.join('')
}

function toggleLoaders() {
    const loaders = document.getElementsByClassName("lds-ripple")
    const areVisible = loaders[0].style.display === "inline-block"
    loaders[0].style.display = areVisible ? 'none' : "inline-block"
    loaders[1].style.display = areVisible ? 'none' : "inline-block"
}

function visualizeSolution(solution) {
    const parsed = JSON.parse(solution)
    const checks = parsed.checks
    const koof = parsed.koof
    const cache_len = parsed.cache_len
    const queue_len = parsed.queue_len
    const spend_time = parsed.spend_time
}

const listenerSolve = async function () {
    if (!state.disableButtons && state.currentCombination.join('') !== state.solution.join('')) {
        toggleLoaders()
        const solution = await getSolution(state.currentCombination)
        visualizeSolution(solution)
        toggleLoaders()
        state.disableButtons = true
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
}

const listenerSize = function (size) {
    if (!state.disableButtons) {
        state.currentFieldSize = size
        refreshField()
    }
}

const getNewPuzzle = async (size) => {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }
    const res = await fetch(`http://127.0.0.1:8000/new_pazzle/${size}`, requestOptions)
    return res.text()
}


function epilepticMode() {
    const checkBoxDot = document.getElementById("checkBoxDot")
    if (state.isEpilepticModeEnabled) {
        checkBoxDot.style.left = '0px'
        checkBoxDot.style.right = '28px'
        checkBoxDot.style.backgroundColor = '#441a02'
    } else {
        checkBoxDot.style.right = '0px'
        checkBoxDot.style.left = '28px'
        checkBoxDot.style.backgroundColor = '#441a02'
    }
    state.isEpilepticModeEnabled = (!state.isEpilepticModeEnabled)
    renderField()
}

window.onload = function () {
    const buttonNewCombination = document.getElementById('btnNew')
    const buttonSolve = document.getElementById('btnSolve')
    const checkBox = document.getElementById("checkBox")

    buttonSolve.addEventListener('click', listenerSolve)
    buttonNewCombination.addEventListener('click', refreshField)
    checkBox.addEventListener('click', epilepticMode)
    for (let i = 3; i < 6; i++) //TODO Если нужна кнопка 6 на 6 включаешь коммент в index.html и тут итерируешься до 7
        document.getElementById(`${i}x${i}`).addEventListener('click', () => {listenerSize(i)})
    refreshField()
}

