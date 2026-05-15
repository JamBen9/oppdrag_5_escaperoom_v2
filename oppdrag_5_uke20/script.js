// ----
// CONSTANTS OG DATA
// Lagrer nøkler for localStorage og gjenstander
// ----

const INVENTORY_KEY = 'escapeRoomInventory';
const STATE_KEY = 'escapeRoomState';
const itemData = {
    stein: { label: 'Stein', src: 'img/stein.png' },
    pickaxe: { label: 'Hakke', src: 'img/pickaxe.png' }
};
const sceneName = document.body.dataset.scene;
const messageEl = document.getElementById('message');

// ----
// INVENTAR-FUNKSJONER
// Håndterer lagring og henting av gjenstander
// ----

function getInventory() {
    const stored = localStorage.getItem(INVENTORY_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveInventory(inventory) {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}

// ----
// SPILLTILSTAND-FUNKSJONER
// Lagrer progresjon (f.eks. om hengelåsen er ødelagt)
// ----

function getState() {
    const stored = localStorage.getItem(STATE_KEY);
    return stored ? JSON.parse(stored) : {};
}

function saveState(state) {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

// ----
// HJELPEFUNKSJONER
// Sjekker og legger til gjenstander
// ----

function hasItem(itemId) {
    return getInventory().includes(itemId);
}

function addItem(itemId) {
    const inventory = getInventory();
    if (!inventory.includes(itemId)) {
        inventory.push(itemId);
        saveInventory(inventory);
        showMessage(`Du plukket opp ${itemData[itemId].label}.`);
    }
}

// ----
// BRUKERGRENSESNITT
// Viser meldinger
// ----

function showMessage(text) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.classList.remove('show');
    // Trigger reflow to restart animation
    void messageEl.offsetWidth;
    messageEl.classList.add('show');
}

// ----
// RESET
// Nullstiller spillet helt
// ----

function resetGame() {
    localStorage.removeItem(INVENTORY_KEY);
    localStorage.removeItem(STATE_KEY);
    window.location.href = 'index.html';
}

// ----
// SCENE-SETUP
// Setter opp interaksjonene basert på hvilket rom
// ----

function setupScene() {
    switch (sceneName) {
        case 'inside_do':
            setupInsideDo();
            break;
        case 'door':
            setupDoor();
            break;
        case 'kim':
            setupKim();
            break;
        case 'keypad':
            setupKeypad();
            break;
        case 'toolshed':
            setupToolshed();
            break;
        case 'wall':
            setupWall();
            break;
        case 'hull':
            setupHull();
            break;
        case 'ending':
            setupEnding();
            break;
        default:
            break;
    }
}

// ----
// INSIDE_DO ROM
// Plukker opp stein
// ----

function setupInsideDo() {
    const pickup = document.querySelector('[data-action="pickup-item"]');
    const stoneIcon = document.querySelector('.stein-icon');
    if (!pickup) return;
    const itemId = pickup.dataset.item;
    const hideStone = () => {
        pickup.classList.add('hidden');
        if (stoneIcon) stoneIcon.classList.add('hidden');
    };

    if (hasItem(itemId)) {
        hideStone();
        showMessage('Du har allerede steinen.');
        return;
    }

    pickup.addEventListener('click', () => {
        addItem(itemId);
        hideStone();
    });
}

// ----
// DOOR ROM
// Bryter hengelåsen med stein, åpner dør
// ----

function setupDoor() {
    const padlockButton = document.querySelector('[data-action="unlock-lock"]');
    const doorButton = document.querySelector('[data-action="open-door"]');
    const state = getState();
    const unlocked = state.padlockBroken === true;

    if (unlocked) {
        doorButton.classList.remove('hidden');
        if (padlockButton) padlockButton.classList.add('hidden');
    }

    if (padlockButton) {
        padlockButton.addEventListener('click', () => {
            if (!hasItem('stein')) {
                showMessage('Du trenger en stein for å bryte låsen.');
                return;
            }
            state.padlockBroken = true;
            saveState(state);
            doorButton.classList.remove('hidden');
            padlockButton.classList.add('hidden');
            showMessage('Låsen er ødelagt! Du kan åpne døren.');
        });
    }

    if (doorButton) {
        doorButton.addEventListener('click', () => {
            const currentState = getState();
            if (currentState.padlockBroken) {
                window.location.href = 'kim.html';
            } else {
                showMessage('Døren er låst.');
            }
        });
    }
}

// ----
// KIM ROM (UTEOMR)
// Navigering til kodelås
// ----

function setupKim() {
    const doorHitbox = document.querySelector('[href="keypad.html"]');
    if (!doorHitbox) return;
    doorHitbox.addEventListener('click', () => {
        // Navigerer til kodelås-siden.
    });
}

// ----
// KEYPAD ROM
// Innmatting av kode (0205)
// ----

function setupKeypad() {
    const display = document.getElementById('keypad-display');
    let input = '';
    const correctCode = '0205';
    const buttons = document.querySelectorAll('[data-digit]');
    const enterButton = document.querySelector('[data-action="keypad-enter"]');
    const clearButton = document.querySelector('[data-action="keypad-clear"]');

    function updateDisplay() {
        if (display) {
            display.textContent = input.padEnd(4, '_');
        }
    }

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            if (input.length < 4) {
                input += button.dataset.digit;
                updateDisplay();
            }
        });
    });

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            input = '';
            updateDisplay();
        });
    }

    if (enterButton) {
        enterButton.addEventListener('click', () => {
            if (input === correctCode) {
                window.location.href = 'toolshed.html';
            } else {
                showMessage('Feil kode. Prøv på nytt.');
                input = '';
                updateDisplay();
            }
        });
    }

    updateDisplay();
}

// ----
// TOOLSHED ROM
// Plukker opp hakke
// ----

function setupToolshed() {
    const pickup = document.querySelector('[data-action="pickup-item"]');
    if (!pickup) return;
    const itemId = pickup.dataset.item;
    if (hasItem(itemId)) {
        pickup.classList.add('hidden');
        showMessage('Du har allerede hakken.');
        return;
    }

    pickup.addEventListener('click', () => {
        addItem(itemId);
        pickup.classList.add('hidden');
    });
}

// ----
// WALL ROM
// Bryter gjennom vegg med hakke
// ----

function setupWall() {
    const wallButton = document.querySelector('[data-action="break-wall"]');
    if (!wallButton) return;
    wallButton.addEventListener('click', () => {
        if (hasItem('pickaxe')) {
            window.location.href = 'hull.html';
        } else {
            showMessage('Du trenger en hakke for å bryte gjennom.');
        }
    });
}

// ----
// HULL ROM
// Åpner veien til slutt
// ----

function setupHull() {
    const endButton = document.querySelector('[data-action="go-ending"]');
    if (!endButton) return;
    endButton.addEventListener('click', () => {
        window.location.href = 'ending.html';
    });
}

// ----
// ENDING ROM
// Viser video og start på nytt knapp
// ----

function setupEnding() {
    const video = document.getElementById('ending-video');
    const restartButton = document.getElementById('restart-game');

    if (!video || !restartButton) return;
    restartButton.classList.add('hidden');
    video.addEventListener('ended', () => {
        restartButton.classList.remove('hidden');
    });

    restartButton.addEventListener('click', resetGame);
}

// ----
// INITIALISERING
// Starter spillet når siden lastes
// ----

document.addEventListener('DOMContentLoaded', () => {
    // Sett opp restart-knapp på alle sider
    const restartButton = document.getElementById('restart-game');
    if (restartButton) {
        restartButton.addEventListener('click', resetGame);
    }
    
    setupScene();
});
