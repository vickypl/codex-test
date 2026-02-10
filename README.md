# Nokia Snake (Browser Game)

A lightweight, retro-style Snake game inspired by classic Nokia phones.

This project is built with **plain HTML, CSS, and JavaScript only** (no frameworks, no build step, no backend).

## Features

- Retro Nokia-inspired visual style
- Keyboard controls (arrow keys)
- Mobile touch controls (on-screen D-pad + swipe gestures on the board)
- Pause/resume with spacebar
- Live score tracking
- Persistent high score with `localStorage`
- Restart button for quick replay
- Selectable speed presets (Slow, Normal, Fast, Turbo)
- 5 switchable visual themes (snake + board colors)
- 5 arena layouts with static walls, maze structures, and moving obstacles

## Project Structure

- `index.html` – Markup and game UI elements
- `styles.css` – Visual styling and layout
- `script.js` – Game logic, rendering, and input handling

## Requirements

- Any modern browser (Chrome, Firefox, Edge, Safari)

> Optional but helpful: a simple local HTTP server for a smoother local development workflow.

## How to Run (Step by Step)

### Option 1: Open directly in browser (quickest)

1. Go to the project folder.
2. Double-click `index.html` (or right-click → Open With → Browser).
3. Start playing.

### Option 2: Python HTTP server (recommended for local serving)

1. Open a terminal.
2. Go to the project folder:
   ```bash
   cd /workspace/codex-test
   ```
3. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and visit:
   ```
   http://localhost:8000
   ```
5. Start playing.

To stop the server, press `Ctrl + C` in the terminal.

### Option 3: VS Code Live Server (optional convenience)

1. Open the folder in VS Code.
2. Install the **Live Server** extension (if not installed).
3. Right-click `index.html`.
4. Select **Open with Live Server**.

## How to Play

- Choose a speed preset from the **Speed** dropdown (optional).
- Pick a preferred look from the **Theme** dropdown (optional).
- Pick an **Arena** layout (Open Field, Crossroads Walls, Spiral Maze, Twin Tunnels, Moving Patrols).
- Press any **Arrow key** (desktop) or tap any touch direction button (mobile) to start moving.
- Use **Arrow keys**, touch buttons, or swipe on the game board to change direction.
- Press **Space** or tap **Pause** to pause/resume.
- Eat food to increase score.
- The snake wraps across screen edges (no wall death).
- Avoid your own body.
- Click **Restart** after game over (or anytime) to reset.

## Game Behavior Details

- The snake starts centered on a 20×20 board.
- Each food pickup adds **10 points**.
- The game stores your best score in browser `localStorage` under:
  - `snake-high-score`
- Reversing directly into yourself is prevented.

## Customization Tips

You can quickly tweak gameplay by editing constants in `script.js`:

- `tileCount` → board dimensions
- Speed presets live in `speedOptions` (values are tick milliseconds; lower = faster)

You can tweak visuals in `styles.css`:

- Canvas border and background colors
- Container glow/shadow
- Typography and spacing

## Troubleshooting

- **Port already in use** when running Python server:
  - Use another port, e.g.:
    ```bash
    python3 -m http.server 8080
    ```
- **High score not persisting**:
  - Make sure your browser allows local storage.
- **Keys not responding**:
  - Click inside the page once, then try arrow keys again.
- **File won’t open by double-click**:
  - Try right-clicking `index.html` and choosing your browser manually.

## License

No license file is currently defined in this repository.
Add one (for example MIT) if you plan to distribute or reuse the project publicly.
