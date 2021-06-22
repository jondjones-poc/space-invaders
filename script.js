const grid = document.getElementById('grid');
const resultsEl = document.getElementById('results');
const GAME_OVER_MESSAGE = 'GAME OVER';

let shooterIndex = 202
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let score = 0;

let invaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
];

const drawInvaders = () => {
    for (let i = 0; i < invaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[invaders[i]].classList.add('invader')
        }
    }
}

const removeInvaders = () => {
    for (let i = 0; i < invaders.length; i++) {
        squares[invaders[i]].classList.remove('invader')
    }
}

const moveShooter = (e) => {
    squares[shooterIndex].classList.remove('shooter');
    switch(e.key) {
        case 'ArrowLeft':
            if (shooterIndex % width !== 0 ){
                shooterIndex -=1;
            }
            break
        case 'ArrowRight':
            if (shooterIndex % width < width -1){
                shooterIndex +=1;
            }
            break
    }
    squares[shooterIndex].classList.add('shooter');
} 

const moveInvaders = () => {
    const leftEdge = invaders[0] % width === 0
    const rightEdge = invaders[invaders.length - 1] % width === width -1
    removeInvaders();

    if (rightEdge && goingRight) {
        for (let i = 0; i < invaders.length; i++) {
            invaders[i] += width +1
            direction = -1
            goingRight = false
        }
    }

    if(leftEdge && !goingRight) {
        for (let i = 0; i < invaders.length; i++) {
            invaders[i] += width -1
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < invaders.length; i++) {
        invaders[i] += direction
    }

    drawInvaders();

    if (squares[shooterIndex].classList.contains('invader', 'shooter')) {
        resultsEl.innerHTML = GAME_OVER_MESSAGE;
        clearInterval(invadersId)
    }

    for (let i = 0; i < invaders.length; i++) {
        if(invaders[i] > squares.length){
            resultsEl.innerHTML = GAME_OVER_MESSAGE;
            clearInterval(invadersId)
        }
    }

    if (aliensRemoved.length === invaders.length) {
        resultsEl.innerHTML = "You Win"
        clearInterval(invadersId);
    }
}

const shoot = (e) => {
    let laserId;
    let laserIndex = shooterIndex;

    function moveLaser() {
        squares[laserIndex]?.classList.remove('laser');
        laserIndex -= width;
        squares[laserIndex]?.classList?.add('laser');

        if (squares[laserIndex]?.classList?.contains('invader')) {
            squares[laserIndex]?.classList.remove('laser');
            squares[laserIndex]?.classList.remove('invader');
            squares[laserIndex]?.classList.add('boom');
        
            setTimeout(() => squares[laserIndex]?.classList?.remove('boom'), 300)
            clearInterval(laserId);

            const removedAlien = invaders.indexOf(laserIndex);

            aliensRemoved.push(removedAlien);
            score++;
            resultsEl.innerHTML = score;
        }
    }

    switch(e.key) {
        case 'ArrowUp':
            laserId = setInterval(moveLaser, 100)
            break
    }
}

// Draw board
for (let i = 0; i < 225; i++) {
    const square = document.createElement('div');
    grid.append(square);
}

document.addEventListener('keydown', moveShooter)
document.addEventListener('keydown', shoot)

const squares = Array.from(document.querySelectorAll('#grid div'));
squares[shooterIndex].classList.add('shooter');
drawInvaders();

invadersId = setInterval(moveInvaders, 1000)

