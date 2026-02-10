# Nokia Snake (Browser Game)

A lightweight, retro-style Snake game inspired by classic Nokia phones.

This project is built with **plain HTML, CSS, and JavaScript** (no frameworks, no build step). You can run it locally in just a few commands.

## Features

- Retro Nokia-inspired visual style
- Keyboard controls (arrow keys)
- Pause/resume with spacebar
- Live score tracking
- Persistent high score with `localStorage`
- Restart button for quick replay

## Project Structure

- `index.html` – Markup and game UI elements
- `styles.css` – Visual styling and layout
- `script.js` – Game logic, rendering, and input handling

## Requirements

You only need one of the following:

- Any modern browser (Chrome, Firefox, Edge, Safari), and
- A simple local HTTP server (recommended)

> You can open `index.html` directly in a browser, but serving through a local HTTP server is the most reliable approach.

## How to Run (Step by Step)

### Option 1: Python HTTP server (recommended)

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

### Option 2: VS Code Live Server (if you use VS Code)

1. Open the folder in VS Code.
2. Install the **Live Server** extension (if not installed).
3. Right-click `index.html`.
4. Select **Open with Live Server**.

## How to Play

- Press any **Arrow key** to start moving.
- Use **Arrow keys** to change direction.
- Press **Space** to pause/resume.
- Eat food to increase score.
- Avoid walls and your own body.
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
- `speed` → tick speed in milliseconds (lower = faster)

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
  - Make sure your browser allows local storage for localhost pages.
- **Keys not responding**:
  - Click inside the page once, then try arrow keys again.

## License

No license file is currently defined in this repository.
Add one (for example MIT) if you plan to distribute or reuse the project publicly.
