import React, { useState, useCallback, useEffect } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RotateCcw, 
  Flag, 
  HandHeart, 
  Crown,
  Timer,
  User,
  Circle
} from 'lucide-react';

interface ChessBoardProps {
  gameId?: string;
  initialFen?: string;
  isPlayerWhite?: boolean;
  onMove?: (move: Move) => void;
  onGameEnd?: (result: string) => void;
  timeControl?: number;
  isOnline?: boolean;
}

const PIECE_UNICODE = {
  'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
  'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
};

const ChessBoard: React.FC<ChessBoardProps> = ({
  gameId,
  initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  isPlayerWhite = true,
  onMove,
  onGameEnd,
  timeControl = 600, // 10 minutes
  isOnline = false
}) => {
  const [game, setGame] = useState(new Chess(initialFen));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [whiteTime, setWhiteTime] = useState(timeControl);
  const [blackTime, setBlackTime] = useState(timeControl);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

  // Timer logic
  useEffect(() => {
    if (game.isGameOver()) return;

    const timer = setInterval(() => {
      if (isWhiteTurn) {
        setWhiteTime(prev => {
          if (prev <= 1) {
            onGameEnd?.('Black wins by time');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            onGameEnd?.('White wins by time');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isWhiteTurn, game, onGameEnd]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPieceSymbol = (piece: any): string => {
    if (!piece) return '';
    const key = `${piece.color}${piece.type.toUpperCase()}` as keyof typeof PIECE_UNICODE;
    return PIECE_UNICODE[key] || '';
  };

  const handleSquareClick = useCallback((square: Square) => {
    const piece = game.get(square);

    if (selectedSquare) {
      // Try to make a move
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q' // Always promote to queen for simplicity
        });

        if (move) {
          setGame(new Chess(game.fen()));
          setLastMove({ from: selectedSquare, to: square });
          setSelectedSquare(null);
          setPossibleMoves([]);
          setIsWhiteTurn(!isWhiteTurn);
          onMove?.(move);

          // Check for game end
          if (game.isGameOver()) {
            let result = '';
            if (game.isCheckmate()) {
              result = game.turn() === 'w' ? 'Black wins by checkmate' : 'White wins by checkmate';
            } else if (game.isDraw()) {
              result = 'Draw';
            }
            onGameEnd?.(result);
          }
        } else {
          // Invalid move, select new piece or deselect
          if (piece && piece.color === game.turn()) {
            setSelectedSquare(square);
            setPossibleMoves(game.moves({ square, verbose: true }).map(m => m.to));
          } else {
            setSelectedSquare(null);
            setPossibleMoves([]);
          }
        }
      } catch (error) {
        // Invalid move, try selecting new piece
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square);
          setPossibleMoves(game.moves({ square, verbose: true }).map(m => m.to));
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      // Select a piece
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setPossibleMoves(game.moves({ square, verbose: true }).map(m => m.to));
      }
    }
  }, [game, selectedSquare, onMove, onGameEnd, isWhiteTurn]);

  const handleResign = () => {
    const winner = game.turn() === 'w' ? 'Black' : 'White';
    onGameEnd?.(`${winner} wins by resignation`);
  };

  const handleOfferDraw = () => {
    // In a real implementation, this would send a draw offer to the opponent
    onGameEnd?.('Draw by agreement');
  };

  const renderSquare = (square: Square, piece: any, isDark: boolean) => {
    const isSelected = selectedSquare === square;
    const isPossibleMove = possibleMoves.includes(square);
    const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
    const isKingInCheck = piece?.type === 'k' && piece?.color === game.turn() && game.inCheck();

    let squareClass = `chess-square w-12 h-12 flex items-center justify-center text-2xl cursor-pointer relative transition-all duration-200 ${
      isDark ? 'bg-amber-800' : 'bg-amber-100'
    }`;

    if (isSelected) squareClass += ' highlighted ring-2 ring-green-500';
    if (isPossibleMove) squareClass += ' possible-move';
    if (isLastMove) squareClass += ' bg-yellow-400/30';
    if (isKingInCheck) squareClass += ' in-check';

    return (
      <div
        key={square}
        className={squareClass}
        onClick={() => handleSquareClick(square)}
      >
        {piece && (
          <span className="chess-piece select-none">
            {getPieceSymbol(piece)}
          </span>
        )}
        {isPossibleMove && !piece && (
          <div className="w-4 h-4 bg-green-500/60 rounded-full absolute" />
        )}
        {isPossibleMove && piece && (
          <div className="absolute inset-0 border-4 border-green-500/60 rounded-lg" />
        )}
      </div>
    );
  };

  const renderBoard = () => {
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = isPlayerWhite ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];

    for (const rank of ranks) {
      for (const file of files) {
        const square = `${file}${rank}` as Square;
        const piece = game.get(square);
        const isDark = (files.indexOf(file) + rank) % 2 === 1;
        squares.push(renderSquare(square, piece, isDark));
      }
    }

    return squares;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto p-4">
      {/* Game Info Panel */}
      <div className="lg:w-80 space-y-4">
        {/* Player Info */}
        <Card className="glass p-4">
          <div className="space-y-4">
            {/* Opponent */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {isPlayerWhite ? 'Black Player' : 'White Player'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {isOnline ? (
                      <span className="flex items-center gap-1">
                        <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                        Online
                      </span>
                    ) : 'Local Game'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono text-amber-400">
                  {formatTime(isPlayerWhite ? blackTime : whiteTime)}
                </div>
                <Badge variant={!isWhiteTurn === isPlayerWhite ? 'default' : 'secondary'}>
                  {!isWhiteTurn === isPlayerWhite ? 'Playing' : 'Waiting'}
                </Badge>
              </div>
            </div>

            {/* Current Player */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="font-semibold text-white">You</div>
                  <div className="text-sm text-gray-400">
                    {isPlayerWhite ? 'White' : 'Black'} Player
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono text-amber-400">
                  {formatTime(isPlayerWhite ? whiteTime : blackTime)}
                </div>
                <Badge variant={isWhiteTurn === isPlayerWhite ? 'default' : 'secondary'}>
                  {isWhiteTurn === isPlayerWhite ? 'Your Turn' : 'Waiting'}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Game Status */}
        <Card className="glass p-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Game Status</h3>
            {game.inCheck() && (
              <div className="flex items-center gap-2 text-red-400">
                <Crown className="w-4 h-4" />
                <span>Check!</span>
              </div>
            )}
            {game.isGameOver() && (
              <div className="text-center py-2">
                <div className="text-lg font-semibold text-amber-400">Game Over</div>
                <div className="text-sm text-gray-400">
                  {game.isCheckmate() ? 'Checkmate' : 
                   game.isDraw() ? 'Draw' : 'Game ended'}
                </div>
              </div>
            )}
            <div className="text-sm text-gray-400">
              Move: {Math.ceil(game.history().length / 2)}
            </div>
          </div>
        </Card>

        {/* Game Controls */}
        <Card className="glass p-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-white mb-3">Game Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full text-orange-400 border-orange-400/30 hover:bg-orange-400/10"
                onClick={handleOfferDraw}
                disabled={game.isGameOver()}
              >
                <HandHeart className="mr-2 h-4 w-4" />
                Offer Draw
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-400 border-red-400/30 hover:bg-red-400/10"
                onClick={handleResign}
                disabled={game.isGameOver()}
              >
                <Flag className="mr-2 h-4 w-4" />
                Resign
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Chess Board */}
      <div className="flex-1 flex justify-center">
        <Card className="glass p-6">
          <div className="chess-board grid grid-cols-8 gap-0 border-2 border-amber-500/30 rounded-lg overflow-hidden">
            {renderBoard()}
          </div>
          
          {/* Board coordinates */}
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>a</span><span>b</span><span>c</span><span>d</span>
            <span>e</span><span>f</span><span>g</span><span>h</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChessBoard;
