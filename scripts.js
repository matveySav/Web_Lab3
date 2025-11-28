document.addEventListener('DOMContentLoaded', () => {     
    createPageStructure();
    loadGameState();
});

const grid_size = 4;
const cell_size = 22.5; // из-за гэпов сложится до 100%
const cell_gap = 2; // в процентах
let grid = [];
let score = 0;
let previousStates = []; 
let gameOver = false;
function createPageStructure(){
    const container = document.createElement('div');
    container.className = 'container';

    const header = document.createElement('header');

    const title = document.createElement('h1');
    title.textContent = '2048';
    
    const scoreContainer = document.createElement('div');
    scoreContainer.className = 'score-container';

    const scoreTitle = document.createElement('div');
    scoreTitle.className = 'score-title';
    scoreTitle.textContent = 'Счет';
    
    const scoreValue = document.createElement('div'); 
    scoreValue.className = 'score-value';
    scoreValue.id = 'score';
    scoreValue.textContent = '0';
    
    scoreContainer.appendChild(scoreTitle);
    scoreContainer.appendChild(scoreValue);
    header.appendChild(title);
    header.appendChild(scoreContainer);
    
    const gameInfo = document.createElement('div');
    gameInfo.className = 'game-info';
    
    const newGameButton = document.createElement('button');
    newGameButton.id = 'new-game';
    newGameButton.textContent = 'Новая игра'; 
    const undoButton = document.createElement('button');
    undoButton.id = 'undo';
    undoButton.textContent = 'Отменить ход';
    
    const showLeaderboardButton = document.createElement('button');
    showLeaderboardButton.id = 'show-leaderboard';
    showLeaderboardButton.textContent = 'Таблица рекордов';
    
    gameInfo.appendChild(newGameButton);
    gameInfo.appendChild(undoButton);
    gameInfo.appendChild(showLeaderboardButton);

    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';
    
    const gameBoard = document.createElement('div'); 
    gameBoard.id = 'game-board';
    gameBoard.className = 'game-board';
    
    for (let i = 0; i < grid_size; i++){
        for (let j = 0; j < grid_size; j++){
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.style.width = `${cell_size}%`;
            cell.style.height = `${cell_size}%`;
            cell.style.top = `${i * (cell_size + cell_gap) + cell_gap}%`; 
            cell.style.left = `${j * (cell_size + cell_gap) + cell_gap}%`;
            gameBoard.appendChild(cell);
        }
    }
    const gameOverScreen = document.createElement('div'); 
    gameOverScreen.id = 'game-over';
    gameOverScreen.className = 'game-over hidden';
    
    const gameOverTitle = document.createElement('h2');
    gameOverTitle.textContent = 'Игра окончена!'; 
    
    const gameOverMessage = document.createElement('div');
    gameOverMessage.id = 'game-over-message';
    
    const finalScoreText = document.createElement('p'); 
    finalScoreText.id = 'final-score';
    
    const saveScoreForm = document.createElement('div');
    saveScoreForm.id = 'save-score-form'; 
    saveScoreForm.className = 'save-score-form';
    
    const playerNameInput = document.createElement('input');
    playerNameInput.type = 'text';
    playerNameInput.id = 'player-name';
    playerNameInput.className = 'player-name-input';
    playerNameInput.placeholder = 'Введите ваше имя';
    playerNameInput.maxLength = 20;
    
    const saveScoreButton = document.createElement('button');
    saveScoreButton.id = 'save-score'; 
    saveScoreButton.textContent = 'Сохранить результат';
    saveScoreForm.appendChild(playerNameInput);
    saveScoreForm.appendChild(saveScoreButton);
    
    const restartGameButton = document.createElement('button');
    restartGameButton.id = 'restart-game';
    restartGameButton.textContent = 'Начать заново';
    
    gameOverMessage.appendChild(finalScoreText); 
    gameOverMessage.appendChild(saveScoreForm);

    gameOverScreen.appendChild(gameOverTitle);
    gameOverScreen.appendChild(gameOverMessage);
    gameOverScreen.appendChild(restartGameButton);
    
    gameContainer.appendChild(gameBoard); 
    gameContainer.appendChild(gameOverScreen);
    
//--------
    const mobileControls = document.createElement('div');
    mobileControls.id = 'mobile-controls';
    mobileControls.className = 'mobile-controls hidden';
    
    const controlRow1 = document.createElement('div');
    controlRow1.className = 'control-row';
    
    const upButton = document.createElement('button');
    upButton.id = 'up';
    upButton.className = 'control-btn';
    upButton.textContent = '\u2191'; 
    
    controlRow1.appendChild(upButton);
    
    const controlRow2 = document.createElement('div');
    controlRow2.className = 'control-row';
    
    const leftButton = document.createElement('button');
    leftButton.id = 'left';
    leftButton.className = 'control-btn';
    leftButton.textContent = '\u2190';
    
    const downButton = document.createElement('button');
    downButton.id = 'down';
    downButton.className = 'control-btn';
    downButton.textContent ='\u2193'; 
    
    const rightButton = document.createElement('button');
    rightButton.id = 'right';
    rightButton.className ='control-btn';
    rightButton.textContent = '\u2192';
    
    controlRow2.appendChild(leftButton);
    controlRow2.appendChild(downButton);
    controlRow2.appendChild(rightButton);
    
    mobileControls.appendChild(controlRow1); 
    mobileControls.appendChild(controlRow2);
    
    const leaderboardModal = document.createElement('div');
    leaderboardModal.id = 'leaderboard-modal' ;
    leaderboardModal.className ='modal hidden';
    
    const modalContent = document.createElement('div');
    modalContent.className ='modal-content';
    
    const closeSpan = document.createElement('span');
    closeSpan.className = 'close'; 
    closeSpan.textContent = '\u00d7'; 
    
    const leaderboardTitle = document.createElement('h2');
    leaderboardTitle.textContent = 'Таблица рекордов';
    
    const leaderboard= document.createElement('div');
    leaderboard.id ='leaderboard';
    
    const table = document.createElement('table');
    table.className = 'leaderboard-table';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
     
    const nameHeader = document.createElement('th');
    nameHeader.textContent = 'Имя';
    
    const scoreHeader = document.createElement('th');
    scoreHeader.textContent = 'Очки';
    
    const dateHeader = document.createElement('th');
    dateHeader.textContent = 'Дата';

    headerRow.appendChild(nameHeader);
    headerRow.appendChild(scoreHeader);
    headerRow.appendChild(dateHeader);
    thead.appendChild(headerRow);
    const tbody = document.createElement('tbody');
    tbody.id = 'leaderboard-body';

    table.appendChild(thead);
    table.appendChild(tbody);
    leaderboard.appendChild(table);
    
    modalContent.appendChild(closeSpan);
    modalContent.appendChild(leaderboardTitle);
    modalContent.appendChild(leaderboard);
    
    leaderboardModal.appendChild(modalContent);
    
    container.appendChild(header);
    container.appendChild(gameInfo);
    container.appendChild(gameContainer);
    container.appendChild(mobileControls);
    container.appendChild(leaderboardModal);
    
    document.body.appendChild(container);
    
    initGame();
    setupEventListeners();
}

function initGame(){ 
    loadGameState();
    if (grid.length === 0){
        newGame();
        return;
    }
    updateDisplay();
    
    if (window.innerWidth <= 520){
        document.getElementById('mobile-controls').classList.remove('hidden');
    } else {
        document.getElementById('mobile-controls').classList.add('hidden');
    }
}

function newGame(){
    grid = []; 
    score = 0;
    gameOver = false;
    previousStates = [];
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('save-score-form').style.display = 'flex';
    
    if (window.innerWidth <= 520){
        document.getElementById('mobile-controls').classList.remove('hidden');
    } else {
        document.getElementById('mobile-controls').classList.add('hidden');
    }
    
    createGrid();
    const randomCount = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i< randomCount;i++){addRandomTile();}
    updateDisplay();
    saveGameState();    
    localStorage.removeItem('gameState'); 
    localStorage.removeItem('previousStates');
}

function createGrid() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.remove());
    grid = [];
    for (let i = 0; i < grid_size; i++){
        grid[i] = [];
        for (let j = 0; j < grid_size; j++){
            grid[i][j] = null;
         } 
    }
}

function addRandomTile(){
    const emptyCells = [];
    for (let i = 0; i < grid_size; i++){
        for (let j = 0; j < grid_size; j++){
            if (grid[i][j] === null){
                emptyCells.push({row: i, col: j});
            }
        }
    }

    if (emptyCells.length > 0){
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const value = Math.random() < 0.9 ? 2 : 4;
        
        grid[randomCell.row][randomCell.col]={
            value: value,
            row: randomCell.row,
            col: randomCell.col,
            new: true,
            merged: false
        };
    }
}

function updateDisplay(){
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.remove());
    document.getElementById('score').textContent = score;
    
    for (let i = 0; i < grid_size; i++){
        for (let j = 0; j < grid_size; j++){
            if (grid[i][j] !== null) {
                const tile = grid[i][j];
                const tileElement = document.createElement('div');
                tileElement.classList.add('tile', `tile-${tile.value}`);
                tileElement.textContent = tile.value;
                
                tileElement.style.top = `${i * (cell_size + cell_gap) + cell_gap}%`;
                tileElement.style.left = `${j * (cell_size + cell_gap) + cell_gap}%`;
                tileElement.style.width = `${cell_size}%`;
                tileElement.style.height = `${cell_size}%`;
                
                if (tile.new){
                    tileElement.classList.add('tile-new');
                    setTimeout(() => {
                        tileElement.classList.remove('tile-new');
                        tile.new = false;
                    }, 300);   
                }

                    if (tile.merged){
                    tileElement.classList.add('tile-merged');
                    setTimeout(() => {
                        tileElement.classList.remove('tile-merged');
                        tile.merged = false;
                    }, 300);   
                }
                document.getElementById('game-board').appendChild(tileElement);
            }   
        }
    }
} 

function saveGameState(){
    for (let i = 0; i < grid_size; i++){ 
        for (let j = 0; j< grid_size; j++){ 
            if (grid[i][j]){
                grid[i][j].new = false;
                grid[i][j].merged = false; 
            }
        }
    }
    const gameState = {
        grid: JSON.parse(JSON.stringify(grid)),
        score: score,
        gameOver: gameOver
    }; 
    localStorage.setItem('gameState', JSON.stringify(gameState));

    previousStates.push(JSON.parse(JSON.stringify(gameState)));
    localStorage.setItem('previousStates',JSON.stringify(previousStates));
}

function loadGameState(){
    const savedState = localStorage.getItem('gameState');
    const savedPreviousStates = localStorage.getItem('previousStates');
    if (savedState || savedPreviousStates) {
        previousStates = JSON.parse(savedPreviousStates);
        const state = JSON.parse(savedState);
        grid = state.grid;
        score = state.score;
        gameOver = state.gameOver;
        updateDisplay();
        if (gameOver){
            document.getElementById('final-score').textContent = `Ваш счет: ${score}`;
            document.getElementById('game-over').classList.remove('hidden');
            document.getElementById('mobile-controls').classList.add('hidden');
        }
    }
}
function undoMove(){
    if (previousStates.length > 1 && !gameOver){
        previousStates.pop();
    
        const previousState = previousStates[previousStates.length - 1];
        grid = previousState.grid;
        score = previousState.score;
        gameOver = previousState.gameOver;
        
        updateDisplay();

        if (previousStates.length === 1) previousStates.pop();  

        localStorage.setItem('gameState', JSON.stringify(previousState));
        localStorage.setItem('previousStates', JSON.stringify(previousStates));
    }
}

function makeMove(moveFunction){
    if (gameOver) return false;
    if (previousStates.length === 0) saveGameState();

    const moved = moveFunction();
    if (moved) saveGameState(); 
    return moved;
}
function moveLeft(){
    let moved = false;
    let pointsEarned = 0;   
    for (let i = 0; i < grid_size; i++){
        for (let j = 1; j < grid_size; j++){
            if (grid[i][j] !== null){
                let currentCol = j;
                let currentTile = grid[i][j];
                while (currentCol > 0 && grid[i][currentCol - 1] === null){
                    grid[i][currentCol - 1] = currentTile;
                    grid[i][currentCol] = null;
                    currentTile.col = currentCol - 1; 
                    currentCol--;
                    moved = true;
                }

                if (currentCol > 0 && grid[i][currentCol - 1] !== null && grid[i][currentCol - 1].value === currentTile.value) {
                    grid[i][currentCol - 1].value *= 2;
                    grid[i][currentCol - 1].merged = true;
                    pointsEarned += grid[i][currentCol - 1].value;
                    grid[i][currentCol] = null;
                    moved = true;
                }
            }
        }
    }
    if (moved){
        score += pointsEarned;
        const randomCount = Math.floor(Math.random() * 2) + 1
        for (let i = 0; i< randomCount;i++){addRandomTile();}
        updateDisplay();
        checkGameOver();
    }
    return moved;
}
function moveRight() {
    let moved = false;
    let pointsEarned = 0;
    for (let i = 0; i < grid_size; i++){
        for (let j = grid_size - 2; j >= 0; j--){
            if (grid[i][j] !== null){
                let currentCol = j; 
                let currentTile = grid[i][j];
                while (currentCol < grid_size - 1 && grid[i][currentCol + 1] === null){
                    grid[i][currentCol + 1] = currentTile;
                    grid[i][currentCol] = null;
                    currentTile.col = currentCol + 1; 
                    currentCol++;
                    moved = true;
                } 
                if (currentCol < grid_size - 1 && grid[i][currentCol + 1] !== null && grid[i][currentCol + 1].value === currentTile.value) {
                    grid[i][currentCol + 1].value *= 2;
                    grid[i][currentCol + 1].merged = true;
                    pointsEarned += grid[i][currentCol + 1].value;
                    grid[i][currentCol] = null;
                    moved = true; 
                }
            }
        }
    }
    if (moved){
        score += pointsEarned;
        const randomCount = Math.floor(Math.random() * 2) + 1
        for (let i = 0; i< randomCount;i++){addRandomTile();}
        updateDisplay();
        checkGameOver();    
    }
    return moved; 
}
function moveUp() {
    let moved = false;
    let pointsEarned = 0;
    for (let j = 0; j < grid_size; j++){
        for (let i = 1; i < grid_size; i++){
            if (grid[i][j] !== null) {
                let currentRow = i;
                let currentTile = grid[i][j];
                while (currentRow > 0 && grid[currentRow - 1][j] === null){
                    grid[currentRow - 1][j] = currentTile;
                    grid[currentRow][j] = null;
                    currentTile.row = currentRow - 1; 
                    currentRow--;
                    moved = true;
                }
                if (currentRow > 0 && grid[currentRow - 1][j] !== null &&grid[currentRow - 1][j].value === currentTile.value){
                    grid[currentRow - 1][j].value *= 2;
                    grid[currentRow - 1][j].merged = true;
                    pointsEarned += grid[currentRow - 1][j].value;
                    grid[currentRow][j] = null;
                    moved = true;
                }
            }
        }
    }
    if (moved){
        score += pointsEarned;
        const randomCount = Math.floor(Math.random() * 2) + 1
        for (let i = 0; i< randomCount;i++){addRandomTile();}
        updateDisplay();
        checkGameOver();
    }
    return moved;
}
function moveDown() {
    let moved = false;
    let pointsEarned = 0;   
    for (let j = 0; j < grid_size; j++){
        for (let i = grid_size - 2; i >= 0; i--) {
            if (grid[i][j] !== null) {
                let currentRow = i;
                let currentTile = grid[i][j]; 
                while (currentRow < grid_size - 1 && grid[currentRow + 1][j] === null){
                    grid[currentRow + 1][j] = currentTile;
                    grid[currentRow][j] = null; 
                    currentTile.row = currentRow + 1;
                    currentRow++;
                    moved = true;
                }
                if (currentRow < grid_size - 1 && grid[currentRow + 1][j] !== null && grid[currentRow + 1][j].value === currentTile.value){
                    grid[currentRow + 1][j].value *= 2;
                    grid[currentRow + 1][j].merged = true;
                    pointsEarned += grid[currentRow + 1][j].value;
                    grid[currentRow][j] = null;
                    moved = true;
                } 
            }
        }
    }
    if (moved){
        score += pointsEarned;
        const randomCount = Math.floor(Math.random() * 2) + 1
        for (let i = 0; i< randomCount;i++){addRandomTile();}
        updateDisplay();
        checkGameOver(); 
    }
    return moved;
}


function checkGameOver(){
    for (let i = 0; i < grid_size; i++){
        for (let j = 0; j < grid_size; j++){ 
            if (grid[i][j] === null){
                return false;
            }
        }
    }
    
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size; j++) {
            const currentValue = grid[i][j].value;
            if (j < grid_size - 1 && grid[i][j + 1].value === currentValue){
                return false;
            }
            if (i < grid_size - 1 && grid[i + 1][j].value === currentValue){
                return false;
            }
        }
    }
    gameOver = true;
    document.getElementById('final-score').textContent = `Ваш счет: ${score}`;
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('mobile-controls').classList.add('hidden');
    return true;
}
function saveScore(){
    const playerNameInput = document.getElementById('player-name');
    const playerName = playerNameInput.value.trim(); 
    if (playerName === ''){
        alert('Пожалуйста, введите ваше имя');
        return;
    }
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const newRecord = {
        name: playerName,
        score: score,
        date: new Date().toLocaleDateString('ru-RU')
    };
    leaderboard.push(newRecord);
    // топ 10
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 10) leaderboard.splice(10);

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    
    document.getElementById('save-score-form').style.display = 'none';
    document.querySelector('#game-over-message p').textContent = 'Ваш рекорд сохранен!';
}
function showLeaderboard(){
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.querySelectorAll('tr').forEach((trow, i) => {leaderboardBody.removeChild(trow)});

    if (leaderboard.length === 0){
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.textContent = 'Рекордов пока нет';
        row.appendChild(cell);
        leaderboardBody.appendChild(row);
    } else{
        leaderboard.forEach((record, index) => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = record.name;
            
            const scoreCell = document.createElement('td');
            scoreCell.textContent = record.score;
            
            const dateCell = document.createElement('td');
            dateCell.textContent = record.date;
            row.appendChild(nameCell);
            row.appendChild(scoreCell);
            row.appendChild(dateCell);
            leaderboardBody.appendChild(row);
        });
    }
    document.getElementById('leaderboard-modal').classList.remove('hidden');
    document.getElementById('mobile-controls').classList.add('hidden');
}

function closeLeaderboard(){
    document.getElementById('leaderboard-modal').classList.add('hidden');
    if (window.innerWidth <= 520 && !gameOver) {
        document.getElementById('mobile-controls').classList.remove('hidden');
    }
}
function setupEventListeners(){
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        let moved = false;
        switch(e.key){
            case 'ArrowLeft':
                e.preventDefault();
                moved = makeMove(moveLeft);
                break;
            case 'ArrowRight':
                e.preventDefault(); 
                moved = makeMove(moveRight);
                break;
            case 'ArrowUp':
                e.preventDefault();
                moved = makeMove(moveUp);
                break;
            case 'ArrowDown':
                e.preventDefault();
                moved = makeMove(moveDown);
                break;
        }
    });
    document.getElementById('new-game').addEventListener('click', newGame);
    document.getElementById('undo').addEventListener('click', undoMove); 
    document.getElementById('show-leaderboard').addEventListener('click', showLeaderboard);
    document.getElementById('save-score').addEventListener('click', saveScore);
    document.getElementById('restart-game').addEventListener('click', newGame);
    document.querySelector('.close').addEventListener('click', closeLeaderboard);
    
    document.getElementById('up').addEventListener('click', () => makeMove(moveUp));
    document.getElementById('down').addEventListener('click', () => makeMove(moveDown));
    document.getElementById('left').addEventListener('click', () => makeMove(moveLeft));
    document.getElementById('right').addEventListener('click', () => makeMove(moveRight));
    
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 520 && !gameOver){
            document.getElementById('mobile-controls').classList.remove('hidden');
        } else{
            document.getElementById('mobile-controls').classList.add('hidden');
        }
    });
}