import { Link, useNavigate } from "react-router-dom";
import { Crown, Gamepad2, Users2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Web3Modal from "@/components/Web3Modal";
import SignInModal from "@/components/SignInModal";
import { useWeb3Store } from "@/lib/web3";

const Navbar = () => {
  const navigate = useNavigate();
  const [isWeb3ModalOpen, setIsWeb3ModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { account, isConnected } = useWeb3Store();

  const handleConnectWallet = () => {
    setIsWeb3ModalOpen(true);
  };

  const handleSignIn = () => {
    setIsSignInModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass-nav">
        <nav className="container mx-auto flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Crown className="text-primary" />
            <span>ChessChain</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how" className="hover:text-primary transition-colors">How it works</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            <Link to="/games" className="hover:text-primary transition-colors flex items-center gap-1">
              <Users2 className="size-4"/>Leaderboard
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {isConnected ? (
              <>
                <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={handleSignIn}>
                  <Gamepad2 className="mr-1"/> Sign in
                </Button>
                <Button variant="hero" size="sm">
                  <Wallet className="mr-1"/> {account?.slice(0, 6)}...{account?.slice(-4)}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={handleSignIn}>
                  <Gamepad2 className="mr-1"/> Sign in
                </Button>
                <Button variant="hero" size="sm" onClick={handleConnectWallet}>
                  <Wallet className="mr-1"/> Connect Wallet
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      <Web3Modal 
        isOpen={isWeb3ModalOpen}
        onClose={() => setIsWeb3ModalOpen(false)}
      />

      <SignInModal 
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
