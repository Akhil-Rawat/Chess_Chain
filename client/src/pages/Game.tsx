import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import ChessBoard from "@/components/ChessBoard";
import GameInfo from "@/components/GameInfo";
import GameControls from "@/components/GameControls";
import GamePanel from "@/components/GamePanel";
import RecentGames from "@/components/RecentGames";
import { useChessStore } from "@/lib/chess";
import { useWeb3Store } from "@/lib/web3";
import { makeMove, resignGame, offerDraw, acceptDraw } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface GameData {
  id: string;
  status: 'waiting' | 'in_progress' | 'completed';
  player1Address: string;
  player1Name: string;
  player2Address: string | null;
  player2Name: string | null;
  wagerAmount: string;
  timeControl: string;
  currentTurn: 'white' | 'black';
  fen: string;
  contractAddress: string;
  network: string;
  wagerStatus: 'pending' | 'funded' | 'completed';
  transactionHash: string;
  drawOffered: boolean;
  winner: string | null;
  moves: string[];
  lastMoveConfirmed: boolean;
}

const Game = () => {
  const [match, params] = useRoute<{ id: string }>('/game/:id');
  const gameId = match ? params.id : '0';
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { account } = useWeb3Store();
  const { makeMove: makeChessMove, getGameState } = useChessStore();
  const [lastMoveConfirmed, setLastMoveConfirmed] = useState(true);
  
  const { data: game, isLoading, isError } = useQuery<GameData>({
    queryKey: [`/api/games/${gameId}`],
    refetchInterval: 5000, // Poll for updates every 5 seconds
  });

  // Set the chess board state from the FEN
  useEffect(() => {
    if (game?.fen) {
      useChessStore.getState().setFromFen(game.fen);
    }
  }, [game?.fen]);

  const resignMutation = useMutation({
    mutationFn: () => {
      return resignGame(parseInt(gameId, 10));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/games/${gameId}`] });
      toast({
        title: "Game resigned",
        description: "You have resigned the game.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resign the game",
      });
    }
  });

  const drawMutation = useMutation({
    mutationFn: () => {
      return offerDraw(parseInt(gameId, 10));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/games/${gameId}`] });
      toast({
        title: "Draw offered",
        description: "You have offered a draw to your opponent.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to offer a draw",
      });
    }
  });

  const acceptDrawMutation = useMutation({
    mutationFn: () => {
      return acceptDraw(parseInt(gameId, 10));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/games/${gameId}`] });
      toast({
        title: "Draw accepted",
        description: "You have accepted the draw offer.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept the draw",
      });
    }
  });

  const moveMutation = useMutation({
    mutationFn: (move: string) => {
      return makeMove(parseInt(gameId, 10), move);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/games/${gameId}`] });
      setLastMoveConfirmed(true);
      toast({
        title: "Move confirmed",
        description: "Your move has been confirmed on the blockchain.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to make the move",
      });
    }
  });

  const handleMove = (from: string, to: string) => {
    const moveSuccess = makeChessMove({ from, to });
    if (moveSuccess) {
      setLastMoveConfirmed(false);
    }
  };

  const handleConfirmMove = () => {
    const gameState = getGameState();
    const lastMove = gameState.history[gameState.history.length - 1];
    
    if (lastMove) {
      moveMutation.mutate(`${lastMove.from}${lastMove.to}`);
    }
  };

  const isPlayerTurn = () => {
    if (!game || !account) return false;
    
    const playerColor = game.player1Address === account ? 'white' : 'black';
    return game.currentTurn === playerColor;
  };

  const isGameOver = () => {
    return game?.status === 'completed';
  };

  if (isLoading) {
    return (
      <div className="bg-background text-foreground font-sans min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-6 max-w-7xl flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent"></div>
        </main>
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div className="bg-background text-foreground font-sans min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Game Not Found</h2>
            <p className="text-gray-400">The game you are looking for does not exist or there was an error loading it.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground font-sans min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column: Game board and controls */}
          <div className="w-full lg:w-8/12">
            <GameInfo
              opponentName={account === game.player1Address ? game.player2Name : game.player1Name}
              opponentAddress={account === game.player1Address ? game.player2Address : game.player1Address}
              playerName="You"
              wagerAmount={game.wagerAmount}
            />
            
            <ChessBoard 
              fen={game.fen}
              flip={account === game.player2Address}
            />
            
            <GameControls
              onResign={() => resignMutation.mutate()}
              onOfferDraw={() => drawMutation.mutate()}
              onAcceptDraw={() => acceptDrawMutation.mutate()}
              onConfirmMove={handleConfirmMove}
              drawOffered={game.drawOffered}
              isGameOver={isGameOver()}
              lastMoveConfirmed={lastMoveConfirmed}
              playerTurn={isPlayerTurn()}
            />
          </div>
          
          {/* Right column: Game info, history, etc. */}
          <div className="w-full lg:w-4/12">
            <GamePanel
              gameId={game.id}
              status={game.status}
              turn={game.currentTurn}
              timeControl={`${game.timeControl} min`}
              contractAddress={game.contractAddress}
              network={game.network}
              wagerAmount={game.wagerAmount}
              wagerStatus={game.wagerStatus}
              transactionHash={game.transactionHash}
            />
            
            <RecentGames />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;
