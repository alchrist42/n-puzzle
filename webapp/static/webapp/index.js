const state = {
    currentCombination: [],
    currentFieldSize: 4,
    animationSpeed: 200,
    currentTimers: [],
    currentRenderTimers: [],
    isEpilepticModeEnabled: false,
    disableButtons: false,
    solution: []
}
let bounceEaseOut = makeEaseOut(quad)

/***bounce***/

function createItem(width, num) {
    const div = document.createElement('div')
    if (num !== 0) {
        div.className = 'item'
        div.innerHTML += num
        if (state.isEpilepticModeEnabled) {
            div.style.backgroundColor = `#${Math.floor(Math.random() * 1670)}`
            document.getElementById('checkBoxDot').style.backgroundColor = `#${Math.floor(Math.random() * 1675)}`
        }
    }
    div.style.width = `${width}%`
    div.style.height = `${width}%`
    div.style.fontSize = `${width * 2.5}px`
    div.id = num
    return div
}

function clearChildElements(element) {
    let child = element.lastElementChild
    while (child) {
        element.removeChild(child)
        child = element.lastElementChild
    }
}

function moveElement(id) {
    const arr = state.currentCombination
    const distance = 500 / state.currentFieldSize
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].find(ind => ind === id) > 0) {
            const x = parseInt(arr[i].findIndex(ind => ind === id))
            console.log(state.currentFieldSize)
            if (x < state.currentFieldSize - 1 && arr[i][x + 1] === 0)
                move(id, distance, 'left', [i, x], [i, x + 1])
            else if (x > 0 && arr[i][x - 1] === 0)
                move(id, distance, 'right', [i, x], [i, x - 1])
            else if (i < state.currentFieldSize - 1 && arr[i + 1][x] === 0)
                move(id, distance, 'top', [i, x], [i + 1, x])
            else if (i > 0 && arr[i - 1][x] === 0)
                move(id, distance, 'botoom', [i, x], [i - 1, x])
            console.log(state.currentCombination.join(''), state.solution.join(''))
            if (state.currentCombination.join('') === state.solution.join(''))
                console.log('solved')
        }
    }
}

function renderField() {
    const field = document.getElementById('field')
    clearChildElements(field)
    const itemSize = 100 / state.currentCombination[0].length
    const arr = []
    state.currentCombination.map(item => item.map(it => arr.push(it)))
    for (let it of arr) {
        const item = createItem(itemSize, it)
        item.addEventListener('click', () => moveElement(it))
        field.appendChild(item)
    }
    return field
}

function refreshField() {
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
    return res
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
    state.currentCombination.join('') === state.solution.join('') ? state.solution = [] : 0
}

function toggleLoader() {
    const div = document.getElementById('rightSide')
    clearChildElements(div)
    const loader = document.createElement('div')
    loader.className = 'lds-ripple'
    const loaderChildren = [document.createElement('div'), document.createElement('div')]
    loaderChildren.map(child => loader.appendChild(child))
    div.appendChild(loader)
}

function createParagraphs(data, element) {
    data.map(item => {
        const par = document.createElement('p')
        par.innerHTML = `${item[0]}: ${item[1]}`
        element.appendChild(par)
    })
}

async function visualizeSolution(solution) {
    const div = document.getElementById('rightSide')
    clearChildElements(div)
        const parsed = JSON.parse(solution)
        const data = [
            ['Coefficient         ', parsed.koof],
            ['Checks              ', parsed.checks],
            ['Cache length        ', parsed.cache_len],
            ['Queue length        ', parsed.queue_len],
            ['Time to get solution', parsed.spend_time],
            ['Moves               ', parsed.moves?.length]]
        createParagraphs(data, div)
}

const listenerSolve = async function () {
    if (!state.disableButtons && state.currentCombination.join('') !== state.solution.join('')) {
        toggleLoader()
        const solution = await getSolution(state.currentCombination)
        const text = await solution.text()
        console.log(solution['error'])
        if (solution.status === 200) {
            visualizeSolution(text)
            state.disableButtons = true
            const moves = JSON.parse(text).moves
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
}


function listenerStop() {
    for (let timer of state.currentTimers)
        clearInterval(timer)
    for (let timer of state.currentRenderTimers)
        clearInterval(timer)
    state.disableButtons = false
}

const listenerSize = function (size) {
    if (!state.disableButtons) {
        clearChildElements(document.getElementById('rightSide'))
        state.currentFieldSize = size
        refreshField()
    }
}

function listenerSpeed(speed) {
    if (!state.disableButtons) {
        for (let i = 1; i < 4; i++)
            document.getElementById(`speed${i}`).style.backgroundColor = '#742f06'
        state.animationSpeed = speed === 1 ? 1000 : speed === 2 ? 400 : 100
        document.getElementById(`speed${speed}`).style.backgroundColor = '#3a0000'
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
    const checkBoxDot = document.getElementById('checkBoxDot')
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
    const buttonSolve = document.getElementById('btnSolve')
    const buttonStop = document.getElementById('btnStop')
    const checkBox = document.getElementById('checkBox')

    buttonSolve.addEventListener('click', listenerSolve)
    buttonStop.addEventListener('click', listenerStop)
    checkBox.addEventListener('click', epilepticMode)
    for (let i = 3; i < 6; i++) //TODO Если нужна кнопка 6 на 6 включаешь коммент в index.html и тут итерируешься до 7
        document.getElementById(`${i}x${i}`).addEventListener('click', () => {
            listenerSize(i)
        })
    for (let i = 1; i < 4; i++)
        document.getElementById(`speed${i}`).addEventListener('click', () => {
            listenerSpeed(i)
        })
    refreshField()
}

