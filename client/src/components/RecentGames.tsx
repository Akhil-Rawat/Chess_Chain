import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Trophy, X, HandshakeIcon } from "lucide-react";

interface GameResult {
  id: string;
  opponent: string;
  result: 'victory' | 'defeat' | 'draw';
  timestamp: string;
  amount: string;
}

const RecentGames = () => {
  const { data: games, isLoading } = useQuery<GameResult[]>({
    queryKey: ['/api/games/recent'],
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Today
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Days ago (up to 7 days)
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return `${diffDays} days ago`;
    }
    
    // For older dates
    return date.toLocaleDateString();
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'victory':
        return <Trophy className="text-accent mr-1 h-4 w-4" />;
      case 'defeat':
        return <X className="text-red-500 mr-1 h-4 w-4" />;
      case 'draw':
        return <HandshakeIcon className="text-blue-500 mr-1 h-4 w-4" />;
      default:
        return null;
    }
  };

  const getResultText = (result: string) => {
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const getAmountText = (result: string, amount: string) => {
    switch (result) {
      case 'victory':
        return `+${amount} ETH`;
      case 'defeat':
        return `-${amount} ETH`;
      case 'draw':
        return 'Refunded';
      default:
        return amount;
    }
  };

  const getAmountClass = (result: string) => {
    switch (result) {
      case 'victory':
        return 'text-accent';
      case 'defeat':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  // Mock data for demo
  const mockGames: GameResult[] = [
    {
      id: '1',
      opponent: '0x4d2...f3c1',
      result: 'victory',
      timestamp: new Date().toISOString(),
      amount: '0.02'
    },
    {
      id: '2',
      opponent: '0x8c7...a3b2',
      result: 'defeat',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // yesterday
      amount: '0.01'
    },
    {
      id: '3',
      opponent: '0x3f1...d2e5',
      result: 'draw',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      amount: '0.01'
    }
  ];

  const displayGames = games || mockGames;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-6">
      <h3 className="text-lg font-medium mb-3">Recent Games</h3>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
        </div>
      ) : displayGames.length > 0 ? (
        <>
          {displayGames.map((game, index) => (
            <div 
              key={game.id} 
              className={`${index !== displayGames.length - 1 ? 'border-b border-gray-700 pb-3 mb-3' : 'pb-1'}`}
            >
              <div className="flex justify-between mb-1">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span className="text-sm font-medium">vs {game.opponent}</span>
                </div>
                <span className="text-xs text-gray-400">{formatDate(game.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300 flex items-center">
                  {getResultIcon(game.result)}
                  {getResultText(game.result)}
                </span>
                <span className={`text-xs ${getAmountClass(game.result)}`}>
                  {getAmountText(game.result, game.amount)}
                </span>
              </div>
            </div>
          ))}
          
          <Link href="/games">
            <Button 
              variant="outline" 
              className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              View All Games
            </Button>
          </Link>
        </>
      ) : (
        <div className="text-center py-4 text-gray-400">
          No games played yet
        </div>
      )}
    </div>
  );
};

export default RecentGames;
