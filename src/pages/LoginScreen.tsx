import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://script.google.com/macros/s/AKfycbwqMpKwlOkMYp45ZzEDN6Q7GoXxWHgRwXg77PYCo6_ueSsjklCGxINDH-HbuCk_R9NO/exec";
// ── Clay Pot Silhouette (SVG) ─────────────────────────────────────────────────
const PotSilhouette = () => (
  <svg
    viewBox="0 0 120 160"
    className="mx-auto mb-2 w-16 h-20 drop-shadow-[0_2px_8px_rgba(180,130,30,0.45)]"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* rope / hanger */}
    <line x1="60" y1="0" x2="60" y2="18" stroke="url(#goldRope)" strokeWidth="3" strokeLinecap="round"/>
    <line x1="40" y1="18" x2="80" y2="18" stroke="url(#goldRope)" strokeWidth="3" strokeLinecap="round"/>
    {/* neck */}
    <rect x="46" y="20" width="28" height="10" rx="5" fill="url(#goldGrad)"/>
    {/* body */}
    <ellipse cx="60" cy="90" rx="44" ry="58" fill="url(#goldGrad)"/>
    {/* highlight rim */}
    <ellipse cx="60" cy="35" rx="20" ry="6" fill="url(#goldShine)" opacity="0.55"/>
    {/* bottom */}
    <ellipse cx="60" cy="148" rx="22" ry="8" fill="url(#goldGrad2)"/>
    <defs>
      <linearGradient id="goldGrad" x1="16" y1="30" x2="104" y2="148" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FCF6BA"/>
        <stop offset="35%" stopColor="#BF953F"/>
        <stop offset="70%" stopColor="#AA771C"/>
        <stop offset="100%" stopColor="#8a5e10"/>
      </linearGradient>
      <linearGradient id="goldGrad2" x1="38" y1="140" x2="82" y2="155" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#c9972b"/>
        <stop offset="100%" stopColor="#6b4510"/>
      </linearGradient>
      <linearGradient id="goldShine" x1="40" y1="30" x2="80" y2="41" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF7C0"/>
        <stop offset="100%" stopColor="#FCF6BA" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="goldRope" x1="40" y1="0" x2="80" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#AA771C"/>
        <stop offset="100%" stopColor="#FCF6BA"/>
      </linearGradient>
    </defs>
  </svg>
);

// ── Decorative floating petals (background) ───────────────────────────────────
const petals = [
  { emoji: "🌸", x: 8, y: 15, dur: 6 },
  { emoji: "🪷", x: 85, y: 10, dur: 7.5 },
  { emoji: "🌺", x: 70, y: 70, dur: 5.5 },
  { emoji: "🌸", x: 5, y: 72, dur: 8 },
  { emoji: "🪷", x: 45, y: 90, dur: 6.5 },
  { emoji: "🌺", x: 92, y: 45, dur: 7 },
];

interface LoginScreenProps {
  onSuccess: (phone: string) => void;
}

type ApiState = "idle" | "loading" | "denied";

export const LoginScreen = ({ onSuccess }: LoginScreenProps) => {
  const [phone, setPhone] = useState("");
  const [apiState, setApiState] = useState<ApiState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);
  const [fading, setFading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async () => {
    // Stripping all spaces and non-numeric characters before sending
    const strippedPhone = phone.replace(/\D/g, "");
    if (!strippedPhone) {
      setErrorMsg("Please enter a valid phone number.");
      setApiState("denied");
      triggerShake();
      inputRef.current?.focus();
      return;
    }

    setApiState("loading");
    setErrorMsg("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        mode: "cors",
        redirect: "follow",
        body: JSON.stringify({ action: "verify", phone: strippedPhone }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.allowed === true) {
        // Fade-out then transition
        setFading(true);
        setTimeout(() => onSuccess(strippedPhone), 700);
      } else {
        setErrorMsg("Attempts exhausted.");
        setApiState("denied");
        triggerShake();
      }
    } catch (err) {
      console.error("The browser blocked the Apps Script response (Likely CORS):", err);
      setErrorMsg("Connection failed. (Check CORS or 'Anyone' access)");
      setApiState("denied");
      triggerShake();
    }
  };

  const handleBypass = () => {
    setFading(true);
    setTimeout(() => onSuccess("94700000000"), 700);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <motion.div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4"
      style={{
        background: "linear-gradient(135deg, #FFD1DC 0%, #FFF8F0 40%, #FFF8F0 70%, #FFD1DC 100%)",
      }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.65, ease: "easeInOut" }}
    >
      {/* ── Soft vignette overlay ───────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(252,200,180,0.18) 100%)",
        }}
      />

      {/* ── Floating petals ─────────────────────────────────────────────── */}
      {petals.map(({ emoji, x, y, dur }, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute text-xl select-none opacity-30"
          style={{ left: `${x}%`, top: `${y}%` }}
          animate={{ y: [0, -14, 0], rotate: [0, 18, -18, 0], opacity: [0.18, 0.38, 0.18] }}
          transition={{ repeat: Infinity, duration: dur, delay: i * 0.6 }}
        >
          {emoji}
        </motion.span>
      ))}

      {/* ── Main Card ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
        className="relative z-10 w-full max-w-sm"
      >
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="relative overflow-hidden rounded-3xl px-8 py-10 flex flex-col items-center gap-5 backdrop-blur-2xl bg-white/10"
          style={{
            border: "0.5px solid #D4AF37",
            boxShadow:
              "0 8px 32px rgba(212,175,55,0.22), inset 0 1px 0 rgba(255,255,255,0.55)",
          }}
        >
          {/* Inner shimmer overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.32) 0%, transparent 55%, rgba(252,220,180,0.12) 100%)",
            }}
          />

          {/* ── Pot icon ──────────────────────────────────────────────────── */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            className="relative z-10"
          >
            <PotSilhouette />
          </motion.div>

          {/* ── Heading ───────────────────────────────────────────────────── */}
          <div className="relative z-10 text-center space-y-1">
            <h1
              className="text-3xl font-extrabold tracking-wide"
              style={{
                background: "linear-gradient(90deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              කණාමුට්ටිය
            </h1>
            <p
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "#c9972b", letterSpacing: "0.18em" }}
            >
              Avurudu Challenge
            </p>
            <p className="text-xs mt-1" style={{ color: "#5a4a3a", opacity: 0.72 }}>
              Enter your phone number to begin
            </p>
          </div>

          {/* ── Phone Input ───────────────────────────────────────────────── */}
          <div className="relative z-10 w-full">
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 transition-all"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(200,165,50,0.55)",
                boxShadow: "0 2px 8px rgba(200,165,50,0.08)",
              }}
            >
              {/* Phone icon */}
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="url(#phoneGold)"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <defs>
                  <linearGradient id="phoneGold" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FCF6BA"/>
                    <stop offset="100%" stopColor="#BF953F"/>
                  </linearGradient>
                </defs>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>

              <input
                ref={inputRef}
                type="tel"
                placeholder="07X XXX XXXX"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (apiState === "denied") setApiState("idle");
                }}
                onKeyDown={handleKey}
                disabled={apiState === "loading"}
                className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:opacity-50"
                style={{
                  color: "#3a2e1e",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
          </div>

          {/* ── Error message tooltip ─────────────────────────────────────── */}
          <AnimatePresence>
            {apiState === "denied" && errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="relative z-10 w-full"
              >
                <div
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-center"
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(200,165,50,0.45)",
                    color: "#8a5e10",
                  }}
                >
                  <p>✦ {errorMsg}</p>
                  <button 
                    onClick={handleBypass}
                    className="mt-2 text-[10px] underline uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                  >
                    Bypass for Local Testing →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── CTA Button ────────────────────────────────────────────────── */}
          <motion.button
            onClick={handleSubmit}
            disabled={apiState === "loading"}
            whileHover={apiState !== "loading" ? { scale: 1.04, y: -1 } : {}}
            whileTap={apiState !== "loading" ? { scale: 0.96 } : {}}
            className="relative z-10 w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold tracking-widest uppercase transition-all disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(90deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)",
              color: "#3a2200",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.14em",
              boxShadow: "0 4px 18px rgba(180,130,30,0.38)",
            }}
          >
            {/* Gold shimmer sweep during loading */}
            {apiState === "loading" && (
              <motion.span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
                }}
                animate={{ x: ["-120%", "220%"] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
              />
            )}
            {apiState === "loading" ? "VERIFYING…" : "BEGIN ✦"}
          </motion.button>

          {/* ── Footer note ───────────────────────────────────────────────── */}
          <p
            className="relative z-10 text-center text-[10px] leading-relaxed"
            style={{ color: "#7a6040", opacity: 0.65 }}
          >
            සුභ අලුත් අවුරුද්දක් වේවා!<br />
            <span className="tracking-widest">✦ LUXE AVURUDU ✦</span>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginScreen;
