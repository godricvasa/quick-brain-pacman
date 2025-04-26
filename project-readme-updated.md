# Math Escape Game

A grid-based educational game where players solve math problems by navigating to the correct answers.

## Core Concepts

### Game Mechanics
- **Grid System**: 7x7 grid where the player can move in four directions
- **Player Character**: Pac-Man style character that starts in the center
- **Movement**: Arrow keys to navigate the grid
- **Timer**: 6-second countdown for each math problem
- **Lives**: 5 hearts that deplete on wrong answers or time expiration

### Gameplay Loop
1. Math question appears on the side panel
2. Multiple answer options appear on random grid cells
3. Player must navigate to the correct answer before time runs out
4. Correct answers increase score; wrong answers decrease lives
5. Game continues until all lives are lost

### Technical Implementation
- **Frontend**: 
  - Vite for build tooling and development server
  - HTML5 Canvas for rendering the grid and player
  - JavaScript for game logic and animations
- **Backend**: 
  - FastAPI server for the web API
  - LangChain framework for AI integration
  - ChatOpenAI for dynamically generating math questions
- **Architecture**:
  - Frontend makes API calls to fetch questions
  - AI-generated questions with variable difficulty levels
  - Real-time game state management

### Educational Value
- Quick mental math practice
- Time pressure enhances focus and recall
- Visual-spatial reasoning combined with arithmetic

## Setup
1. Install dependencies:
   ```
   npm install          # Frontend dependencies
   pip install -r requirements.txt  # Backend dependencies
   ```
2. Start the backend server: 
   ```
   uvicorn main:app --reload
   ```
3. Run the Vite development server:
   ```
   npm run dev
   ```
4. Open the provided localhost URL in your browser
5. Use arrow keys to navigate to correct answers
