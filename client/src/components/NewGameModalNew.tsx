import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Clock, 
  Coins, 
  Zap, 
  Crown, 
  Shield,
  Timer,
  TrendingUp
} from 'lucide-react';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (gameData: GameData) => void;
}

interface GameData {
  wagerAmount: string;
  timeControl: number;
  timeIncrement: number;
  isRated: boolean;
  colorPreference: 'white' | 'black' | 'random';
}

const TIME_CONTROLS = [
  { label: '1 min', value: 60, type: 'Bullet' },
  { label: '3 min', value: 180, type: 'Blitz' },
  { label: '5 min', value: 300, type: 'Blitz' },
  { label: '10 min', value: 600, type: 'Rapid' },
  { label: '15 min', value: 900, type: 'Rapid' },
  { label: '30 min', value: 1800, type: 'Classical' },
];

const WAGER_PRESETS = [
  '0.001', '0.005', '0.01', '0.05', '0.1', '0.5', '1.0'
];

const NewGameModal: React.FC<NewGameModalProps> = ({ isOpen, onClose, onCreateGame }) => {
  const [gameData, setGameData] = useState<GameData>({
    wagerAmount: '0.01',
    timeControl: 600,
    timeIncrement: 0,
    isRated: true,
    colorPreference: 'random'
  });

  const handleSubmit = () => {
    onCreateGame(gameData);
    onClose();
  };

  const getTimeControlType = (seconds: number) => {
    const control = TIME_CONTROLS.find(tc => tc.value === seconds);
    return control?.type || 'Custom';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-black/90 border-amber-500/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
            Create New Game
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Wager Amount */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              Wager Amount (ETH)
            </Label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {WAGER_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  variant={gameData.wagerAmount === preset ? 'default' : 'outline'}
                  className={`h-8 text-xs ${
                    gameData.wagerAmount === preset 
                      ? 'bg-amber-500 text-black' 
                      : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                  }`}
                  onClick={() => setGameData(prev => ({ ...prev, wagerAmount: preset }))}
                >
                  {preset} ETH
                </Button>
              ))}
            </div>
            <Input
              type="number"
              step="0.001"
              min="0"
              value={gameData.wagerAmount}
              onChange={(e) => setGameData(prev => ({ ...prev, wagerAmount: e.target.value }))}
              className="bg-black/50 border-amber-500/30 text-white placeholder-gray-400"
              placeholder="Custom amount"
            />
            <div className="text-xs text-gray-400">
              Winner takes all • Gas fees apply
            </div>
          </div>

          {/* Time Control */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-white flex items-center gap-2">
              <Timer className="w-5 h-5 text-amber-400" />
              Time Control
            </Label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {TIME_CONTROLS.map((tc) => (
                <Button
                  key={tc.value}
                  variant={gameData.timeControl === tc.value ? 'default' : 'outline'}
                  className={`h-12 text-xs flex flex-col ${
                    gameData.timeControl === tc.value 
                      ? 'bg-amber-500 text-black' 
                      : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                  }`}
                  onClick={() => setGameData(prev => ({ ...prev, timeControl: tc.value }))}
                >
                  <span className="font-semibold">{tc.label}</span>
                  <Badge variant="secondary" className="text-xs mt-1 bg-black/20">
                    {tc.type}
                  </Badge>
                </Button>
              ))}
            </div>
            
            {/* Custom Time Control */}
            <Card className="glass p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-300">Custom Time (minutes)</Label>
                  <span className="text-amber-400 font-mono">
                    {Math.floor(gameData.timeControl / 60)}:{(gameData.timeControl % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <Slider
                  value={[gameData.timeControl]}
                  onValueChange={([value]) => setGameData(prev => ({ ...prev, timeControl: value }))}
                  max={3600}
                  min={60}
                  step={60}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 min</span>
                  <span>60 min</span>
                </div>
              </div>
            </Card>

            {/* Time Increment */}
            <Card className="glass p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-300">Increment (seconds per move)</Label>
                  <span className="text-amber-400 font-mono">+{gameData.timeIncrement}s</span>
                </div>
                <Slider
                  value={[gameData.timeIncrement]}
                  onValueChange={([value]) => setGameData(prev => ({ ...prev, timeIncrement: value }))}
                  max={30}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>No increment</span>
                  <span>+30s</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Game Settings */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              Game Settings
            </Label>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Color Preference */}
              <Card className="glass p-4">
                <div className="space-y-3">
                  <Label className="text-sm text-gray-300">Color Preference</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'white', label: 'White', icon: '♔' },
                      { value: 'black', label: 'Black', icon: '♚' },
                      { value: 'random', label: 'Random', icon: '🎲' }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={gameData.colorPreference === option.value ? 'default' : 'outline'}
                        className={`h-12 flex flex-col ${
                          gameData.colorPreference === option.value 
                            ? 'bg-amber-500 text-black' 
                            : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                        }`}
                        onClick={() => setGameData(prev => ({ 
                          ...prev, 
                          colorPreference: option.value as 'white' | 'black' | 'random'
                        }))}
                      >
                        <span className="text-lg">{option.icon}</span>
                        <span className="text-xs">{option.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Game Type */}
              <Card className="glass p-4">
                <div className="space-y-3">
                  <Label className="text-sm text-gray-300">Game Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={gameData.isRated ? 'default' : 'outline'}
                      className={`h-10 flex items-center gap-2 ${
                        gameData.isRated 
                          ? 'bg-amber-500 text-black' 
                          : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                      }`}
                      onClick={() => setGameData(prev => ({ ...prev, isRated: true }))}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Rated
                    </Button>
                    <Button
                      variant={!gameData.isRated ? 'default' : 'outline'}
                      className={`h-10 flex items-center gap-2 ${
                        !gameData.isRated 
                          ? 'bg-amber-500 text-black' 
                          : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                      }`}
                      onClick={() => setGameData(prev => ({ ...prev, isRated: false }))}
                    >
                      <Zap className="w-4 h-4" />
                      Casual
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Game Summary */}
          <Card className="glass p-4 border-amber-500/30">
            <div className="space-y-2">
              <h3 className="font-semibold text-amber-400 mb-3">Game Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Wager:</span>
                  <span className="ml-2 text-white font-semibold">{gameData.wagerAmount} ETH</span>
                </div>
                <div>
                  <span className="text-gray-400">Time:</span>
                  <span className="ml-2 text-white font-semibold">
                    {Math.floor(gameData.timeControl / 60)}m {gameData.timeIncrement > 0 && `+${gameData.timeIncrement}s`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="ml-2 text-white font-semibold">
                    {getTimeControlType(gameData.timeControl)} • {gameData.isRated ? 'Rated' : 'Casual'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Color:</span>
                  <span className="ml-2 text-white font-semibold">
                    {gameData.colorPreference === 'random' ? 'Random' : 
                     gameData.colorPreference === 'white' ? 'White' : 'Black'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold"
            >
              <Crown className="mr-2 h-4 w-4" />
              Create Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewGameModal;
