import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import { useChessStore } from "@/lib/chess";

interface GamePanelProps {
  gameId: string;
  status: 'waiting' | 'in_progress' | 'completed';
  turn: 'white' | 'black';
  timeControl: string;
  contractAddress: string;
  network: string;
  wagerAmount: string;
  wagerStatus: 'pending' | 'funded' | 'completed';
  transactionHash: string;
}

const GamePanel: React.FC<GamePanelProps> = ({
  gameId,
  status,
  turn,
  timeControl,
  contractAddress,
  network,
  wagerAmount,
  wagerStatus,
  transactionHash
}) => {
  const [activeTab, setActiveTab] = useState("game-info");
  const { history } = useChessStore();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'text-green-400';
      case 'waiting':
        return 'text-yellow-400';
      case 'funded':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'completed':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getFormattedStatus = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'waiting':
        return 'Waiting for Opponent';
      case 'completed':
        return 'Completed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex border-b border-gray-700 w-full">
          <TabsTrigger 
            value="game-info" 
            className="flex-1 py-3 font-medium px-3 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 hover:bg-gray-700 transition-colors"
          >
            Game Info
          </TabsTrigger>
          <TabsTrigger 
            value="move-history" 
            className="flex-1 py-3 font-medium px-3 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 hover:bg-gray-700 transition-colors"
          >
            Move History
          </TabsTrigger>
          <TabsTrigger 
            value="chat" 
            className="flex-1 py-3 font-medium px-3 data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 hover:bg-gray-700 transition-colors"
          >
            Chat
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="game-info" className="p-4">
          <div className="space-y-4">
            {/* Game Stats */}
            <div>
              <h3 className="text-lg font-medium mb-2">Game Stats</h3>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Status</span>
                  <span className={getStatusColor(status)}>{getFormattedStatus(status)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Turn</span>
                  <span>{turn}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Time Control</span>
                  <span>{timeControl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Moves Made</span>
                  <span>{history.length}</span>
                </div>
              </div>
            </div>
            
            {/* Blockchain Info */}
            <div>
              <h3 className="text-lg font-medium mb-2">Blockchain Info</h3>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Contract</span>
                  <div className="flex items-center">
                    <span className="text-sm truncate max-w-[120px]">{formatAddress(contractAddress)}</span>
                    <a 
                      href={`https://etherscan.io/address/${contractAddress}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Network</span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {network}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Game ID</span>
                  <span className="text-sm">#{gameId}</span>
                </div>
              </div>
            </div>
            
            {/* Wager Info */}
            <div>
              <h3 className="text-lg font-medium mb-2">Wager Info</h3>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-accent font-medium">{wagerAmount} ETH</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Status</span>
                  <span className={getStatusColor(wagerStatus)}>{wagerStatus.charAt(0).toUpperCase() + wagerStatus.slice(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction</span>
                  <div className="flex items-center">
                    <span className="text-sm truncate max-w-[120px]">{formatAddress(transactionHash)}</span>
                    <a 
                      href={`https://etherscan.io/tx/${transactionHash}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="move-history" className="p-4">
          <div className="bg-gray-700 rounded-lg p-3 max-h-[400px] overflow-y-auto">
            {history.length > 0 ? (
              <div className="space-y-1">
                {history.map((move, index) => (
                  <div key={index} className="flex items-center py-1 border-b border-gray-600 last:border-0">
                    <span className="w-8 text-gray-400">{Math.floor(index / 2) + 1}.</span>
                    <span className={index % 2 === 0 ? "text-white" : "text-gray-300"}>
                      {move}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                No moves made yet
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="chat" className="p-4">
          <div className="bg-gray-700 rounded-lg p-3 h-[400px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-3">
              <div className="text-center py-4 text-gray-400">
                Chat functionality coming soon
              </div>
            </div>
            <div className="border-t border-gray-600 pt-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full bg-gray-800 rounded-lg py-2 px-3 pr-12 focus:outline-none focus:ring-1 focus:ring-accent"
                  disabled
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  disabled
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamePanel;
