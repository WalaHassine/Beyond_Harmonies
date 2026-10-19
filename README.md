# Beyond Harmonies

Beyond Harmonies is an interactive web project that turns sound into visuals.  
It combines real-time audio analysis, music-oriented visualizations, and a piano transcription mode powered by machine learning.

The repository contains:
- A core visualization web app (`/BeyondHarmonies`)
- A static landing page (`/Home_page`)
- An About page (`/about us`)
- A blog section with multiple articles (`/blog`)

---

## 1) Project Goals

Beyond Harmonies is designed to:
- Help users *see* musical structure (pitch, amplitude, timbre, note movement)
- Support both monophonic and polyphonic music exploration
- Provide accessibility-friendly interaction through descriptive visualization text and UI components
- Offer educational and creative exploration for music learners, creators, and researchers

---

## 2) Repository Architecture

## Top-Level Structure

```text
Beyond_Harmonies/
├── BeyondHarmonies/        # Main interactive visualization application
├── Home_page/              # Landing page and project showcase
├── about us/               # About page
└── blog/                   # Blog articles
```

## Main Application Structure (`BeyondHarmonies/`)

```text
BeyondHarmonies/
├── src/
│   ├── Main.js             # App bootstrap and module wiring
│   ├── Visualizations.js   # Visualization registration and render loop
│   ├── interface/          # UI controls, file input, microphone, sidebar
│   ├── tools/              # Audio analysis (pitch, spectrum, amplitude, midi)
│   ├── visualization/      # Visualization renderers and composition classes
│   ├── piano/              # Piano mode, MIDI keyboard, ML transcription handling
│   ├── data/               # Note/color/frequency mapping helpers
│   └── template.html       # Main UI template and custom component layout
├── assets/
│   ├── model/              # ML model shards + weights manifest
│   ├── video/              # Instrument sample videos and catalog JSON
│   └── audio/piano/        # Piano sample library for MIDI playback
├── third_party/            # External UI/audio helper bundles
├── webpack.config.js       # Build pipeline
└── package.json            # Dependencies and scripts
```

---

## 3) Runtime Architecture (How It Works)

## High-level flow

1. `src/Main.js` boots the app, creates the sidebar, and initializes visualizations.
2. `Sidebar` manages user input modes and selected visualizations.
3. `AudioInput` merges microphone/sample/file input into a shared audio signal path.
4. `Analyser` computes reusable analysis frames (spectrum, pitch, amplitude, waveform, MIDI notes, polyphonic notes).
5. Visualization classes read analyzer outputs and render on the main canvas in a requestAnimationFrame loop.
6. In Piano Mode, the ML transcription model emits note events that are merged into the note stream and displayed as piano-style note visualizations.

## Core modules

- **UI layer** (`src/interface/*`)
  - Source selection (mic, built-in samples, uploaded files)
  - Toggles for color, grid, and mode switching
  - Accessibility/announcement components

- **Audio + analysis layer** (`src/tools/*`)
  - Frequency spectrum extraction (FFT)
  - Monophonic pitch detection and smoothing
  - Amplitude and waveform analysis
  - MIDI + polyphonic note aggregation

- **Visualization layer** (`src/visualization/*`)
  - Multiple visualization families (Hilbert, spectrogram, waveform, pitch-scroll variants)
  - Wrapping/scrolling render strategies
  - Optional overlays (grid/notes) and color modes

- **Polyphonic/ML layer** (`src/piano/*`)
  - Model lifecycle and transcription flow
  - Tone.js transport scheduling of transcribed notes
  - Optional live MIDI keyboard interaction using sampled piano sounds

---

## 4) Machine Learning Model Usage

Beyond Harmonies uses **Magenta’s Onsets and Frames** model (`@magenta/music`) in Piano Mode.

## What it does
- Transcribes uploaded audio into note events (`pitch`, `startTime`, `endTime`, `velocity`)
- Drives visual piano-note rendering through a polyphonic note stream

## Where it is implemented
- `src/piano/Model.js`
  - Lazy-loads `@magenta/music`
  - Creates `new OnsetsAndFrames('/assets/model')`
  - Initializes with local model assets in `assets/model/`
  - Runs `transcribeFromAudioFile(blob)`

## Model assets
- Located in `BeyondHarmonies/assets/model/`
- Includes multiple shard files (`group1-shard*`) and `weights_manifest.json`

## Input constraints and behavior
- Piano transcription is file-based in this flow.
- Uploaded audio must be **under 30 seconds** for transcription.
- When Piano Mode is enabled:
  - Basic mode inputs are disabled
  - Transcribed notes are scheduled and visualized in sync
  - MIDI keyboard support can be used if WebMIDI is available

---

## 5) Features and Functionalities

## Audio input features
- Real-time microphone input (when supported and permission granted)
- Built-in sample selection (voice, sax, guitar, violin, tabla)
- Drag-and-drop or picker upload for user audio/video files
- Playback controls integrated with visualization state

## Visualization modes

### Melodic group
- Hilbert (Notes Version)
- Hilbert (Scope Version)
- Hilbert (Painter Version)

### Harmonic group
- Spectrograph
- Spectrogram
- Spectrogram (Notes Version)
- Spectrogram (Painter Version)

### Dynamic group
- Waveform
- Oscilloscope
- Polyphonic Piano (enabled in Piano Mode)

## Interaction and UX features
- Color toggle (where supported per visualizer)
- Grid/notes overlay toggle (where supported)
- Pause/mute shortcuts
- Canvas descriptions updated with visualization-specific explanatory text
- Tutorial slides and splash/loader overlays

## MIDI and piano workflow
- WebMIDI device detection and event handling (note on/off, sustain pedal)
- Sampled piano playback via Tone.js Sampler
- Polyphonic note display and decay behavior for transcription output

---

## 6) Build, Run, and Development

From:

`/home/runner/work/Beyond_Harmonies/Beyond_Harmonies/BeyondHarmonies`

## Install dependencies

```bash
npm install
```

## Development watch build

```bash
npm run watch
```

## Production build

```bash
npm run build
```

## Build + serve

```bash
npm start
```

Build artifacts are generated in:
- `BeyondHarmonies/build/`

---

## 7) Technology Stack

- **Runtime/UI**: JavaScript, HTML, SCSS, custom web components
- **Audio engine**: Tone.js
- **Signal analysis**: FFT and waveform tools, `pitchfinder`, custom analyzers
- **ML transcription**: `@magenta/music` (Onsets and Frames)
- **Build system**: Webpack + Babel
- **Rendering**: HTML canvas 2D context

---

## 8) Notes for Maintainers

- Some repository pages (`Home_page`, `about us`, `blog`) are static and complement the main app.
- The main interactive visualization product is in `BeyondHarmonies/`.
- If extending visualization behavior, keep the module split between:
  - input/interface
  - analysis tools
  - renderers
  - piano/ML flow
  to preserve readability and testability.

