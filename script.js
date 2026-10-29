// BANCOS DE DADOS
const rRrBank = [
    { word: "PIRULITO", target: "R", display: "PI_ULITO" },
    { word: "BARRACA", target: "RR", display: "BA__ACA" },
    { word: "PAREDE", target: "R", display: "PA_EDE" },
    { word: "CORRETO", target: "RR", display: "CO__ETO" },
    { word: "BARRIGA", target: "RR", display: "BA__IGA" },
    { word: "GARRAFA", target: "RR", display: "GA__AFA" },
    { word: "SEREIA", target: "R", display: "SE_EIA" },
    { word: "ARANHA", target: "R", display: "A_ANHA" },
    { word: "TESOURA", target: "R", display: "TESOU_A" },
    { word: "CACHORRO", target: "RR", display: "CACHO__O" },
    { word: "CARRETA", target: "RR", display: "CA__ETA" },
    { word: "GOLEIRO", target: "R", display: "GOLEI_O" },
    { word: "CARECA", target: "R", display: "CA_ECA" },
    { word: "VARRER", target: "RR", display: "VA__ER" },
    { word: "BORRACHA", target: "RR", display: "BO__ACHA" },
    { word: "SORRISO", target: "RR", display: "SO__ISO" },
    { word: "CARAMUJO", target: "R", display: "CA_AMUJO" }
];

const rWordSearchBank = ["RATO", "REPOLHO", "RECREIO", "REDE", "REGIME", "RISADA", "RADIO", "ROUPA", "ROSTO", "RELOGIO", "RODO", "RAPADURA", "RAPOSA", "RISCO", "RIQUEZA", "RECEBER", "ROTULO"];
const qWordSearchBank = ["QUEIMADO", "QUADRILHA", "QUEIJO", "QUADRADO", "QUERER", "QUATRO", "QUINA", "QUATI", "QUEBRADO"];

const fullMazePairsBank = [
    { correct: "PIRULITO", wrong: "PIRRULITO" },
    { correct: "BARRACA", wrong: "BARACA" },
    { correct: "PAREDE", wrong: "PARREDE" },
    { correct: "CORRETO", wrong: "CORETO" },
    { correct: "BARRIGA", wrong: "BARIGA" },
    { correct: "GARRAFA", wrong: "GARAFA" },
    { correct: "SEREIA", wrong: "SERREIA" },
    { correct: "CACHORRO", wrong: "CACHORO" },
    { correct: "BORRACHA", wrong: "BORACHA" },
    { correct: "SORRISO", wrong: "SORISO" },
    { correct: "ARANHA", wrong: "ARRANHA" },
    { correct: "CARECA", wrong: "CARRECA" },
    { correct: "VARRER", wrong: "VARER" },
    { correct: "GOLEIRO", wrong: "GOLLEIRO" }
];

const highlightColors = [
    '#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', 
    '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF', '#E2F0CB'
];

// NAVEGAÇÃO
function switchGame(gameNum) {
    document.querySelectorAll('.nav-btn').forEach((btn, idx) => {
        if(idx < 5) btn.classList.toggle('active', idx === gameNum - 1);
    });
    document.querySelectorAll('.game-container').forEach((c, idx) => {
        c.classList.toggle('active', idx === gameNum - 1);
    });

    if(gameNum === 1) startGame1();
    if(gameNum === 2) initWordSearch(2);
    if(gameNum === 4) initWordSearch(4);
    if(gameNum === 5) initMazeGame();
}

// JOGO 1
let g1CurrentList = [];
let g1Index = 0;
let g1Score = 0;

function startGame1() {
    g1CurrentList = [...rRrBank].sort(() => 0.5 - Math.random()).slice(0, 10);
    g1Index = 0;
    g1Score = 0;
    document.getElementById('g1-score').innerText = g1Score;
    document.getElementById('g1-restart').style.display = 'none';
    document.querySelectorAll('#game1 .opt-btn').forEach(b => b.disabled = false);
    renderG1Question();
}

function renderG1Question() {
    if(g1Index >= 10) {
        document.getElementById('g1-word').innerText = "🎉 Fim da Rodada!";
        document.getElementById('g1-feedback').className = "feedback-msg text-success";
        document.getElementById('g1-feedback').innerText = `Parabéns! Você fez ${g1Score} de 10 pontos!`;
        document.querySelectorAll('#game1 .opt-btn').forEach(b => b.disabled = true);
        document.getElementById('g1-restart').style.display = 'inline-block';
        return;
    }
    document.getElementById('g1-round').innerText = g1Index + 1;
    document.getElementById('g1-word').innerText = g1CurrentList[g1Index].display;
    document.getElementById('g1-feedback').innerText = "";
}

function checkGame1(choice) {
    const item = g1CurrentList[g1Index];
    const fb = document.getElementById('g1-feedback');
    if(choice === item.target) {
        g1Score++;
        document.getElementById('g1-score').innerText = g1Score;
        fb.className = "feedback-msg text-success";
        fb.innerText = "Muito bem! " + item.word;
    } else {
        fb.className = "feedback-msg text-danger";
        fb.innerText = `Ops! O correto é: ${item.word}`;
    }
    g1Index++;
    setTimeout(renderG1Question, 1100);
}

// JOGO 2 E 4
const wsState = {
    2: { diff: 'easy', grid: [], words: [], found: [], isMouseDown: false, startCell: null, currentSelection: [] },
    4: { diff: 'easy', grid: [], words: [], found: [], isMouseDown: false, startCell: null, currentSelection: [] }
};

function setWsDifficulty(gameNum, diff) {
    wsState[gameNum].diff = diff;
    document.getElementById(`g${gameNum}-easy`).classList.toggle('active', diff === 'easy');
    document.getElementById(`g${gameNum}-hard`).classList.toggle('active', diff === 'hard');
    initWordSearch(gameNum);
}

function initWordSearch(gameNum) {
    const bank = (gameNum === 2) ? rWordSearchBank : qWordSearchBank;
    const words = [...bank].sort(() => 0.5 - Math.random()).slice(0, 9);
    const size = 11;
    const grid = Array(size).fill(null).map(() => Array(size).fill(''));
    const state = wsState[gameNum];

    state.words = words;
    state.found = [];
    state.currentSelection = [];
    state.isMouseDown = false;
    state.grid = grid;

    const dirsEasy = [[1, 0], [0, 1]];
    const dirsHard = [[1, 0], [0, 1], [1, 1], [-1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1]];
    const dirs = state.diff === 'easy' ? dirsEasy : dirsHard;

    words.forEach(word => {
        let placed = false;
        let attempts = 0;
        while(!placed && attempts < 200) {
            attempts++;
            const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];
            const startX = Math.floor(Math.random() * size);
            const startY = Math.floor(Math.random() * size);
            const endX = startX + dx * (word.length - 1);
            const endY = startY + dy * (word.length - 1);

            if(endX >= 0 && endX < size && endY >= 0 && endY < size) {
                let canPlace = true;
                for(let i=0; i<word.length; i++) {
                    const cx = startX + dx * i;
                    const cy = startY + dy * i;
                    if(grid[cy][cx] !== '' && grid[cy][cx] !== word[i]) {
                        canPlace = false;
                        break;
                    }
                }
                if(canPlace) {
                    for(let i=0; i<word.length; i++) {
                        grid[startY + dy * i][startX + dx * i] = word[i];
                    }
                    placed = true;
                }
            }
        }
    });

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let y=0; y<size; y++) {
        for(let x=0; x<size; x++) {
            if(grid[y][x] === '') {
                grid[y][x] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }

    renderWsGrid(gameNum, size);
    renderWsWords(gameNum);
    document.getElementById(`g${gameNum}-feedback`).innerText = "";
}

function renderWsGrid(gameNum, size) {
    const container = document.getElementById(`g${gameNum}-grid`);
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    container.innerHTML = "";

    const state = wsState[gameNum];

    for(let y=0; y<size; y++) {
        for(let x=0; x<size; x++) {
            const cell = document.createElement('div');
            cell.className = 'ws-cell';
            cell.innerText = state.grid[y][x];
            cell.dataset.x = x;
            cell.dataset.y = y;
            container.appendChild(cell);
        }
    }

    container.onpointerdown = (e) => {
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target && target.classList.contains('ws-cell')) {
            const x = parseInt(target.dataset.x);
            const y = parseInt(target.dataset.y);
            startSelection(gameNum, x, y);
        }
    };

    container.onpointermove = (e) => {
        if (!state.isMouseDown) return;
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target && target.classList.contains('ws-cell')) {
            const x = parseInt(target.dataset.x);
            const y = parseInt(target.dataset.y);
            updateSelection(gameNum, x, y);
        }
    };

    window.onpointerup = () => { if(state.isMouseDown) endSelection(gameNum); };
}

function startSelection(gameNum, x, y) {
    const state = wsState[gameNum];
    state.isMouseDown = true;
    state.startCell = {x, y};
    state.currentSelection = [{x, y}];
    highlightCells(gameNum);
}

function updateSelection(gameNum, x, y) {
    const state = wsState[gameNum];
    if(!state.isMouseDown) return;

    const dx = x - state.startCell.x;
    const dy = y - state.startCell.y;

    if(dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
        const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
        const stepY = dy === 0 ? 0 : dy / Math.abs(dy);
        const steps = Math.max(Math.abs(dx), Math.abs(dy));

        state.currentSelection = [];
        for(let i=0; i<=steps; i++) {
            state.currentSelection.push({
                x: state.startCell.x + stepX * i,
                y: state.startCell.y + stepY * i
            });
        }
        highlightCells(gameNum);
    }
}

function highlightCells(gameNum) {
    const state = wsState[gameNum];
    document.querySelectorAll(`#g${gameNum}-grid .ws-cell`).forEach(cell => {
        if(!cell.classList.contains('found')) cell.classList.remove('selecting');
    });

    state.currentSelection.forEach(pos => {
        const cell = document.querySelector(`#g${gameNum}-grid .ws-cell[data-x="${pos.x}"][data-y="${pos.y}"]`);
        if(cell && !cell.classList.contains('found')) cell.classList.add('selecting');
    });
}

function endSelection(gameNum) {
    const state = wsState[gameNum];
    if(!state.isMouseDown) return;
    state.isMouseDown = false;

    const selectedWord = state.currentSelection.map(p => state.grid[p.y][p.x]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    const match = state.words.find(w => (w === selectedWord || w === reversedWord) && !state.found.some(f => f.word === w));

    if(match) {
        const assignedColor = highlightColors[state.found.length % highlightColors.length];
        state.found.push({ word: match, color: assignedColor });

        state.currentSelection.forEach(p => {
            const cell = document.querySelector(`#g${gameNum}-grid .ws-cell[data-x="${p.x}"][data-y="${p.y}"]`);
            if(cell) {
                cell.classList.remove('selecting');
                cell.classList.add('found');
                cell.style.backgroundColor = assignedColor;
                cell.style.color = '#000';
            }
        });
        renderWsWords(gameNum);

        if(state.found.length === state.words.length) {
            const fb = document.getElementById(`g${gameNum}-feedback`);
            fb.className = "feedback-msg text-success";
            fb.innerText = "🎉 PARABÉNS! Você encontrou todas as 9 palavras!";
        }
    } else {
        document.querySelectorAll(`#g${gameNum}-grid .ws-cell`).forEach(cell => cell.classList.remove('selecting'));
    }
    state.currentSelection = [];
}

function renderWsWords(gameNum) {
    const container = document.getElementById(`g${gameNum}-words`);
    container.innerHTML = "";
    wsState[gameNum].words.forEach(w => {
        const foundObj = wsState[gameNum].found.find(f => f.word === w);
        const item = document.createElement('div');
        item.className = 'ws-word-item' + (foundObj ? ' found' : '');
        item.innerText = (foundObj ? '✓ ' : '• ') + w;

        if(foundObj) {
            item.style.backgroundColor = foundObj.color;
            item.style.color = '#000';
        }
        container.appendChild(item);
    });
}

// JOGO 5: FORMIGA DAS LETRAS
let canvas, ctx;
let player = { x: 275, y: 230, size: 30, speed: 14 };
let activeMazePairs = [];
let currentMazeIndex = 0;
let mazeScore = 0;
let targets = [];
let isWaitingNextRound = false;

function initMazeGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    activeMazePairs = [...fullMazePairsBank].sort(() => 0.5 - Math.random()).slice(0, 10);
    mazeScore = 0;
    currentMazeIndex = 0;
    isWaitingNextRound = false;

    document.getElementById('g5-score').innerText = mazeScore;
    document.getElementById('g5-restart').style.display = 'none';
    setupMazeRound();

    window.removeEventListener('keydown', handleMazeKeyDown);
    window.addEventListener('keydown', handleMazeKeyDown);
}

function setupMazeRound() {
    if(currentMazeIndex >= activeMazePairs.length) {
        document.getElementById('g5-feedback').className = "feedback-msg text-success";
        document.getElementById('g5-feedback').innerText = "🏆 PARABÉNS! A Formiga das Letras completou a missão!";
        document.getElementById('g5-restart').style.display = 'inline-block';
        return;
    }

    document.getElementById('g5-round').innerText = currentMazeIndex + 1;
    player.x = 275;
    player.y = 230;
    isWaitingNextRound = false;

    const pair = activeMazePairs[currentMazeIndex];
    const isLeftCorrect = Math.random() < 0.5;

    targets = [
        {
            x: 30, y: 30, w: 220, h: 60,
            text: isLeftCorrect ? pair.correct : pair.wrong,
            isCorrect: isLeftCorrect
        },
        {
            x: 330, y: 30, w: 220, h: 60,
            text: isLeftCorrect ? pair.wrong : pair.correct,
            isCorrect: !isLeftCorrect
        }
    ];

    document.getElementById('g5-feedback').innerText = "";
    drawMaze();
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    targets.forEach(t => {
        ctx.fillStyle = "#A2D2FF";
        ctx.fillRect(t.x, t.y, t.w, t.h);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#1E1E1E";
        ctx.strokeRect(t.x, t.y, t.w, t.h);

        ctx.fillStyle = "#1E1E1E";
        ctx.font = "bold 22px Fredoka";
        ctx.textAlign = "center";
        ctx.fillText(t.text, t.x + t.w/2, t.y + 38);
    });

    ctx.font = "34px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText("🐜", player.x + 15, player.y + 25);
}

function movePlayer(dir) {
    if(isWaitingNextRound || currentMazeIndex >= activeMazePairs.length) return;

    if(dir === 'Up' && player.y > 10) player.y -= player.speed;
    if(dir === 'Down' && player.y < canvas.height - 40) player.y += player.speed;
    if(dir === 'Left' && player.x > 10) player.x -= player.speed;
    if(dir === 'Right' && player.x < canvas.width - 40) player.x += player.speed;

    drawMaze();
    checkMazeCollision();
}

function handleMazeKeyDown(e) {
    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        movePlayer(e.key.replace("Arrow", ""));
    }
}

function checkMazeCollision() {
    if(isWaitingNextRound) return;

    targets.forEach(t => {
        if(player.x + 5 < t.x + t.w && player.x + player.size - 5 > t.x &&
           player.y + 5 < t.y + t.h && player.y + player.size - 5 > t.y) {

            isWaitingNextRound = true;

            if(t.isCorrect) {
                mazeScore += 10;
                document.getElementById('g5-score').innerText = mazeScore;
                document.getElementById('g5-feedback').className = "feedback-msg text-success";
                document.getElementById('g5-feedback').innerText = "Muito bem! Palavra correta!";
            } else {
                document.getElementById('g5-feedback').className = "feedback-msg text-danger";
                document.getElementById('g5-feedback').innerText = "Ops! Palavra incorreta!";
            }

            currentMazeIndex++;
            setTimeout(setupMazeRound, 1200);
        }
    });
}

// Inicialização
startGame1();
