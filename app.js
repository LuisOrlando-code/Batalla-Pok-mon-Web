// ── app.js ──
// Control de pantallas y flujo de la aplicación

let playerPoke = null;
let enemyPoke  = null;

// ── Mostrar pantalla ──
function showScreen(id) {
  ['screen-select', 'screen-battle', 'screen-result', 'loading'].forEach(s => {
    document.getElementById(s).style.display = 'none';
  });
  document.getElementById(id).style.display = 'flex';
}

// ── Buscar Pokémon del jugador ──
async function buscarPokemon() {
  const val = document.getElementById('poke-input').value.trim().toLowerCase();
  if (!val) return;

  document.getElementById('select-error').textContent = '';
  showScreen('loading');
  document.getElementById('loading-text').textContent = 'Buscando Pokémon...';

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${val}`);
    if (!res.ok) throw new Error('No encontrado');
    playerPoke = await res.json();

    showScreen('screen-select');
    const preview = document.getElementById('pokemon-preview');
    preview.style.display = 'flex';
    document.getElementById('preview-sprite').src        = playerPoke.sprites.front_default;
    document.getElementById('preview-name').textContent  = playerPoke.name;
    document.getElementById('preview-type').textContent  =
      '🏷️ ' + playerPoke.types.map(t => t.type.name).join(' / ');
    document.getElementById('btn-batalla').style.display = 'block';
  } catch (e) {
    showScreen('screen-select');
    document.getElementById('select-error').textContent = '❌ Pokémon no encontrado';
  }
}

// ── Iniciar batalla ──
async function iniciarBatalla() {
  showScreen('loading');
  document.getElementById('loading-text').textContent = 'La CPU está eligiendo...';

  try {
    enemyPoke = await fetchEnemyPokemon();
  } catch (e) {
    enemyPoke = playerPoke; // fallback
  }

  // Inicializar HP
  initHP(playerPoke, enemyPoke);

  // Actualizar UI
  document.getElementById('player-name').textContent = playerPoke.name;
  document.getElementById('enemy-name').textContent  = enemyPoke.name;
  document.getElementById('player-sprite').src =
    playerPoke.sprites.back_default || playerPoke.sprites.front_default;
  document.getElementById('enemy-sprite').src = enemyPoke.sprites.front_default;

  updateHPBar('player');
  updateHPBar('enemy');

  document.getElementById('battle-log').innerHTML = '';
  addLog(`¡${capitalize(enemyPoke.name)} apareció!`);
  addLog(`¡Ve, ${capitalize(playerPoke.name)}!`);

  turnoActivo = true;
  document.getElementById('btn-attack').disabled = false;
  showScreen('screen-battle');
}

// ── Ataque del jugador ──
async function playerAttack() {
  if (!turnoActivo) return;
  turnoActivo = false;
  document.getElementById('btn-attack').disabled = true;

  // Jugador ataca
  const dmg = calcDamage(playerPoke, enemyPoke);
  enemyHP   = Math.max(enemyHP - dmg, 0);
  addLog(`${capitalize(playerPoke.name)} atacó por ${dmg} de daño!`, 'dmg');
  animateHit('enemy-sprite');
  updateHPBar('enemy');

  await delay(600);

  if (enemyHP <= 0) {
    animateFaint('enemy-sprite');
    await delay(700);
    endGame(true);
    return;
  }

  // CPU ataca
  await delay(400);
  const dmgCpu = calcDamage(enemyPoke, playerPoke);
  playerHP     = Math.max(playerHP - dmgCpu, 0);
  addLog(`${capitalize(enemyPoke.name)} contraatacó por ${dmgCpu} de daño!`, 'dmg');
  animateHit('player-sprite');
  updateHPBar('player');

  await delay(600);

  if (playerHP <= 0) {
    animateFaint('player-sprite');
    await delay(700);
    endGame(false);
    return;
  }

  turnoActivo = true;
  document.getElementById('btn-attack').disabled = false;
}

// ── Fin del juego ──
function endGame(win) {
  showScreen('screen-result');
  const title  = document.getElementById('result-title');
  const sprite = document.getElementById('result-sprite');
  const msg    = document.getElementById('result-msg');

  if (win) {
    title.textContent  = '¡GANASTE!';
    title.className    = 'win';
    sprite.src         = playerPoke.sprites.front_default;
    msg.textContent    = `¡${capitalize(playerPoke.name)} derrotó a ${capitalize(enemyPoke.name)}!`;
  } else {
    title.textContent  = '¡PERDISTE!';
    title.className    = 'lose';
    sprite.src         = enemyPoke.sprites.front_default;
    msg.textContent    = `${capitalize(enemyPoke.name)} fue demasiado fuerte...`;
  }
}

// ── Reiniciar ──
function reiniciar() {
  playerPoke = null;
  enemyPoke  = null;
  document.getElementById('poke-input').value          = '';
  document.getElementById('pokemon-preview').style.display = 'none';
  document.getElementById('btn-batalla').style.display = 'none';
  document.getElementById('select-error').textContent  = '';
  showScreen('screen-select');
}

// ── Enter en el input ──
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('poke-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') buscarPokemon();
  });
});