import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  Menu,
  Home
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

const Header = () => {
  const { isConnected } = useAccount();
  const [_, setLocation] = useLocation();

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-amber-500/20 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <motion.div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setLocation('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <Crown className="h-8 w-8 text-amber-400" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-300 animate-pulse" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent">
            ChessChain
          </span>
        </motion.div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-200"
            onClick={() => setLocation('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-200"
            onClick={() => setLocation('/games')}
          >
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </Button>
        </nav>

        {/* Connect Wallet & Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Connect Wallet Button */}
          <div className="hidden sm:block">
            <ConnectButton />
          </div>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-amber-500/30 text-amber-400">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-black/90 border-amber-500/30 backdrop-blur-xl"
            >
              <DropdownMenuItem 
                onClick={() => setLocation('/')}
                className="text-gray-300 hover:text-amber-400 hover:bg-amber-400/10"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLocation('/games')}
                className="text-gray-300 hover:text-amber-400 hover:bg-amber-400/10"
              >
                <Trophy className="mr-2 h-4 w-4" />
                Leaderboard
              </DropdownMenuItem>
              <div className="sm:hidden p-2">
                <ConnectButton />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
