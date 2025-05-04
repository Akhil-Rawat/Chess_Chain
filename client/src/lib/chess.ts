import { Chess } from 'chess.js';
import { create } from 'zustand';

export type ChessPiece = {
  type: string;
  color: string;
};

export type ChessSquare = {
  piece: ChessPiece | null;
  square: string;
};

export type ChessMove = {
  from: string;
  to: string;
  promotion?: string;
};

interface ChessState {
  game: Chess;
  board: ChessSquare[];
  selectedSquare: string | null;
  validMoves: string[];
  history: string[];
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  turn: 'w' | 'b';
  status: string;
  fen: string;
  
  initGame: () => void;
  selectSquare: (square: string) => void;
  makeMove: (move: ChessMove) => boolean;
  undoMove: () => boolean;
  resetSelection: () => void;
  setFromFen: (fen: string) => void;
  getGameState: () => any;
}

export const useChessStore = create<ChessState>((set, get) => ({
  game: new Chess(),
  board: [],
  selectedSquare: null,
  validMoves: [],
  history: [],
  isCheck: false,
  isCheckmate: false,
  isDraw: false,
  turn: 'w',
  status: 'ready',
  fen: '',

  initGame: () => {
    const game = new Chess();
    
    set({
      game,
      board: getBoard(game),
      history: [],
      selectedSquare: null,
      validMoves: [],
      isCheck: game.isCheck(),
      isCheckmate: game.isCheckmate(),
      isDraw: game.isDraw(),
      turn: game.turn(),
      status: getGameStatus(game),
      fen: game.fen(),
    });
  },

  selectSquare: (square: string) => {
    const { game, selectedSquare } = get();
    const piece = game.get(square as any);
    
    // If no piece is selected and the square has a piece of the current turn
    if (!selectedSquare && piece && piece.color === game.turn()) {
      const validMoves = game.moves({
        square: square as any,
        verbose: true
      }).map((move: any) => move.to);
      
      set({ selectedSquare: square, validMoves });
      return;
    }
    
    // If a square is already selected, try to make a move
    if (selectedSquare) {
      const validMoves = get().validMoves;
      
      if (selectedSquare === square) {
        // Deselect if clicking on the same square
        set({ selectedSquare: null, validMoves: [] });
      } else if (validMoves.includes(square)) {
        // Make the move if the target square is a valid move
        const moveSuccess = get().makeMove({
          from: selectedSquare,
          to: square,
          // Handle pawn promotion
          promotion: piece && piece.type === 'p' && (square[1] === '8' || square[1] === '1') 
            ? 'q' : undefined
        });
        
        if (moveSuccess) {
          set({ selectedSquare: null, validMoves: [] });
        }
      } else {
        // If clicking on an invalid square, reset selection
        set({ selectedSquare: null, validMoves: [] });
        
        // If the clicked square has a piece of the current turn, select it
        if (piece && piece.color === game.turn()) {
          get().selectSquare(square);
        }
      }
    }
  },

  makeMove: (move: ChessMove) => {
    const { game } = get();
    
    try {
      const result = game.move(move);
      
      if (result) {
        set({
          board: getBoard(game),
          history: [...get().history, result.san],
          isCheck: game.isCheck(),
          isCheckmate: game.isCheckmate(),
          isDraw: game.isDraw(),
          turn: game.turn(),
          status: getGameStatus(game),
          fen: game.fen(),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Invalid move:', error);
      return false;
    }
  },

  undoMove: () => {
    const { game, history } = get();
    
    if (history.length === 0) {
      return false;
    }
    
    try {
      game.undo();
      
      set({
        board: getBoard(game),
        history: history.slice(0, -1),
        isCheck: game.isCheck(),
        isCheckmate: game.isCheckmate(),
        isDraw: game.isDraw(),
        turn: game.turn(),
        status: getGameStatus(game),
        fen: game.fen(),
        selectedSquare: null,
        validMoves: [],
      });
      
      return true;
    } catch (error) {
      console.error('Error undoing move:', error);
      return false;
    }
  },

  resetSelection: () => {
    set({ selectedSquare: null, validMoves: [] });
  },

  setFromFen: (fen: string) => {
    try {
      const game = new Chess(fen);
      
      set({
        game,
        board: getBoard(game),
        selectedSquare: null,
        validMoves: [],
        isCheck: game.isCheck(),
        isCheckmate: game.isCheckmate(),
        isDraw: game.isDraw(),
        turn: game.turn(),
        status: getGameStatus(game),
        fen: game.fen(),
      });
    } catch (error) {
      console.error('Invalid FEN:', error);
    }
  },

  getGameState: () => {
    const { game, turn, isCheck, isCheckmate, isDraw, status, fen } = get();
    
    return {
      turn,
      isCheck,
      isCheckmate,
      isDraw,
      status,
      fen,
      history: game.history({ verbose: true }),
    };
  },
}));

// Helper functions
function getBoard(game: Chess): ChessSquare[] {
  const board: ChessSquare[] = [];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  for (const rank of ranks) {
    for (const file of files) {
      const square = file + rank;
      const piece = game.get(square as any);
      
      board.push({
        square,
        piece: piece || null,
      });
    }
  }
  
  return board;
}

function getGameStatus(game: Chess): string {
  if (game.isCheckmate()) {
    return `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`;
  }
  
  if (game.isDraw()) {
    if (game.isStalemate()) {
      return 'Draw by stalemate.';
    }
    if (game.isThreefoldRepetition()) {
      return 'Draw by threefold repetition.';
    }
    if (game.isInsufficientMaterial()) {
      return 'Draw by insufficient material.';
    }
    return 'Draw.';
  }
  
  if (game.isCheck()) {
    return `${game.turn() === 'w' ? 'White' : 'Black'} is in check.`;
  }
  
  return `${game.turn() === 'w' ? 'White' : 'Black'} to move.`;
}

export function getPieceSymbol(piece: ChessPiece | null): string {
  if (!piece) return '';
  
  const symbols: Record<string, string> = {
    'p': piece.color === 'w' ? '♙' : '♟',
    'n': piece.color === 'w' ? '♘' : '♞',
    'b': piece.color === 'w' ? '♗' : '♝',
    'r': piece.color === 'w' ? '♖' : '♜',
    'q': piece.color === 'w' ? '♕' : '♛',
    'k': piece.color === 'w' ? '♔' : '♚',
  };
  
  return symbols[piece.type] || '';
}

export function getSquareColor(square: string): 'light' | 'dark' {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = parseInt(square[1]) - 1;
  
  return (file + rank) % 2 === 0 ? 'dark' : 'light';
}
