import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChessPiece {
  id: number;
  piece: string;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
}

const chessPieces = ["♔", "♕", "♖", "♗", "♘", "♙", "♚", "♛", "♜", "♝", "♞", "♟"];

export default function ChessPieceLoader({ onComplete }: { onComplete: () => void }) {
  const [pieces, setPieces] = useState<ChessPiece[]>([]);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Generate random falling chess pieces
    const generatePieces = () => {
      const newPieces: ChessPiece[] = [];
      for (let i = 0; i < 15; i++) {
        newPieces.push({
          id: i,
          piece: chessPieces[Math.floor(Math.random() * chessPieces.length)],
          x: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 2 + Math.random() * 2,
          rotation: Math.random() * 360,
        });
      }
      setPieces(newPieces);
    };

    generatePieces();

    // Hide loader after animation completes
    const timer = setTimeout(() => {
      setShowLoader(false);
      setTimeout(onComplete, 500);
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
        >
          {/* Falling Chess Pieces */}
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                y: -100,
                x: `${piece.x}vw`,
                opacity: 0,
                rotate: piece.rotation,
                scale: 0.5,
              }}
              animate={{
                y: "110vh",
                opacity: [0, 1, 1, 0],
                rotate: piece.rotation + 720,
                scale: [0.5, 1.2, 1, 0.8],
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: "easeIn",
              }}
              className="absolute text-4xl md:text-6xl text-white/20 pointer-events-none"
              style={{
                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))",
              }}
            >
              {piece.piece}
            </motion.div>
          ))}

          {/* Central Logo Animation */}
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                  className="text-8xl md:text-9xl text-amber-400"
                >
                  ♔
                </motion.div>
                <div className="absolute inset-0 blur-xl bg-amber-400/30 rounded-full animate-pulse"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                ChessChain
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="text-xl md:text-2xl text-white/70 font-light"
              >
                Where Strategy Meets Blockchain
              </motion.p>
            </motion.div>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.5 }}
              className="mt-12 flex items-center justify-center space-x-2"
            >
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-3 h-3 bg-amber-400 rounded-full"
                  />
                ))}
              </div>
              <span className="text-white/50 ml-4">Loading...</span>
            </motion.div>
          </div>

          {/* Background Glow Effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 0.1 }}
            transition={{ delay: 1, duration: 2 }}
            className="absolute inset-0 bg-gradient-radial from-amber-400/20 via-transparent to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
