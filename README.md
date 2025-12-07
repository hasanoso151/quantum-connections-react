# Quantum Connections (الروابط الكونية)

An immersive cosmic relationship simulator that visualizes the bond between two souls using 3D particle physics and AI-generated poetry. This application combines the power of **React Three Fiber** for visuals and **Google Gemini API** for deep emotional analysis.

## 🌟 Features

- **Cosmic Analysis:** Uses Google Gemma 3 (12b-it) to analyze relationship dynamics based on metaphorical user inputs.
- **3D Particle Engine:** Renders unique 3D shapes (Heart, Galaxy, Infinity Loop, Chaos Sphere) using Three.js.
- **Dynamic Archetypes:** Supports 4 relationship types:
  - ❤️ Love (Heart Nebula)
  - 🤝 Friendship (Spiral Galaxy)
  - 👨‍👩‍👧 Family (Infinity Loop)
  - ⚔️ Rivalry (Chaotic Sphere)
- **Generative Poetry:** Produces deep, philosophical insights and quotes in Arabic (Rumi-style).
- **Shareable Cards:** Generates high-quality downloadable images of the cosmic bond.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing (Bloom effects)
- **AI Model:** Google Gemini API (`@google/genai`)
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js installed.
- A Google AI Studio API Key.

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   The application requires a valid API Key from Google Gemini. Ensure `process.env.API_KEY` is available in your environment or injected via your build tool/sandbox.

3. **Run the development server:**
   ```bash
   npm start
   ```

## 🌌 How it Works

1. **The Covenant:** Users enter names and select a relationship type.
2. **The Oracle:** Users answer abstract, metaphorical questions (e.g., "Is your bond like a shield or a root?").
3. **The Simulation:** A "Fingerprint Hold" interaction triggers the particle simulation.
4. **The Resonance:** AI generates a unique "Cosmic Contract," a resonance score, and a poetic insight based on the inputs.

## 📂 Project Structure

- `components/ParticleScene.tsx`: The 3D Three.js logic for generating cosmic shapes.
- `components/InputForm.tsx`: The wizard form for collecting user metaphors.
- `components/ResultView.tsx`: Displays the final 3D scene and generates the downloadable card.
- `services/geminiService.ts`: Handles the prompt engineering and communication with Google Gemini.

## 🎨 Aesthetics

The UI follows a "Deep Cosmos" theme using gradients of black, deep purple, and amber/gold accents. Typography uses **Rakkas** for titles and **Cairo** for body text to support elegant Arabic presentation.
