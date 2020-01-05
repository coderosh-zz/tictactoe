let originalBoard
const humanPlayer = 'O'
const AIPlayer = 'X'
const Wining = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

const boxes = document.querySelectorAll('.cell')
startGame()

function startGame() {
  document.querySelector('.endgame').style.display = 'none'
  originalBoard = Array.from(Array(9).keys())
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].innerText = ''
    boxes[i].style.removeProperty('background-color')
    boxes[i].addEventListener('click', turnClick, false)
  }
}

function turnClick(square) {
  if (typeof originalBoard[square.target.id] == 'number') {
    turn(square.target.id, humanPlayer)
    if (!checkWin(originalBoard, humanPlayer) && !checkTie())
      turn(bestSpot(), AIPlayer)
  }
}

function turn(squareId, player) {
  originalBoard[squareId] = player
  document.getElementById(squareId).innerText = player
  let gameWon = checkWin(originalBoard, player)
  if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), [])
  let gameWon = null
  for (let [index, win] of Wining.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player }
      break
    }
  }
  return gameWon
}

function gameOver(gameWon) {
  for (let index of Wining[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlayer ? '#273c75' : '#e84118'
  }
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].removeEventListener('click', turnClick, false)
  }
  declareWinner(
    gameWon.player == humanPlayer
      ? 'Congratulations,You Win!'
      : 'Sorry, You lose.'
  )
}

function declareWinner(who) {
  document.querySelector('.endgame').style.display = 'block'
  document.querySelector('.endgame .text').innerText = who
}

function emptySquares() {
  return originalBoard.filter(s => typeof s == 'number')
}

function bestSpot() {
  return minimax(originalBoard, AIPlayer).index
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].style.backgroundColor = '#44bd32'
      boxes[i].removeEventListener('click', turnClick, false)
    }
    declareWinner('Draw Game')
    return true
  }
  return false
}

function minimax(newBoard, player) {
  let availSpots = emptySquares()

  if (checkWin(newBoard, humanPlayer)) {
    return { score: -10 }
  } else if (checkWin(newBoard, AIPlayer)) {
    return { score: 10 }
  } else if (availSpots.length === 0) {
    return { score: 0 }
  }
  let moves = []
  for (let i = 0; i < availSpots.length; i++) {
    let move = {}
    move.index = newBoard[availSpots[i]]
    newBoard[availSpots[i]] = player

    if (player == AIPlayer) {
      let result = minimax(newBoard, humanPlayer)
      move.score = result.score
    } else {
      let result = minimax(newBoard, AIPlayer)
      move.score = result.score
    }

    newBoard[availSpots[i]] = move.index

    moves.push(move)
  }

  let bestMove
  if (player === AIPlayer) {
    let bestScore = -10000
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
  } else {
    let bestScore = 10000
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
  }

  return moves[bestMove]
}
