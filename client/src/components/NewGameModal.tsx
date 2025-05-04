import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createGame } from "@/lib/web3";
import { useWeb3Store } from "@/lib/web3";
import { User, Bot } from "lucide-react";

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameCreated: (gameId: number) => void;
}

const timeControlOptions = [
  { value: "1", label: "Bullet (1 min)" },
  { value: "3", label: "Blitz (3 min)" },
  { value: "5", label: "Blitz (5 min)" },
  { value: "10", label: "Rapid (10 min)" },
  { value: "30", label: "Classical (30 min)" },
];

const NewGameModal: React.FC<NewGameModalProps> = ({ isOpen, onClose, onGameCreated }) => {
  const [gameMode, setGameMode] = useState<"player" | "ai">("player");
  const [wagerAmount, setWagerAmount] = useState("0.01");
  const [timeControl, setTimeControl] = useState("5");
  const [isCreating, setIsCreating] = useState(false);
  
  const { toast } = useToast();
  const { isConnected } = useWeb3Store();
  
  const handleWagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setWagerAmount(value);
    }
  };
  
  const handleMinWager = () => {
    setWagerAmount("0.001");
  };
  
  const handleMaxWager = () => {
    setWagerAmount("1");
  };
  
  const handleCreateGame = async () => {
    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet first",
      });
      return;
    }
    
    try {
      setIsCreating(true);
      const gameId = await createGame(wagerAmount, parseInt(timeControl, 10));
      
      if (gameId) {
        toast({
          title: "Game created",
          description: `Game #${gameId} created successfully!`,
        });
        onGameCreated(gameId);
      } else {
        throw new Error("Failed to create game");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create game",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsCreating(false);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-2">Create New Game</DialogTitle>
          <DialogDescription className="text-gray-300">
            Set up a new chess game with web3 integration
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-300 mb-2">Game Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={gameMode === "player" ? "default" : "outline"}
                className={`py-3 px-4 rounded-lg text-center ${
                  gameMode === "player" 
                    ? "bg-accent text-black" 
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setGameMode("player")}
              >
                <div className="flex flex-col items-center">
                  <User className="h-6 w-6 mb-2" />
                  <p className="text-sm font-medium">vs Player</p>
                </div>
              </Button>
              <Button
                type="button"
                variant={gameMode === "ai" ? "default" : "outline"}
                className={`py-3 px-4 rounded-lg text-center ${
                  gameMode === "ai" 
                    ? "bg-accent text-black" 
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setGameMode("ai")}
                disabled={true} // AI mode not implemented yet
              >
                <div className="flex flex-col items-center">
                  <Bot className="h-6 w-6 mb-2" />
                  <p className="text-sm font-medium">vs AI</p>
                </div>
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Wager Amount (ETH)</label>
            <div className="relative">
              <Input
                type="text"
                value={wagerAmount}
                onChange={handleWagerChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded h-auto"
                  onClick={handleMinWager}
                >
                  Min
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded h-auto"
                  onClick={handleMaxWager}
                >
                  Max
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Min: 0.001 ETH - Max: 1 ETH</p>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Time Control</label>
            <Select
              value={timeControl}
              onValueChange={(value) => setTimeControl(value)}
            >
              <SelectTrigger className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white">
                <SelectValue placeholder="Select time control" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border border-gray-600 text-white">
                {timeControlOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          variant="accent"
          className="w-full mt-6 bg-accent hover:bg-amber-600 text-black font-medium py-3 rounded-lg transition-colors"
          onClick={handleCreateGame}
          disabled={isCreating || !isConnected}
        >
          {isCreating ? "Creating..." : `Create Game (${wagerAmount} ETH)`}
        </Button>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            Gas fees estimated at ~0.0005 ETH
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewGameModal;
