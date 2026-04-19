window.addEventListener('DOMContentLoaded', () => {
    console.log("NFA Simulator: Initializing...");

    // DOM Elements
    const transitionsContainer = document.getElementById('transition-rows');
    const btnAddTransition = document.getElementById('btn-add-transition');
    const btnBuild = document.getElementById('btn-build');
    const btnSimulate = document.getElementById('btn-simulate');
    const inputTestString = document.getElementById('test-string');
    const resultBox = document.getElementById('result-box');
    const graphContainer = document.getElementById('graph-container');

    // State
    let nfaData = null;
    let network = null;

    if (!btnAddTransition || !btnBuild || !btnSimulate) {
        console.error("NFA Simulator: One or more critical UI elements not found!");
        return;
    }

// Add Transition Row
btnAddTransition.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'transition-row';
    row.innerHTML = `
        <input type="text" class="t-from" placeholder="e.g. q0">
        <input type="text" class="t-input" placeholder="e.g. a">
        <input type="text" class="t-to" placeholder="e.g. q1">
        <button class="btn-remove">X</button>
    `;

    row.querySelector('.btn-remove').addEventListener('click', () => {
        row.remove();
    });

    transitionsContainer.appendChild(row);
});

// Setup existing remove buttons
document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.transition-row').remove();
    });
});

// Build Automaton Builder
btnBuild.addEventListener('click', () => {
    // 1. Collect Data
    const numStatesNum = parseInt(document.getElementById('num-states').value) || 0;
    const startState = document.getElementById('start-state').value.trim();
    const finalStatesRaw = document.getElementById('final-states').value;

    const finalStatesSet = new Set(
        finalStatesRaw.split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0)
    );

    // Collect transitions
    const rows = document.querySelectorAll('.transition-row');
    const builtTransitions = []; // for graph
    const nfaMap = {}; // for simulation

    let hasErrors = false;
    let validAlphabet = new Set();
    let allMentionedStates = new Set();

    allMentionedStates.add(startState);

    rows.forEach(row => {
        const from = row.querySelector('.t-from').value.trim();
        const input = row.querySelector('.t-input').value.trim();
        const to = row.querySelector('.t-to').value.trim();

        if (from && input && to) {
            builtTransitions.push({ from, input, to });

            // Build map structure: { 'q0': { 'a': ['q1', 'q2'] } }
            if (!nfaMap[from]) nfaMap[from] = {};
            if (!nfaMap[from][input]) nfaMap[from][input] = [];

            if (!nfaMap[from][input].includes(to)) {
                nfaMap[from][input].push(to);
            }

            validAlphabet.add(input);
            allMentionedStates.add(from);
            allMentionedStates.add(to);
        }
    });

    if (numStatesNum <= 0 || !startState) {
        showResult('Please specify valid number of states and an initial state.', 'error');
        return;
    }

    nfaData = {
        startState,
        finalStates: finalStatesSet,
        map: nfaMap
    };

    showResult('Automaton built successfully!', 'success');

    // 2. Draw Graph using vis-network
    drawGraph(allMentionedStates, finalStatesSet, builtTransitions);
});

    function drawGraph(statesSet, finalsSet, links) {
        // Check if vis library is loaded
        if (typeof vis === 'undefined') {
            console.error("vis-network library is not loaded! Try refreshing the page.");
            showResult('Error: Visualization library (vis.js) failed to load. Please check your internet connection.', 'error');
            return;
        }

        if (network !== null) {
            network.destroy();
            network = null;
        }

        const nodesData = [];
        statesSet.forEach(s => {
            let isFinal = finalsSet.has(s);
            let isStart = (s === nfaData.startState);

            let colorObj = {
                background: "#161b22",
                border: "#388bfd",
                highlight: { background: "#1f6feb", border: "#58a6ff" }
            };

            if (isFinal) {
                colorObj.border = "#3fb950";
                colorObj.background = "#161b22";
                colorObj.highlight.border = "#56d364";
                colorObj.highlight.background = "#2ea043";
            }

            let label = s;
            if (isStart) {
                label = "→ " + s;
            }

            nodesData.push({
                id: s,
                label: label,
                color: colorObj,
                font: { color: "#c9d1d9", face: 'Inter', size: 16 },
                borderWidth: isFinal ? 3 : 2,
                shape: isFinal ? 'circle' : 'ellipse'
            });
        });

        const combinedLinks = {};
        links.forEach(l => {
            let key = l.from + '-' + l.to;
            if (combinedLinks[key]) {
                let existingLabels = combinedLinks[key].label.split(',').map(s => s.trim());
                if (!existingLabels.includes(l.input)) {
                    combinedLinks[key].label += ', ' + l.input;
                }
            } else {
                combinedLinks[key] = {
                    from: l.from,
                    to: l.to,
                    label: l.input
                };
            }
        });

        const edgesData = Object.values(combinedLinks).map(l => ({
            from: l.from,
            to: l.to,
            label: l.label,
            font: { color: "#c9d1d9", size: 14, align: 'top', face: 'Inter', background: 'rgba(13, 17, 23, 0.8)' },
            arrows: {
                to: { enabled: true, scaleFactor: 0.8 }
            },
            color: { color: '#8b949e', highlight: '#58a6ff' },
            smooth: { type: 'dynamic' },
            width: 1.5,
            selectionWidth: 2
        }));

        try {
            const data = {
                nodes: new vis.DataSet(nodesData),
                edges: new vis.DataSet(edgesData)
            };

            const options = {
                physics: {
                    enabled: true,
                    barnesHut: { springLength: 150 },
                    stabilization: {
                        enabled: true,
                        iterations: 200
                    }
                },
                interaction: {
                    dragNodes: false,
                    dragView: false,
                    hover: true,
                    zoomView: false
                },
                edges: {
                    smooth: true
                }
            };

            network = new vis.Network(graphContainer, data, options);

            network.on("stabilizationIterationsDone", function () {
                network.setOptions({ physics: false });
            });
        } catch (err) {
            console.error("Error creating network graph:", err);
            showResult('Error rendering graph. Check browser console.', 'error');
        }
    }

// Helper to delay execution
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Simulator with Step-by-Step UI
btnSimulate.addEventListener('click', async () => {
    if (!nfaData) {
        showResult('Please build the automaton first.', 'error');
        return;
    }

    const str = inputTestString.value.trim();
    btnSimulate.disabled = true;

    // Function to compute Epsilon Closure
    function getEpsilonClosure(states) {
        let stack = Array.from(states);
        let closure = new Set(states);

        while (stack.length > 0) {
            let state = stack.pop();
            ['e', 'ε'].forEach(eps => {
                if (nfaData.map[state] && nfaData.map[state][eps]) {
                    nfaData.map[state][eps].forEach(ns => {
                        if (!closure.has(ns)) {
                            closure.add(ns);
                            stack.push(ns);
                        }
                    });
                }
            });
        }
        return closure;
    }

    function highlightStates(states) {
        if (!network || !network.body.data.nodes) return;
        const nodesData = network.body.data.nodes;
        const updates = [];
        
        nodesData.forEach(node => {
            const isFinal = nfaData.finalStates.has(node.id);
            const isActive = states.has(node.id);
            
            let colorObj = {
                background: "#161b22",
                border: "#388bfd",
                highlight: { background: "#1f6feb", border: "#58a6ff" }
            };
            
            if (isFinal) {
                colorObj.border = "#3fb950";
                colorObj.background = "#161b22";
                colorObj.highlight.border = "#56d364";
                colorObj.highlight.background = "#2ea043";
            }
            
            if (isActive) {
                colorObj.border = "#f2cc60"; // Gold color for active states
                colorObj.background = "#d29922";
                
                if (isFinal) {
                    colorObj.border = "#5ee871"; // Brighter green when an active state is final
                    colorObj.background = "#3fb950";
                }
            }

            updates.push({
                id: node.id,
                color: colorObj,
                borderWidth: isActive ? 4 : (isFinal ? 3 : 2),
                font: { color: isActive ? "#ffffff" : "#c9d1d9", face: 'Inter', size: 16 }
            });
        });
        nodesData.update(updates);
    }

    let activeStates = getEpsilonClosure(new Set([nfaData.startState]));
    showResult(`Initialization: Starting at ${Array.from(activeStates).join(', ')}`, 'neutral');
    highlightStates(activeStates);
    await sleep(800);

    // NFA Evaluation - Step by step
    for (let i = 0; i < str.length; i++) {
        const symbol = str[i];
        
        let nextStates = new Set();
        activeStates.forEach(state => {
            if (nfaData.map[state] && nfaData.map[state][symbol]) {
                nfaData.map[state][symbol].forEach(ns => nextStates.add(ns));
            }
        });

        activeStates = getEpsilonClosure(nextStates);
        
        // Update UI
        showResult(`Consuming '${symbol}': Moving to ${Array.from(activeStates).join(', ')}`, 'neutral');
        highlightStates(activeStates);
        await sleep(800);

        if (activeStates.size === 0) {
            break; // No further valid paths
        }
    }

    // Check acceptance
    let isAccepted = false;
    activeStates.forEach(s => {
        if (nfaData.finalStates.has(s)) {
            isAccepted = true;
        }
    });

    if (isAccepted) {
        showResult(`String "${str}" is ACCEPTED. Ended in state(s): ${Array.from(activeStates).join(', ')}`, 'success');
    } else {
        showResult(`String "${str}" is REJECTED. Ended in state(s): ${Array.from(activeStates).join(', ') || 'NONE'}`, 'error');
    }

    btnSimulate.disabled = false;
});

    function showResult(msg, type) {
        resultBox.innerHTML = msg;
        resultBox.className = 'result-display';

        if (type === 'success') {
            resultBox.classList.add('result-success');
        } else if (type === 'error') {
            resultBox.classList.add('result-error');
        } else {
            resultBox.classList.add('result-neutral');
        }
    }

    console.log("NFA Simulator: Ready.");
});
