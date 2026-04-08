// NFA Definitions Collection
const nfaCollection = {
    'contains-01': {
        name: 'Contains "01"',
        description: 'Nondeterministic Finite Automaton testing if a string contains <strong>"01"</strong>.',
        pattern: '[01]*',
        logic: {
            states: ['q0', 'q1', 'q2'],
            startState: 'q0',
            acceptStates: new Set(['q2']),
            transitions: {
                'q0': { '0': ['q0', 'q1'], '1': ['q0'] },
                'q1': { '0': [], '1': ['q2'] },
                'q2': { '0': ['q2'], '1': ['q2'] }
            }
        },
        layout: {
            nodes: [
                { id: 'q0', x: 150, y: 150, title: 'q0', accept: false },
                { id: 'q1', x: 300, y: 150, title: 'q1', accept: false },
                { id: 'q2', x: 480, y: 150, title: 'q2', accept: true }
            ],
            edges: [
                { id: 'entry', type: 'forward', from: null, to: 'q0', label: '', edgeClass: 'entry', d: 'M 50 150 L 100 150' },
                { id: 'q0-loop', type: 'loop', from: 'q0', to: 'q0', label: '0, 1', edgeClass: 'q0-loop', d: 'M 120 120 C 80 40, 160 40, 120 120', lx: 120, ly: 50 },
                { id: 'q0-q1', type: 'forward', from: 'q0', to: 'q1', label: '0', edgeClass: 'q0-q1', d: 'M 170 150 L 270 150', lx: 220, ly: 140 },
                { id: 'q1-q2', type: 'forward', from: 'q1', to: 'q2', label: '1', edgeClass: 'q1-q2', d: 'M 330 150 L 430 150', lx: 380, ly: 140 },
                { id: 'q2-loop', type: 'loop', from: 'q2', to: 'q2', label: '0, 1', edgeClass: 'q2-loop', d: 'M 480 120 C 440 40, 520 40, 480 120', lx: 480, ly: 50 }
            ]
        }
    },
    'ends-11': {
        name: 'Ends with "11"',
        description: 'Nondeterministic Finite Automaton testing if a string ends with <strong>"11"</strong>.',
        pattern: '[01]*',
        logic: {
            states: ['q0', 'q1', 'q2'],
            startState: 'q0',
            acceptStates: new Set(['q2']),
            transitions: {
                'q0': { '0': ['q0'], '1': ['q0', 'q1'] },
                'q1': { '0': [], '1': ['q2'] },
                'q2': { '0': [], '1': [] }
            }
        },
        layout: {
            nodes: [
                { id: 'q0', x: 150, y: 150, title: 'q0', accept: false },
                { id: 'q1', x: 300, y: 150, title: 'q1', accept: false },
                { id: 'q2', x: 480, y: 150, title: 'q2', accept: true }
            ],
            edges: [
                { id: 'entry', type: 'forward', from: null, to: 'q0', label: '', edgeClass: 'entry', d: 'M 50 150 L 100 150' },
                { id: 'q0-loop', type: 'loop', from: 'q0', to: 'q0', label: '0, 1', edgeClass: 'q0-loop', d: 'M 120 120 C 80 40, 160 40, 120 120', lx: 120, ly: 50 },
                { id: 'q0-q1', type: 'forward', from: 'q0', to: 'q1', label: '1', edgeClass: 'q0-q1', d: 'M 170 150 L 270 150', lx: 220, ly: 140 },
                { id: 'q1-q2', type: 'forward', from: 'q1', to: 'q2', label: '1', edgeClass: 'q1-q2', d: 'M 330 150 L 430 150', lx: 380, ly: 140 }
            ]
        }
    },
    'even-zeros': {
        name: 'Even number of 0s',
        description: 'Finite Automaton that accepts binary strings with an <strong>Even number of zeroes</strong>.',
        pattern: '[01]*',
        logic: {
            states: ['q0', 'q1'],
            startState: 'q0',
            acceptStates: new Set(['q0']),
            transitions: {
                'q0': { '0': ['q1'], '1': ['q0'] },
                'q1': { '0': ['q0'], '1': ['q1'] }
            }
        },
        layout: {
            nodes: [
                { id: 'q0', x: 200, y: 150, title: 'q0', accept: true },
                { id: 'q1', x: 400, y: 150, title: 'q1', accept: false }
            ],
            edges: [
                { id: 'entry', type: 'forward', from: null, to: 'q0', label: '', edgeClass: 'entry', d: 'M 100 150 L 150 150' },
                { id: 'q0-loop', type: 'loop', from: 'q0', to: 'q0', label: '1', edgeClass: 'q0-loop', d: 'M 170 120 C 130 40, 210 40, 170 120', lx: 170, ly: 50 },
                { id: 'q0-q1', type: 'forward', from: 'q0', to: 'q1', label: '0', edgeClass: 'q0-q1', d: 'M 220 130 Q 300 100 380 130', lx: 300, ly: 100 },
                { id: 'q1-q0', type: 'forward', from: 'q1', to: 'q0', label: '0', edgeClass: 'q1-q0', d: 'M 380 170 Q 300 200 220 170', lx: 300, ly: 200 },
                { id: 'q1-loop', type: 'loop', from: 'q1', to: 'q1', label: '1', edgeClass: 'q1-loop', d: 'M 370 120 C 330 40, 410 40, 370 120', lx: 370, ly: 50 }
            ]
        }
    }
};

// DOM Elements
const inputEl = document.getElementById('string-input');
const btnPlay = document.getElementById('btn-play');
const btnStep = document.getElementById('btn-step');
const btnReset = document.getElementById('btn-reset');
const tapeEl = document.getElementById('tape');
const historyEl = document.getElementById('history');
const statusEl = document.getElementById('final-status');
const selectorEl = document.getElementById('example-selector');
const descEl = document.getElementById('nfa-description');
const svgLayer = document.getElementById('svg-layer');
const nodesLayer = document.getElementById('nodes-layer');

// State Variables
let currentNfaKey = 'contains-01';
let currentNfa = nfaCollection[currentNfaKey];
let currentString = "";
let currentIndex = 0;
let activeStates = new Set();
let isPlaying = false;
let playInterval = null;
let simulationComplete = false;
let historyRecords = []; // Tracks current session history

// Initialize
switchNfa(currentNfaKey);

// Event Listeners
selectorEl.addEventListener('change', (e) => {
    switchNfa(e.target.value);
});

btnPlay.addEventListener('click', togglePlay);
btnStep.addEventListener('click', () => {
    if (!isPlaying && !simulationComplete) stepSimulation();
});
btnReset.addEventListener('click', resetSimulation);
inputEl.addEventListener('input', (e) => {
    // Only allow valid patterns (usually 01)
    e.target.value = e.target.value.replace(/[^01]/g, '');
    if (!isPlaying) {
        currentString = e.target.value;
        if (currentString.length === 0) {
            btnPlay.disabled = true;
            btnStep.disabled = true;
        } else {
            btnPlay.disabled = false;
            btnStep.disabled = false;
        }
        renderTape();
    }
});
inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        resetAndStartPlay();
    }
});

function switchNfa(key) {
    stopPlay();
    currentNfaKey = key;
    currentNfa = nfaCollection[key];

    // Update UI Text
    descEl.innerHTML = currentNfa.description;

    // Clear history for new machine context
    historyRecords = [];
    renderHistory();

    // Render Graph
    buildGraph();

    // Reset Data
    inputEl.value = '';
    currentString = '';
    btnPlay.disabled = true;
    btnStep.disabled = true;

    resetSimulation();
}

function buildGraph() {
    // Clear Existing
    const defs = `<defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="28" refY="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.4)" />
        </marker>
        <marker id="arrow-active" markerWidth="10" markerHeight="10" refX="28" refY="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#00f3ff" />
        </marker>
    </defs>`;

    let svgContent = defs;
    let nodesContent = '';

    // Build Edges
    currentNfa.layout.edges.forEach(edge => {
        let marker = edge.id === 'entry' ? 'url(#arrow)' : 'url(#arrow)';
        svgContent += `
            <path class="transition ${edge.edgeClass} edge-${edge.id}" d="${edge.d}" 
                  stroke="rgba(255,255,255,0.2)" stroke-width="2" fill="transparent" 
                  marker-end="${marker}" />
        `;
        if (edge.label) {
            svgContent += `<text class="trans-label label-${edge.id}" x="${edge.lx}" y="${edge.ly}">${edge.label}</text>`;
        }
    });

    // Build Nodes
    currentNfa.layout.nodes.forEach(node => {
        const acceptClass = node.accept ? 'accept-node' : '';
        const innerCircle = node.accept ? '<div class="inner-circle"></div>' : '';
        nodesContent += `
            <div class="state-node ${acceptClass}" id="node-${node.id}" style="left: ${node.x}px; top: ${node.y}px;">
                <span>${node.title}</span>
                ${innerCircle}
            </div>
        `;
    });

    svgLayer.innerHTML = svgContent;
    nodesLayer.innerHTML = nodesContent;
}

function addHistoryEntry(str, isAccepted) {
    if (str.length === 0) return;
    historyRecords.push({ str, isAccepted });
    renderHistory();
}

function renderHistory() {
    historyEl.innerHTML = '';
    if (historyRecords.length === 0) {
        historyEl.innerHTML = '<p class="history-entry system">No strings tested yet.</p>';
        return;
    }

    historyRecords.forEach(record => {
        const div = document.createElement('div');
        div.className = 'history-entry';

        const badgeClass = record.isAccepted ? 'accept' : 'reject';
        const badgeText = record.isAccepted ? 'Accepted' : 'Rejected';

        div.innerHTML = `
            <span class="history-string">${record.str}</span>
            <span class="history-badge ${badgeClass}">${badgeText}</span>
        `;
        historyEl.appendChild(div);
    });
    historyEl.scrollTop = historyEl.scrollHeight;
}

function renderTape() {
    tapeEl.innerHTML = '';
    for (let i = 0; i < currentString.length; i++) {
        const div = document.createElement('div');
        div.className = 'tape-cell';
        div.textContent = currentString[i];
        if (i < currentIndex) div.classList.add('processed');
        if (i === currentIndex && !simulationComplete) div.classList.add('active');
        tapeEl.appendChild(div);
    }

    const offset = -(currentIndex * 50) + 25;
    tapeEl.style.transform = `translateX(-${currentIndex * 50 + 25}px)`;
}

function updateVisualNodes() {
    document.querySelectorAll('.state-node').forEach(node => {
        node.classList.remove('active', 'result-accept', 'result-reject');
    });

    document.querySelectorAll('.transition').forEach(t => {
        t.classList.remove('active');
        if (t.classList.contains('entry')) return;
        t.setAttribute('marker-end', 'url(#arrow)');
    });
    document.querySelectorAll('.trans-label').forEach(l => l.classList.remove('active'));

    activeStates.forEach(state => {
        const node = document.getElementById(`node-${state}`);
        if (node) node.classList.add('active');
    });
}

function flashTransition(fromState, symbol, toStates) {
    toStates.forEach(toState => {
        const edge = currentNfa.layout.edges.find(e =>
            e.from === fromState &&
            e.to === toState &&
            e.label.includes(symbol)
        );

        if (edge) {
            highlightEdge(edge.id);
        }
    });
}

function highlightEdge(edgeId) {
    const el = document.querySelector(`.edge-${edgeId}`);
    if (el) {
        el.classList.add('active');
        el.setAttribute('marker-end', 'url(#arrow-active)');

        const label = document.querySelector(`.label-${edgeId}`);
        if (label) {
            label.classList.add('active');
        }
    }
}

function resetSimulation() {
    stopPlay();
    currentString = inputEl.value;
    currentIndex = 0;
    activeStates = new Set([currentNfa.logic.startState]);
    simulationComplete = false;

    statusEl.textContent = 'Awaiting Input...';
    statusEl.className = '';

    btnStep.disabled = currentString.length === 0;
    btnPlay.disabled = currentString.length === 0;
    inputEl.disabled = false;

    renderTape();
    updateVisualNodes();
}

function resetAndStartPlay() {
    if (currentString.length > 0) {
        resetSimulation();
        togglePlay();
    }
}

function togglePlay() {
    if (!currentString) return;

    if (isPlaying) {
        stopPlay();
    } else {
        if (simulationComplete) resetSimulation();
        isPlaying = true;
        btnPlay.textContent = 'Pause';
        btnPlay.classList.replace('primary-btn', 'secondary-btn');
        inputEl.disabled = true;
        btnStep.disabled = true;

        playInterval = setInterval(() => {
            stepSimulation();
        }, 1000);
    }
}

function stopPlay() {
    isPlaying = false;
    clearInterval(playInterval);
    btnPlay.textContent = 'Simulate';
    btnPlay.classList.replace('secondary-btn', 'primary-btn');
    btnStep.disabled = simulationComplete || currentString.length === 0;
}

function stepSimulation() {
    if (currentIndex >= currentString.length) {
        finishSimulation();
        return;
    }

    const symbol = currentString[currentIndex];
    const newActiveStates = new Set();

    document.querySelectorAll('.transition').forEach(t => t.classList.remove('active'));

    activeStates.forEach(state => {
        const transitionsMap = currentNfa.logic.transitions[state];
        if (transitionsMap && transitionsMap[symbol]) {
            const nextStates = transitionsMap[symbol];
            flashTransition(state, symbol, nextStates);
            for (let nextState of nextStates) {
                newActiveStates.add(nextState);
            }
        }
    });

    activeStates = newActiveStates;
    currentIndex++;
    renderTape();

    setTimeout(() => {
        updateVisualNodes();

        if (activeStates.size === 0) {
            finishSimulation();
        } else {
            if (currentIndex >= currentString.length) {
                finishSimulation();
            }
        }
    }, 400);
}

function finishSimulation() {
    stopPlay();
    simulationComplete = true;
    inputEl.disabled = false;
    btnStep.disabled = true;

    renderTape();

    let isAccepted = false;
    activeStates.forEach(state => {
        if (currentNfa.logic.acceptStates.has(state)) {
            isAccepted = true;
        }
    });

    if (isAccepted) {
        statusEl.textContent = 'String Accepted!';
        statusEl.className = 'status-accept';

        activeStates.forEach(state => {
            const node = document.getElementById(`node-${state}`);
            if (currentNfa.logic.acceptStates.has(state)) {
                node.classList.add('result-accept');
            }
        });
    } else {
        statusEl.textContent = 'String Rejected!';
        statusEl.className = 'status-reject';

        activeStates.forEach(state => {
            const node = document.getElementById(`node-${state}`);
            if (node) node.classList.add('result-reject');
        });
    }

    // Add to history
    addHistoryEntry(currentString, isAccepted);
}
