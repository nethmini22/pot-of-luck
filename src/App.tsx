import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

<<<<<<< HEAD
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
          <ResultScreen 
            status={gameState} 
            onRetry={gameState === "lost_retry" ? handleRetry : undefined} 
          />
        )}
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}
=======
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
>>>>>>> 6ceebece35898be27618d4a0d9429b4859a8f1bb

export default App;
