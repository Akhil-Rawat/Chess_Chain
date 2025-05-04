import { useWeb3Store } from "@/lib/web3";

interface GameInfoProps {
  opponentName: string | null;
  opponentAddress: string | null;
  playerName: string;
  wagerAmount: string;
}

const GameInfo: React.FC<GameInfoProps> = ({
  opponentName,
  opponentAddress,
  playerName,
  wagerAmount
}) => {
  const { account } = useWeb3Store();

  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
      <div className="flex items-center mb-4 sm:mb-0">
        <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div>
          <p className="font-medium">{opponentName || 'Opponent'}</p>
          <p className="text-sm text-gray-400 truncate max-w-[150px]">{formatAddress(opponentAddress)}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center bg-gray-700 px-4 py-2 rounded-lg">
        <span className="text-lg font-bold mr-3">VS</span>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-300">Wager</span>
          <span className="font-medium text-accent">{wagerAmount} ETH</span>
        </div>
      </div>
      
      <div className="flex items-center mt-4 sm:mt-0">
        <div>
          <p className="font-medium text-right">{playerName}</p>
          <p className="text-sm text-gray-400 truncate max-w-[150px] text-right">{formatAddress(account)}</p>
        </div>
        <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center ml-3">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
