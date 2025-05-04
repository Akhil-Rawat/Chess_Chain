import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWeb3Store } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

interface Web3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => Promise<void>;
}

const Web3Modal: React.FC<Web3ModalProps> = ({ isOpen, onClose, onConnect }) => {
  const { isConnecting, error } = useWeb3Store();
  const { toast } = useToast();

  const handleConnect = async (wallet: string) => {
    try {
      await onConnect();
      onClose();
      
      toast({
        title: "Wallet connected",
        description: "Your wallet has been connected successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-2">Connect Wallet</DialogTitle>
          <DialogDescription className="text-gray-300">
            Connect your wallet to play chess games on the blockchain and earn crypto.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <Button
            variant="outline"
            className="flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors"
            onClick={() => handleConnect("metamask")}
            disabled={isConnecting}
          >
            <div className="flex items-center">
              <svg width="32" height="32" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                <path d="M32.9583 1L19.8242 10.7183L22.2616 4.98988L32.9583 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.65479 1L15.6681 10.8335L13.3516 4.98988L2.65479 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M28.2304 23.5335L24.7428 28.872L32.3451 30.9389L34.535 23.6487L28.2304 23.5335Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.08936 23.6487L3.26755 30.9389L10.8585 28.872L7.38229 23.5335L1.08936 23.6487Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.4619 14.5149L8.39282 17.6507L15.9065 17.9963L15.6493 9.81989L10.4619 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M25.1499 14.5149L19.867 9.70465L19.8242 17.9963L27.3379 17.6507L25.1499 14.5149Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.8585 28.872L15.4349 26.7169L11.5096 23.6911L10.8585 28.872Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.1768 26.7169L24.7428 28.872L24.103 23.6911L20.1768 26.7169Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-medium">MetaMask</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors"
            onClick={() => handleConnect("walletconnect")}
            disabled={isConnecting}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
                </svg>
              </div>
              <span className="font-medium">WalletConnect</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors"
            onClick={() => handleConnect("coinbase")}
            disabled={isConnecting}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
              <span className="font-medium">Coinbase Wallet</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Button>
        </div>
        
        {error && (
          <p className="mt-4 text-sm text-red-500">
            {error}
          </p>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            By connecting your wallet, you agree to our <a href="#" className="text-accent hover:underline">Terms of Service</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Web3Modal;
