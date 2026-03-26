import { useState } from "react";
import { Toaster } from "sonner";
import { LoginScreen } from "./components/LoginScreen";
import { GameScreen } from "./components/GameScreen";
import { ResultScreen } from "./components/ResultScreen";
import { Sun } from "lucide-react";
import "./App.css";

type GameState = "login" | "playing" | "won" | "lost_retry" | "game_over";

function App() {
  const [gameState, setGameState] = useState<GameState>("login");
  const [strikes, setStrikes] = useState<number>(2);

  const handleLoginSuccess = () => {
    setGameState("playing");
    setStrikes(2);
  };

  const handleWin = () => {
    setGameState("won");
  };

  const handleLose = (canRetry: boolean) => {
    if (canRetry) {
      setGameState("lost_retry");
    } else {
      setGameState("game_over");
    }
  };

  const handleRetry = () => {
    setGameState("playing");
  };

  return (
    <div className="min-h-screen bg-avurudu font-sans overflow-hidden">
      {/* Background Motifs */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 flex items-center justify-center">
        <Sun className="w-[800px] h-[800px] text-deep-red animate-spin" style={{ animationDuration: '100s' }} />
      </div>

      <div className="relative z-10 w-full h-full overflow-y-auto">
        {gameState === "login" && <LoginScreen onLoginSuccess={handleLoginSuccess} />}
        {gameState === "playing" && (
          <GameScreen 
            onWin={handleWin} 
            onLose={handleLose} 
            strikes={strikes} 
            setStrikes={setStrikes} 
          />
        )}
        {(gameState === "won" || gameState === "lost_retry" || gameState === "game_over") && (
          <ResultScreen status={gameState} onRetry={handleRetry} />
        )}
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
