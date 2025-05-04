import { Button } from "@/components/ui/button";
import { useChessStore } from "@/lib/chess";
import { 
  Flag, 
  Handshake, 
  Undo, 
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GameControlsProps {
  onResign?: () => void;
  onOfferDraw?: () => void;
  onAcceptDraw?: () => void;
  onConfirmMove?: () => void;
  drawOffered?: boolean;
  isGameOver?: boolean;
  lastMoveConfirmed?: boolean;
  playerTurn?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onResign,
  onOfferDraw,
  onAcceptDraw,
  onConfirmMove,
  drawOffered = false,
  isGameOver = false,
  lastMoveConfirmed = true,
  playerTurn = true
}) => {
  const { undoMove } = useChessStore();
  const { toast } = useToast();
  
  const handleUndoMove = () => {
    if (!lastMoveConfirmed) {
      const success = undoMove();
      if (!success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Cannot undo move at this time",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot undo a confirmed move",
      });
    }
  };

  return (
    <div className="flex flex-wrap justify-between mt-6 gap-3">
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 flex items-center"
          onClick={onResign}
          disabled={isGameOver}
        >
          <Flag className="mr-2 h-4 w-4" />
          <span>Resign</span>
        </Button>
        
        {drawOffered ? (
          <Button
            variant="outline"
            className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 flex items-center"
            onClick={onAcceptDraw}
            disabled={isGameOver}
          >
            <Handshake className="mr-2 h-4 w-4" />
            <span>Accept Draw</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 flex items-center"
            onClick={onOfferDraw}
            disabled={isGameOver}
          >
            <Handshake className="mr-2 h-4 w-4" />
            <span>Offer Draw</span>
          </Button>
        )}
      </div>
      
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 flex items-center"
          onClick={handleUndoMove}
          disabled={isGameOver || lastMoveConfirmed}
        >
          <Undo className="mr-2 h-4 w-4" />
          <span>Undo</span>
        </Button>
        
        <Button
          variant="accent"
          className="bg-accent hover:bg-amber-600 text-black font-medium rounded-lg px-5 py-2 flex items-center"
          onClick={onConfirmMove}
          disabled={isGameOver || lastMoveConfirmed || !playerTurn}
        >
          <Check className="mr-2 h-4 w-4" />
          <span>Confirm Move</span>
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
