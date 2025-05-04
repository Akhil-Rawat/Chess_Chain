import { useWeb3Store } from "@/lib/web3";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Web3Modal from "./Web3Modal";
import { Link } from "wouter";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { account, isConnected, isConnecting, connect } = useWeb3Store();

  const handleOpenModal = () => {
    if (!isConnected) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="bg-primary py-3 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <svg 
            className="text-accent text-2xl" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 22H5v-2h14v2zM17 10a4 4 0 0 0-4-4V3H7v3a4 4 0 0 0 0 8v5h4v-5a4 4 0 0 0 4-4zm-6 2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
          </svg>
          <h1 className="text-xl font-bold">ChessChain</h1>
        </Link>
        
        <div className="flex items-center">
          {isConnected && account ? (
            <div className="flex items-center">
              <div className="hidden sm:flex items-center mr-4 text-sm">
                <span className="bg-green-400 rounded-full w-2 h-2 mr-2"></span>
                <span>Connected</span>
              </div>
              <Button 
                variant="accent" 
                className="flex items-center bg-accent hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <svg 
                  className="mr-2" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
                </svg>
                <span>{formatAddress(account)}</span>
              </Button>
            </div>
          ) : (
            <Button 
              variant="accent" 
              className="flex items-center bg-accent hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-lg transition-colors"
              onClick={handleOpenModal}
              disabled={isConnecting}
            >
              <svg 
                className="mr-2" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
              </svg>
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </Button>
          )}
        </div>

        <Web3Modal isOpen={isModalOpen} onClose={handleCloseModal} onConnect={connect} />
      </div>
    </header>
  );
};

export default Header;
