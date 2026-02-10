# Nokia Snake (Browser Game)

A lightweight, retro-style Snake game inspired by classic Nokia phones.

This project is built with **plain HTML, CSS, and JavaScript only**. There is no backend, no package manager, and no required runtime like Python.

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

- Any modern browser (Chrome, Firefox, Edge, Safari)

That’s it.

## How to Run (Step by Step)

### Option 1: Open directly in browser (pure HTML/CSS/JS)

1. Go to the project folder.
2. Double-click `index.html` (or right-click → Open With → Browser).
3. Start playing.

### Option 2: Drag and drop in browser

1. Open a browser window.
2. Drag `index.html` from your file explorer into the browser.
3. Start playing.

### Option 3: VS Code Live Server (optional convenience)

1. Open the folder in VS Code.
2. Install the **Live Server** extension (if not installed).
3. Right-click `index.html`.
4. Select **Open with Live Server**.

> Note: Option 3 is optional. The game works without it.

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

- **High score not persisting**:
  - Make sure your browser allows local storage.
- **Keys not responding**:
  - Click inside the page once, then try arrow keys again.
- **File won’t open by double-click**:
  - Try right-clicking `index.html` and choosing your browser manually.

## License

No license file is currently defined in this repository.
Add one (for example MIT) if you plan to distribute or reuse the project publicly.
