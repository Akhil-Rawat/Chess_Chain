import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Crown, Shield, Zap, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Web3ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const walletOptions = [
  {
    name: "MetaMask",
    icon: "🦊",
    description: "Connect to your MetaMask wallet",
    popular: true,
    available: true,
  },
  {
    name: "WalletConnect",
    icon: "🔗",
    description: "Scan with any wallet to connect",
    popular: true,
    available: true,
  },
  {
    name: "Coinbase Wallet",
    icon: "🏪",
    description: "Connect to Coinbase Wallet",
    popular: false,
    available: true,
  },
  {
    name: "Rainbow",
    icon: "🌈",
    description: "Connect to Rainbow wallet",
    popular: false,
    available: true,
  },
];

export default function Web3Modal({ isOpen, onClose }: Web3ModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();

  const handleWalletConnect = async (walletName: string) => {
    setConnecting(walletName);
    
    // Simulate wallet connection
    try {
      if (walletName === "MetaMask") {
        // Check if MetaMask is installed
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          const accounts = await (window as any).ethereum.request({
            method: 'eth_requestAccounts',
          });
          
          if (accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);
            setConnected(true);
            toast({
              title: "Wallet Connected! 🎉",
              description: `Successfully connected to ${walletName}`,
            });
          }
        } else {
          toast({
            title: "MetaMask Not Found",
            description: "Please install MetaMask to continue",
            variant: "destructive",
          });
        }
      } else {
        // Simulate other wallet connections
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockAddress = "0x742d35Cc6669C567Db5689A3F1e8F2b3F1e8F2b3";
        setWalletAddress(mockAddress);
        setConnected(true);
        toast({
          title: "Wallet Connected! 🎉",
          description: `Successfully connected to ${walletName}`,
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
    
    setConnecting(null);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied! 📋",
      description: "Wallet address copied to clipboard",
    });
  };

  const handleDisconnect = () => {
    setConnected(false);
    setWalletAddress("");
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from wallet",
    });
  };

  if (connected) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border border-amber-500/20 backdrop-blur-xl">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <div className="absolute inset-0 blur-sm bg-green-400/20 rounded-full animate-pulse"></div>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">Wallet Connected</DialogTitle>
                <DialogDescription className="text-gray-400">
                  You're ready to play and earn!
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Connected Account</p>
                    <p className="text-sm text-gray-400">Ready for transactions</p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <code className="text-sm text-gray-300 font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="text-gray-400 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="text-center">
                  <Crown className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Games Won</p>
                  <p className="text-lg font-bold text-white">0</p>
                </div>
                <div className="text-center">
                  <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">ETH Earned</p>
                  <p className="text-lg font-bold text-white">0.0</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Rating</p>
                  <p className="text-lg font-bold text-white">1200</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600 transition-all duration-300"
            >
              Start Playing
            </Button>
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              Disconnect
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border border-amber-500/20 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Crown className="h-8 w-8 text-amber-400" />
              <div className="absolute inset-0 blur-sm bg-amber-400/20 rounded-full animate-pulse"></div>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">Connect Wallet</DialogTitle>
              <DialogDescription className="text-gray-400">
                Choose your wallet to start playing chess on-chain
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <Card 
              key={wallet.name}
              className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 cursor-pointer group"
              onClick={() => handleWalletConnect(wallet.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{wallet.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                          {wallet.name}
                        </h3>
                        {wallet.popular && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{wallet.description}</p>
                    </div>
                  </div>
                  
                  {connecting === wallet.name ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-400"></div>
                  ) : (
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-amber-400 transition-colors" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Shield className="h-4 w-4" />
            <span>Your wallet stays secure. We never store your private keys.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
