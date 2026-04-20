# group-Project-MvcMovie-spring
Group Project – DevOps Implementation

---

```markdown
# MvcMovie

A minimal Spring Boot MVC demo that serves posters, trailers, and background audio.  
This project demonstrates a small media catalog, per-board rendering, and an invisible background audio feature that plays once per page load.

## Features

- **Asset model** with flags:
  - `corrupted` — show an accessible placeholder only when explicitly true.
  - `playInvisibleOnLaunch` — mark assets that should play in the background without UI.
- **Board assignment**: assets are grouped into Board 1, Board 2, and Board 3.
- **Thymeleaf templates** render per-board lists and hide placeholder posters on Board 1 unless `corrupted == true`.
- **Invisible background audio**:
  - Hidden `<audio>` elements for assets flagged `playInvisibleOnLaunch`.
  - `cinema.js` attempts autoplay once per session; falls back to first user gesture if blocked.
  - Playback is tracked in storage and cleared on page unload so the tune plays only once per page load.
- **API endpoint**: `/api/assets` returns the full asset list as JSON.

## Repo layout (relevant files)

```
src/
  main/
    java/
      nforne/
        AssetDto.java
        AssetService.java
        HomeController.java
    resources/
      templates/
        index.html
      static/
        js/
          cinema.js
        css/
          cinema.css
```

## Quick start

1. **Build**
   ```bash
   ./mvnw clean package
   ```

2. **Run**
   ```bash
   ./mvnw spring-boot:run
   ```
   or run the generated jar:
   ```bash
   java -jar target/<artifact>-<version>.jar
   ```

3. **Open**
   Visit `http://localhost:8080/` in your browser.

## Template behavior

- `index.html` uses three model lists: `board1List`, `board2List`, `board3List`.
- Posters are shown only when `posterUrl` exists and the asset is not flagged `playInvisibleOnLaunch`.
- Placeholder markup is rendered only when `posterUrl` is missing **and** `corrupted == true`.
- Hidden audio elements are rendered for assets with `playInvisibleOnLaunch == true` and `mediaUrl` present.

## Java classes

- **AssetDto** — DTO for assets; includes `id`, `title`, `posterUrl`, `mediaUrl`, `altText`, `corrupted`, `playInvisibleOnLaunch`.
- **AssetService** — in-memory asset list and board assignments.
- **HomeController** — builds board lists and exposes `/` and `/api/assets`.

## Frontend

- **index.html** — Thymeleaf template rendering boards and modal player markup.
- **cinema.js** — attempts to play hidden background audio once per page load; uses `sessionStorage` + `localStorage` to track and clears flags on unload.

## Notes and constraints

- Browsers may block autoplay; `cinema.js` retries on first user gesture.
- The invisible audio is intended to be audible (not muted) and play only once per page load.
- The placeholder asset is intentionally **not** included on Board 1 unless `corrupted` is set to `true` in the DTO.

## Git / Branching

- Feature branch used: `issue/FEAT-103-assets-and-cdn`
- Example commit message used:
  ```
  feat(assets): add AssetDto, AssetService, HomeController, index.html and cinema.js; hide placeholder on Board 1 unless corrupted; play hidden background audio once per session
  ```

## Future improvements

- Persist asset configuration in a database instead of in-memory.
- Add admin UI to toggle `corrupted` and `playInvisibleOnLaunch` flags.
- Add unit and integration tests for controller and service logic.
- Improve accessibility for audio-only playback (announce when background audio starts, provide controls to stop).

## License

Add your license here.

```


