// hjelp av ai

// lagrer spillprogresjon
function saveProgress(state) {
  sessionStorage.setItem("escapeProgress", JSON.stringify(state));
}

// laster spillprogresjon
function loadProgress() {
  const data = sessionStorage.getItem("escapeProgress");
  return data ? JSON.parse(data) : { items: [] };
}

// legger til et item i spillerens inventar
function pickUpItem(itemName) {
  const progress = loadProgress();
  if (!progress.items.includes(itemName)) {
    progress.items.push(itemName);
    saveProgress(progress);
    alert('Picked up ' + itemName); // debug
  }
}

// sjekker om spilleren har et bestemt item
function hasItem(itemName) {
  const progress = loadProgress();
  return progress.items.includes(itemName);
}

// --------------------------------------------------


// keypad funksjoner
function clearCode() {
  document.getElementById('code').value = '';
}

function submitCode() {
  const code = document.getElementById('code').value;
  if (code === '0205') {
    window.location.href = 'toolshed.html';
  } else {
    alert('Wrong code!');
  }
}

// --------------------------------------------------

// fjerner gjenstander når du plugger dem opp
window.onload = function() {
    if (hasItem('stein')) {
        const stein = document.querySelector('.stein');
        if (stein) stein.style.display = 'none';
    }
    if (hasItem('pickaxe')) {
        const pickaxe = document.querySelector('.pickaxe');
        if (pickaxe) pickaxe.style.display = 'none';
    }
};


// ---------------------------------------------



// låser dører til du har plukket opp gjenstanden som trengs

function checkAccess(requiredItem, url) {
  ('Has ' + requiredItem + ': ' + hasItem(requiredItem)); // debug
    if (hasItem(requiredItem)) {
        window.location.href = url;
    } else {
        alert('You need the ' + requiredItem + ' to go there!');
    }
}

// ---------------------------------------------

function resetProgress() {
    if (confirm('Are you sure you want to reset all progress?')) {
        sessionStorage.clear();
        location.href = 'index.html'; // or location.reload();
    }
}