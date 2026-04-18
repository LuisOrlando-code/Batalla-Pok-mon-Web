// ── batalla.js ──
// Lógica de combate por turnos

const RANDOM_IDS = Array.from({ length: 151 }, (_, i) => i + 1);

// Estado de la batalla
let playerHP   = 0;
let enemyHP    = 0;
let playerMaxHP = 0;
let enemyMaxHP  = 0;
let turnoActivo = false;

// ── Obtener stat de un Pokémon ──
function getStat(poke, name) {
  const s = poke.stats.find(s => s.stat.name === name);
  return s ? s.base_stat : 50;
}

function getHP(poke)    { return getStat(poke, 'hp'); }
function getAtk(poke)   { return getStat(poke, 'attack'); }
function getDef(poke)   { return getStat(poke, 'defense'); }
function getSpAtk(poke) { return getStat(poke, 'special-attack'); }

// ── Calcular daño ──
function calcDamage(attacker, defender) {
  const atk  = getAtk(attacker) + getSpAtk(attacker);
  const def  = Math.max(getDef(defender), 1);
  const base = Math.floor((atk / def) * 20) + 5;
  const variance = Math.floor(Math.random() * 11) - 5;
  return Math.max(base + variance, 1);
}

// ── Obtener Pokémon enemigo aleatorio ──
async function fetchEnemyPokemon() {
  const randId = RANDOM_IDS[Math.floor(Math.random() * RANDOM_IDS.length)];
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randId}`);
  return await res.json();
}

// ── Inicializar HP ──
function initHP(player, enemy) {
  playerMaxHP = getHP(player) * 2;
  enemyMaxHP  = getHP(enemy)  * 2;
  playerHP    = playerMaxHP;
  enemyHP     = enemyMaxHP;
}

// ── Actualizar barra HP en el DOM ──
function updateHPBar(who) {
  const hp    = who === 'player' ? playerHP : enemyHP;
  const maxHP = who === 'player' ? playerMaxHP : enemyMaxHP;
  const pct   = Math.max((hp / maxHP) * 100, 0);
  const fill  = document.getElementById(`${who}-hp-fill`);
  const text  = document.getElementById(`${who}-hp-text`);
  fill.style.width      = pct + '%';
  fill.style.background = pct > 50
    ? 'var(--hp-green)'
    : pct > 20
      ? 'var(--hp-yellow)'
      : 'var(--hp-red)';
  text.textContent = `${hp} / ${maxHP}`;
}

// ── Agregar línea al log de batalla ──
function addLog(msg, cls = '') {
  const log  = document.getElementById('battle-log');
  const line = document.createElement('div');
  line.className   = 'log-line' + (cls ? ' ' + cls : '');
  line.textContent = '▶ ' + msg;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

// ── Animación de golpe ──
function animateHit(spriteId) {
  const el = document.getElementById(spriteId);
  el.classList.remove('shake');
  void el.offsetWidth; // reflow
  el.classList.add('shake');
}

// ── Animación de derrota ──
function animateFaint(spriteId) {
  document.getElementById(spriteId).classList.add('faint');
}

// ── Utilidades ──
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }