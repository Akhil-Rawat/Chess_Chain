import { useChessStore, getPieceSymbol, getSquareColor } from "@/lib/chess";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ChessBoardProps {
  fen?: string;
  flip?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ fen, flip = false }) => {
  const { 
    board, 
    selectedSquare, 
    validMoves, 
    selectSquare,
    initGame,
    setFromFen
  } = useChessStore();

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Initialize game or set from FEN
  useEffect(() => {
    if (fen) {
      setFromFen(fen);
    } else {
      initGame();
    }
  }, [fen, initGame, setFromFen]);

  // Flip board if needed
  const displayFiles = flip ? [...files].reverse() : files;
  const displayRanks = flip ? [...ranks].reverse() : ranks;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="aspect-square w-full max-w-xl mx-auto">
        <div className="grid grid-cols-9 text-center">
          {/* Empty top-left corner */}
          <div className=""></div>
          
          {/* File labels (top) */}
          {displayFiles.map(file => (
            <div key={`file-${file}`} className="text-gray-400">
              {file}
            </div>
          ))}
          
          {/* Rank labels and board squares */}
          {displayRanks.map(rank => (
            <>
              {/* Rank label */}
              <div key={`rank-${rank}`} className="flex items-center justify-center text-gray-400">
                {rank}
              </div>
              
              {/* Squares for this rank */}
              {displayFiles.map(file => {
                const square = file + rank;
                const boardSquare = board.find(s => s.square === square);
                const isSelected = selectedSquare === square;
                const isValidMove = validMoves.includes(square);
                const squareColor = getSquareColor(square);
                
                return (
                  <div
                    key={square}
                    className={cn(
                      "aspect-square relative flex items-center justify-center",
                      squareColor === 'light' ? "light-square" : "dark-square",
                      isSelected && "selected-square",
                      isValidMove && "valid-move"
                    )}
                    onClick={() => selectSquare(square)}
                  >
                    {boardSquare?.piece && (
                      <span 
                        className="chess-piece" 
                        style={{ color: boardSquare.piece.color === 'w' ? 'white' : 'black' }}
                      >
                        {getPieceSymbol(boardSquare.piece)}
                      </span>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
