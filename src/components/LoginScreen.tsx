import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is installed based on package.json

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen = ({ onLoginSuccess }: LoginScreenProps) => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      toast.error("Please enter a valid phone number", { className: "glass-card bg-red-500/20 text-deep-red border-red-500/50" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbxRGQIUQ7IeBNvmeMmiPC3-8qxaxGNvQLHA-IdGR3lL0tmOPoC3cIhNas2iV0wbW6gl/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ phone }),
      });
      
      const data = await response.json();
      
      // If CORS or fetch actually returns allowed: true/false
      if (data.allowed) {
        onLoginSuccess();
      } else {
        toast.error(data.message || "You are not allowed to play.", { className: "glass-card bg-red-500/20 text-deep-red border-red-500/50" });
      }
    } catch (error) {
      console.error(error);
      // Fallback for CORS mode 'no-cors' which yields opaque response
      toast.error("An error occurred trying to login. Please try again.", { className: "glass-card bg-red-500/20 text-deep-red border-red-500/50" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-3xl flex flex-col items-center text-center space-y-6">
        <h1 className="text-4xl font-bold text-deep-red mb-2 drop-shadow-sm">
          Kana Mutti Challenge
        </h1>
        <p className="text-foreground/80 mb-6">
          Enter your phone number to play the Avurudu game and win prizes!
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4 flex flex-col items-center">
          <input
            type="tel"
            placeholder="Phone Number (e.g. 0712345678)"
            className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60 focus:outline-none focus:ring-2 focus:ring-festive-orange/50 transition-all text-center text-lg"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-deep-red to-festive-orange text-white px-6 py-3 font-semibold text-lg transition-transform active:scale-95 disabled:opacity-70"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors" />
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading...
              </span>
            ) : (
              "Play Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
