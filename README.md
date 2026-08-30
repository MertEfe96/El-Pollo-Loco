# El Pollo Loco

A browser-based side-scrolling action game inspired by classic arcade platformers. The player controls a character who runs, jumps, collects coins and bottles, and defeats enemies while progressing through the level.

## Features

- Side-scrolling gameplay with keyboard controls
- Enemy collisions and combat
- Coins and bottle pickups
- Boss battle with projectiles
- Animated character and enemy sprites
- Sound and volume controls
- Mobile control buttons for touch devices

## Tech Stack

- HTML5 Canvas
- Vanilla JavaScript
- CSS
- Local audio and image assets

## Project Structure

- `index.html` – main game page
- `style.css` – game styling and layout
- `js/game.js` – game bootstrap and UI logic
- `models/` – game objects and classes
- `levels/` – level definitions
- `img/` – sprites and UI assets
- `audio/` – music and sound effects
- `fonts/` – font files

## Run Locally

Because this project loads local assets in the browser, it should be served through a local web server instead of opened directly as a file.

### Option 1: Python

```bash
cd "c:/Users/merte/Documents/Developer Academy/Projekte/aktuelle Projekte/El-Pollo-Loco"
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Option 2: VS Code Live Server

Open the project in VS Code and run it with the Live Server extension.

## Controls

- A / D – Move left / right
- Space – Jump
- E – Throw bottle

## Notes

- Audio settings are saved in local storage.
- The game is designed for desktop play and also includes basic mobile controls.
- The project is intended as a learning/demo project and is not a production-ready game engine.

## License

This project includes assets and fonts that may carry their own licensing terms. Please check the files in the `img/` and `fonts/` directories before reusing them in another project.
