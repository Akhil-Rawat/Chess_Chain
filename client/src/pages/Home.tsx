import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import RecentGames from "@/components/RecentGames";
import NewGameModal from "@/components/NewGameModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeb3Store } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";
import { Plus, TrendingUp, Trophy, Clock, Sparkles } from "lucide-react";

interface GameListItem {
  id: string;
  wagerAmount: string;
  timeControl: string;
  createdAt: string;
  player1?: {
    id: number;
    username: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
}

const Home = () => {
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);
  const { isConnected } = useWeb3Store();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const { data: activeGames, isLoading } = useQuery<GameListItem[]>({
    queryKey: ['/api/games/active'],
  });

  const handleJoinGame = (gameId: string) => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to join a game.",
      });
      return;
    }
    
    setLocation(`/game/${gameId}`);
  };

  const handleGameCreated = (gameId: number) => {
    setLocation(`/game/${gameId}`);
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Hero Section */}
        <div className="bg-primary rounded-lg p-8 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Play Chess on the Blockchain</h1>
            <p className="text-lg text-gray-300 mb-8">Challenge opponents, wager crypto, and have your game results permanently recorded on the blockchain.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="default"
                size="lg"
                className="bg-accent hover:bg-amber-600 text-black font-medium rounded-lg transition-colors"
                onClick={() => setIsNewGameModalOpen(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Game
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                onClick={() => setLocation('/games')}
              >
                <Trophy className="mr-2 h-5 w-5" />
                View Leaderboard
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Games Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Active Games</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : activeGames && activeGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGames.map((game) => (
                  <Card key={game.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>Game #{game.id}</CardTitle>
                        <span className="text-accent font-medium">{game.wagerAmount} ETH</span>
                      </div>
                      <CardDescription>Created by {game.player1?.address ? `${game.player1.address.substring(0, 6)}...${game.player1.address.substring(game.player1.address.length - 4)}` : 'Unknown'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-400 flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {game.timeControl} min
                        </span>
                        <span className="text-gray-400">
                          {new Date(game.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <Button 
                        variant="default"
                        className="w-full bg-accent hover:bg-amber-600 text-black"
                        onClick={() => handleJoinGame(game.id)}
                      >
                        Join Game
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-500 mb-4" />
                  <p className="text-gray-400 text-lg mb-6">No active games available</p>
                  <Button 
                    variant="default"
                    className="bg-accent hover:bg-amber-600 text-black"
                    onClick={() => setIsNewGameModalOpen(true)}
                  >
                    Create a Game
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Recent Games & Stats */}
          <div>
            <RecentGames />
            
            <div className="bg-gray-800 rounded-lg p-4 mt-6">
              <h3 className="text-lg font-medium mb-3">Platform Stats</h3>
              
              <div className="bg-gray-700 rounded-lg p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center">
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                    Total Games
                  </span>
                  <span className="font-medium">1,234</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-green-400" />
                    Total Wagered
                  </span>
                  <span className="font-medium">156.78 ETH</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center">
                    <Trophy className="mr-2 h-4 w-4 text-blue-400" />
                    Top Player
                  </span>
                  <span className="font-medium">0x4d2...f3c1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <NewGameModal 
        isOpen={isNewGameModalOpen} 
        onClose={() => setIsNewGameModalOpen(false)} 
        onGameCreated={handleGameCreated}
      />
    </div>
  );
};

export default Home;
