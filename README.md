# Gridplay

Gridplay is an array-driven two-player tic-tac-toe website for a data structures assignment.

## The data structure

The game state is stored in a nine-element JavaScript array:

```js
const board = Array(9).fill(null);
```

The index maps to a board position. `Math.floor(index / 3)` gives the row and `index % 3` gives the column. The interface renders the array as a 3×3 grid. On every move, the game writes `X` or `O` into `board[index]`, then checks the eight possible winning lines. `slice()` creates the three row arrays shown in the live explanation.

## Run it

Open `index.html` directly, or serve this folder with any static server. There is no login, database, build step, or payment flow.

## Design direction

The visual concept is **one motif**: the 3×3 grid becomes the hero artwork, board, loader, footer construction, and square control language. The palette uses black, cyan, mint, yellow, and orange on purpose to give a simple classroom exercise an identifiable visual system.

## Scope

This is a local two-player game. Scores reset when the page reloads. The game is intentionally not an online multiplayer service.
