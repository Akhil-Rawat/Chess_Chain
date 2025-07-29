import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import RecentGames from "@/components/RecentGames";
import NewGameModal from "@/components/NewGameModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  TrendingUp, 
  Trophy, 
  Clock, 
  Sparkles, 
  Users, 
  Zap, 
  Shield,
  Crown,
  Play,
  Gamepad2,
  Coins
} from "lucide-react";

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
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const { data: activeGames, isLoading } = useQuery<GameListItem[]>({
    queryKey: ['/api/games/active'],
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      try {
        const response = await fetch('/api/games/active');
        if (!response.ok) throw new Error('API not available');
        return await response.json();
      } catch (error) {
        // Return empty array as fallback when API is not available
        return [];
      }
    }
  });

  const handleJoinGame = (gameId: string) => {
    // TODO: Add wallet connection check
    setLocation(`/game/${gameId}`);
  };

  const handleGameCreated = (gameId: number) => {
    setLocation(`/game/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Floating Chess Pieces Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl text-white/5 animate-bounce" style={{animationDelay: '0s', animationDuration: '6s'}}>♔</div>
        <div className="absolute top-32 right-20 text-4xl text-white/5 animate-bounce" style={{animationDelay: '1s', animationDuration: '8s'}}>♕</div>
        <div className="absolute bottom-40 left-20 text-5xl text-white/5 animate-bounce" style={{animationDelay: '2s', animationDuration: '7s'}}>♖</div>
        <div className="absolute top-1/2 right-10 text-3xl text-white/5 animate-bounce" style={{animationDelay: '3s', animationDuration: '9s'}}>♗</div>
        <div className="absolute bottom-20 right-1/3 text-4xl text-white/5 animate-bounce" style={{animationDelay: '4s', animationDuration: '5s'}}>♘</div>
        <div className="absolute top-20 left-1/3 text-2xl text-white/5 animate-bounce" style={{animationDelay: '5s', animationDuration: '10s'}}>♙</div>
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl relative">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-600/10 border border-amber-500/20 backdrop-blur-xl p-8 mb-12 hover:border-amber-500/40 transition-all duration-500 group">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-amber-500/5 bg-[size:40px_40px] bg-[image:radial-gradient(circle_at_center,_rgba(251,191,36,0.2)_1px,_transparent_1px)]"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <Crown className="h-16 w-16 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-amber-300 animate-pulse" />
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              The Future of Chess
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Challenge opponents, stake ETH, and have your victories permanently recorded on the blockchain. 
              Welcome to the next evolution of competitive chess.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Button 
                size="lg"
                className="group bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold text-lg px-8 py-4 h-auto shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105"
                onClick={() => setIsNewGameModalOpen(true)}
              >
                <Play className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                Start Playing
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 text-lg px-8 py-4 h-auto backdrop-blur-sm transition-all duration-300 hover:scale-105"
                onClick={() => setLocation('/games')}
              >
                <Trophy className="mr-2 h-6 w-6" />
                View Leaderboard
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center group cursor-pointer">
                <div className="text-3xl font-bold text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-300">1,234</div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors">Games Played</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-3xl font-bold text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-300">45.6 ETH</div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors">Total Wagered</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-3xl font-bold text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-300">567</div>
                <div className="text-gray-400 group-hover:text-gray-300 transition-colors">Active Players</div>
              </div>
            </div>
          </div>
        </div>
        
        <div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Active Games Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Active Games</h2>
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                {activeGames?.length || 0} games waiting
              </Badge>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
              </div>
            ) : activeGames && activeGames.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {activeGames.map((game: any) => (
                  <Card key={game.id} className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 group cursor-pointer backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white group-hover:text-amber-400 transition-colors">Game #{game.id}</CardTitle>
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 group-hover:bg-amber-500/30 transition-colors">
                          {game.wagerAmount} ETH
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-400">Created by {game.player1?.address ? `${game.player1.address.substring(0, 6)}...${game.player1.address.substring(game.player1.address.length - 4)}` : 'Unknown'}</CardDescription>
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
