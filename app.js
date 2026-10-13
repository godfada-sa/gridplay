(() => {
  'use strict';
  const WINNING_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const board = Array(9).fill(null); // The 1D view is easy to render; row/column data is shown live below.
  let current = 'X', gameOver = false, moveCount = 0, round = 1;
  const scores = { X: 0, O: 0, draw: 0 };
  const $ = id => document.getElementById(id);

  function showLoader() {
    const loader = $('loader');
    if (reducedMotion) { loader.hidden = true; return; }
    loader.hidden = false;
    setTimeout(() => { loader.hidden = true; }, 1250);
  }
  showLoader();

  function boardAsRows() { return [board.slice(0,3), board.slice(3,6), board.slice(6,9)]; }
  function renderBoard() {
    const container = $('board-grid'); container.replaceChildren();
    board.forEach((value, index) => {
      const cell = document.createElement('button'); cell.type = 'button'; cell.className = `cell ${value ? `filled ${value.toLowerCase()}` : ''}`; cell.dataset.index = index; cell.setAttribute('role', 'gridcell'); cell.setAttribute('aria-label', `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}${value ? `, ${value}` : ', empty'}`); cell.textContent = value === 'X' ? '×' : value === 'O' ? '○' : '';
      cell.disabled = Boolean(value) || gameOver;
      cell.addEventListener('click', () => play(index)); container.append(cell);
    });
    $('array-output').textContent = `const board = [\n${boardAsRows().map((row, i) => `  [${row.map(v => v ? `'${v}'` : 'null').join(', ')}]${i < 2 ? ',' : ''}  // row ${i}`).join('\n')}\n];`;
    $('move-count').textContent = `${moveCount} ${moveCount === 1 ? 'move' : 'moves'}`;
    $('round-number').textContent = String(round);
    $('score-x').textContent = scores.X; $('score-o').textContent = scores.O; $('score-draw').textContent = scores.draw;
  }

  function getResult() {
    for (const line of WINNING_LINES) if (line.every(index => board[index] === current)) return { winner: current, line };
    if (board.every(Boolean)) return { winner: 'draw', line: [] };
    return null;
  }
  function updateStatus(text, color = '') { $('turn-status').innerHTML = `<i class="status-dot"${color ? ` style="background:${color}"` : ''}></i><span>${text}</span>`; }
  function play(index) {
    if (gameOver || board[index]) return;
    board[index] = current; moveCount += 1; renderBoard();
    const result = getResult();
    if (result) finish(result);
    else { current = current === 'X' ? 'O' : 'X'; updateStatus(`Player ${current}'s turn`, current === 'X' ? '' : 'var(--yellow)'); }
  }
  function finish(result) {
    gameOver = true;
    result.line.forEach(index => $('board-grid').children[index].classList.add('win'));
    if (result.winner === 'draw') { scores.draw += 1; updateStatus('A draw. Beautifully even.', 'var(--yellow)'); $('result-title').textContent = 'It’s a draw.'; $('result-message').textContent = 'No empty squares, no winner. Run it back.'; }
    else { scores[result.winner] += 1; updateStatus(`Player ${result.winner} wins.`, result.winner === 'X' ? '' : 'var(--yellow)'); $('result-title').textContent = `Player ${result.winner} wins.`; $('result-message').textContent = 'Three marks. One clean line.'; }
    renderBoard(); setTimeout(() => { $('result-modal').hidden = false; $('modal-reset').focus(); }, reducedMotion ? 0 : 420);
  }
  function resetRound() { board.fill(null); current = 'X'; gameOver = false; moveCount = 0; round += 1; updateStatus("Player X's turn"); renderBoard(); }
  $('reset-button').addEventListener('click', resetRound); $('header-reset').addEventListener('click', resetRound); $('modal-reset').addEventListener('click', () => { $('result-modal').hidden = true; resetRound(); $('board-grid').querySelector('button').focus(); }); $('modal-close').addEventListener('click', () => { $('result-modal').hidden = true; });
  $('result-modal').addEventListener('click', event => { if (event.target === $('result-modal')) $('result-modal').hidden = true; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('result-modal').hidden) $('result-modal').hidden = true; });
  renderBoard();
})();
